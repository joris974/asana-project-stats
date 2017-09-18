import React, { Component } from 'react';
import UploadCsv from './UploadCsv.js';
import DatePicker from 'react-bootstrap-date-picker'

import
  { Row
  , Col
  , ControlLabel
  , FormGroup
  } from 'react-bootstrap'

export default class FormPage extends Component {
  render() {
    return (
      <Row>
        <Col xs={12}>
          <Row>
            <Col xs={6}>
              <FormGroup>
                <ControlLabel>Start Date</ControlLabel>
                <DatePicker
                  value={this.props.startDate.format()}
                  onChange={this.props.handleChangeStart}
                />
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup>
                <ControlLabel>End Date</ControlLabel>
                <DatePicker
                  value={this.props.endDate.format()}
                  onChange={this.props.handleChangeEnd}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <UploadCsv
                onSubmit={this.props.handleSubmit}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
