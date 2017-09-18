import React, { Component } from 'react';
import moment from 'moment'
import Form from './Form.js'
import ResultPage from './ResultPage.js'
import
  { Grid
  , Row
  , Col
  , Panel
  } from 'react-bootstrap'

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state =
      { startDate: moment()
      , endDate: moment().add(14, 'days')
      , csvData: null
      }
    this.handleChangeStart = this.handleChangeStart.bind(this)
    this.handleChangeEnd = this.handleChangeEnd.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeStart(startDateStr) {
   this.setState({startDate: moment(startDateStr)})
 }

  handleChangeEnd(endDateStr) {
   this.setState({endDate: moment(endDateStr)})
 }

  handleSubmit(csvData) {
   this.setState({csvData})
 }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h1>Burdown Chart for Asana Projects</h1>
          </Col>
        </Row>

        <Panel header="Input" bsStyle="primary">
          <Form
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            handleChangeStart={this.handleChangeStart}
            handleChangeEnd={this.handleChangeEnd}
            handleSubmit={this.handleSubmit}
          />
        </Panel>

        <ResultPage
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          csvData={this.state.csvData}
        />
      </Grid>
    )
  }
}
