import { Component } from 'react'
import { Button } from 'semantic-ui-react'
import { MDBDataTable } from 'mdbreact'
import axios from 'axios'

export default class PersonTable extends Component {
  constructor(props) {
    super(props)
  }

  deletePerson(id) {
    const { onDelete } = this.props
    axios.delete(`/api/person/${id}`)
    if (typeof onDelete === 'function') onDelete()
  }

  render() {
    let { data } = this.props

    // Remove the id and add a delete button
    data.rows = data.rows.map(r => {
      const { id } = r
      const btn = (
        <Button
          icon='delete'
          content='Delete'
          onClick={() => this.deletePerson(id)}
        />
      )
      delete r.id

      const bday = new Date(r.birthday)
      // Handle pesky UTC conversion (otherwise the birthday is off by 1 day)
      r.birthday = r.birthday && (bday.getUTCMonth() + 1) + '/' + bday.getUTCDate() + '/' +  bday.getUTCFullYear()
      return {...r, delete: btn}
    })

    return (
      <MDBDataTable
        striped
        bordered
        hover
        data={data}
        info={false}
        paging={false}
        searching={false}
        order={['name', 'asc']}
      />
    )
  }
}