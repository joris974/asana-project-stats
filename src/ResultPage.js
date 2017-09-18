import React, { Component } from 'react';
import
  { FormGroup
  , FormControl
  , ControlLabel
  , Col
  , Row
  , Panel
  } from 'react-bootstrap'

import _ from 'lodash';
import BurnDownChart from './BurndownChart.js';

const DEFAULT_POINT_COLUMN_NAME = 'cost'
const DEFAULT_CARRY_OVER_POINT_COLUMN_NAME = 'carryover'

function initialState(props) {
  if (!props.csvData) {
    return (
      { pointColumnIndex: -1
      , carryoverPointColumnIndex: -1
      }
    )
  } else {
    const headerRow = props.csvData.data[0]
    const pointColumnIndex = _.findIndex(headerRow, header => header === DEFAULT_POINT_COLUMN_NAME)
    const carryoverPointColumnIndex = _.findIndex(headerRow, header => header === DEFAULT_CARRY_OVER_POINT_COLUMN_NAME)

    return (
      { pointColumnIndex: pointColumnIndex || -1
      , carryoverPointColumnIndex: carryoverPointColumnIndex || -1
      }
    )
  }
}

export default class ResultPage extends Component {
  constructor(props) {
    super(props)

    this.state = initialState(props)

    this.handleChangePointColumnIndex = this.handleChangePointColumnIndex.bind(this)
    this.handleChangecarryoverColumnIndex = this.handleChangecarryoverColumnIndex.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.state = initialState(nextProps)
  }

  handleChangePointColumnIndex(e) {
    const val = e.target.value
    this.setState({pointColumnIndex: val})
  }

  handleChangecarryoverColumnIndex(e) {
    const val = e.target.value
    this.setState({pointColumnIndex: val})
  }

  render() {
    const {csvData, startDate, endDate} = this.props
    const {pointColumnIndex, carryoverPointColumnIndex} = this.state

    if (csvData === null) {
      return null
    }

    const {data} = csvData
    const headerRow = data[0]

    // Options Cols
    const colOptions = _.map(headerRow, (header, index) => {
      return (
        <option key={index} value={index}>{header}</option>
      )
    })

    return (
      <Row>
        <Col xs={12}>
          <Panel header="Settings" bsStyle="info">
            <Row>
              <Col xs={6}>
                <FormGroup>
                  <ControlLabel>Select Point Column</ControlLabel>
                  <FormControl
                    componentClass="select"
                    onChange={this.handleChangePointColumnIndex}
                    value={pointColumnIndex}
                  >
                    {colOptions}
                  </FormControl>
                </FormGroup>
              </Col>

              <Col xs={6}>
                <FormGroup>
                  <ControlLabel>Select Carry Over Column</ControlLabel>
                  <FormControl
                    componentClass="select"
                    onChange={this.handleChangecarryoverColumnIndex}
                    value={carryoverPointColumnIndex}
                  >
                    {colOptions}
                  </FormControl>
                </FormGroup>
              </Col>
            </Row>
          </Panel>

          <Panel header="Chart and Stats" bsStyle="success">
            <BurnDownChart
              csvData={csvData}
              startDate={startDate}
              endDate={endDate}
              pointColumnIndex={pointColumnIndex}
              carryoverPointColumnIndex={carryoverPointColumnIndex}
            />
          </Panel>
        </Col>
      </Row>
    )
  }
}
