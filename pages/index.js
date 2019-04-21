import axios from 'axios'
import Head from 'next/head'
import { Component } from 'react'
import { Header } from 'semantic-ui-react'

import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbreact/dist/css/mdb.css'
import 'semantic-ui-css/semantic.min.css'
import 'react-datepicker/dist/react-datepicker.css'
import PersonForm from '../components/personForm'
import PersonTable from '../components/personTable'

export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: [
        /*
        // Spec from 
        {
          label: String (displayed column label),
          field: String (corresponding key for cells),
          width: Number (Optional minimal column width in px),
          sort: String (Optional, 'asc'/'desc'/'disabled', describes the initial sorting directory, or disables column sorting),
          attributes: {
            "attribute": "value"
          } : Object collection (Optional, sets html attributes of the element | i.e. "aria-controls", "aria-label")
        }
        */
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
          width: 100
        },
        {
          label: 'Email',
          field: 'email',
          sort: 'asc',
          width: 100
        },
        {
          label: 'Birthday',
          field: 'birthday',
          sort: 'asc',
          width: 100
        },
        {
          label: 'ZIP Code',
          field: 'zipCode',
          sort: 'asc',
          width: 100
        },
        {
          label: '',
          sortable: false,
          field: 'delete',
          width: 50
        },
      ],
      rows: []
    }
  }

  updatePeopleRows = async () => {
    const res = await axios.get('/api/person')
    const people = res.data

    const rows = people.map(person => {
      const { _id, name, email, birthday, zipCode } = person
      return { id: _id, name, email, birthday, zipCode }
    })
    
    this.setState({rows})
  }

  componentDidMount() {
    this.updatePeopleRows()
  }
  
  render() {
    const { columns, rows } = this.state
    const tableData = { columns, rows }

    return (
      <div className='page home'>
        <Head>
          <title>People App</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
            key="viewport"
          />
        </Head>

        <Header as='h1' textAlign='center'>
          <img src='/static/disney.jpg' /> People
        </Header>
        
        <PersonForm onSubmit={this.updatePeopleRows} />
        
        {!!tableData.rows.length && (
          <PersonTable data={tableData} onDelete={this.updatePeopleRows}/>
        )}
        
        <style global jsx>{`
          // Global styles
          body {
            min-height: 100vh;
            margin: 0;
            padding-top: 130px;
            display: flex;
            justify-content: center;
            background-color: #1104BC;
          }

          h1 {
            color: white !important;
            font-weight: 100 !important;
          }

          h1 img {
            width: 150px !important;
            margin: 0 -10px 6px 0 !important;
          }

          .dataTables_wrapper {
            background: white;
            padding: 14px;
            border-radius: 4px;
          }

          .react-datepicker-wrapper,
          .react-datepicker__input-container {
            width: 100%;
          }

          .ui.message {
            margin-bottom: 0 !important;
          }

          @media all and (min-width: 768px) {
            .add-person-btn .button {
              margin-top: 22px !important;
            }
          }
        `}</style>
      </div>
    )
  }
}