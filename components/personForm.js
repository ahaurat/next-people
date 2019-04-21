import { Component } from 'react'
import { Form, Icon, Message, Segment } from 'semantic-ui-react'
import axios from 'axios'
import NoSSR from 'react-no-ssr'
import DatePicker from 'react-datepicker'

export default class PersonForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: false,
      success: false,
      name: '',
      email: '',
      birthday: '',
      zipCode: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
  }

  handleChange(e, { name, value }) {
    this.setState({
      [name]: value,
      error: false,
      success: false
    })
  }

  handleDateChange(date) {
    this.setState({birthday: date})
  }

  async handleSubmit() {
    const { name, email, birthday, zipCode } = this.state
    // Basic client side validation
    if (!name || !email) {
      this.setState({error: 'Name and Email are required'})
      return
    }

    // Practical version of RFC 5322
    // https://www.regular-expressions.info/email.html
    const emailRegex = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (email && ! emailRegex.test(email)) {
      this.setState({error: 'Invalid email address'})
      return
    }

    if (zipCode && ! /^\d{5}$/.test(zipCode)) {
      this.setState({error: 'Invalid ZIP Code (please use a 5 digit ZIP)'})
      return
    }

    const { onSubmit } = this.props
    const response = await axios.post('/api/person', {
      name,
      email,
      birthday,
      zipCode
    })

    if (typeof onSubmit === 'function') onSubmit()

    if (response.status != 200) {
      this.setState({error: response.data.message})
    }
    else {
      this.setState({
        error: false,
        success: true,
        successName: name,
        name: '',
        email: '',
        birthday: '',
        zipCode: ''
      })
    }
  }

  render() {
    const { name, email, birthday, zipCode, error, success, successName } = this.state

    return(
      <div className='person-form'>
        <Form size='large' onSubmit={this.handleSubmit} error={error} success={success}>
          <Segment>
            <Form.Group widths='equal'>
              <Form.Input
                fluid
                placeholder='Name'
                label={<label><Icon name='user'/> Name</label>}
                name='name'
                value={name}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                type='email'
                placeholder='Email address'
                label={<label><Icon name='envelope'/> Email address</label>}
                name='email'
                value={email}
                onChange={this.handleChange}
              />
              <Form.Field placeholder='Birthday'>
                <label><span><Icon name='birthday cake'/> Birthday</span></label>
                <NoSSR>
                  <DatePicker
                    selected={birthday || null}
                    name='birthday'
                    onChange={this.handleDateChange}
                    placeholderText='Birthday'
                  />
                </NoSSR>
              </Form.Field>
              <Form.Input
                fluid
                placeholder='ZIP Code'
                label={<label><Icon name='map marker alternate'/> ZIP Code</label>}
                name='zipCode'
                value={zipCode}
                onChange={this.handleChange}
              />
              <Form.Button color='blue' fluid size='large' content='Add Person' className='add-person-btn' />
            </Form.Group>
            {(success || error) && (
              <Message
              error={!!error}
              success={!!success}
              content={error ? error : `Successfully added ${successName}`}
            />
            )}
          </Segment>
          {/* Occupies the error/success message space so the form doesn't jump around */}
          {!error && !success && <div style={{height: '33px'}} />}
        </Form>
        <style jsx>{`
          .person-form {
            margin-bottom: 14px !important;
            width: 1100px;
            max-width: 90vw;
            margin: auto;
          }
        `}</style>
      </div>
    )
  }
}