import Papa from 'papaparse'

import React, { Component } from 'react';



import
  { FormGroup
  , ControlLabel
  , FormControl
  , HelpBlock
  } from 'react-bootstrap'

export default class UploadCsv extends Component {
  constructor(props) {
    super(props)

    this.handleChangeFile = this.handleChangeFile.bind(this)
    this.onCompleteParse = this.onCompleteParse.bind(this)
  }

  onCompleteParse(csvData) {
    this.props.onSubmit(csvData)
  }

  parseFile(fileInputValue) {
    Papa.parse(fileInputValue, { complete: this.onCompleteParse })
  }

  handleChangeFile(event) {
    const fileInputValue = event.target.files[0]
    this.parseFile(fileInputValue)
  }

  render() {
    return (
      <FormGroup>
        <ControlLabel>CSV File</ControlLabel>
        <FormControl
          type="file"
          onChange={this.handleChangeFile}
        />
        <HelpBlock>Select only .csv exported from Asana Projects</HelpBlock>
      </FormGroup>
    )
  }
}
