import React, { Component } from 'react';
import
  { Col
  , Row
  } from 'react-bootstrap'

import _ from 'lodash';
import { Chart } from 'react-google-charts';

export default class BurnDownChart extends Component {
  render() {
    const
      { csvData
      , startDate
      , endDate
      , pointColumnIndex
      , carryoverPointColumnIndex
      } = this.props

    if (csvData === null || pointColumnIndex === -1 || carryoverPointColumnIndex === -1) {
      return null
    }

    const {stats, chartData} = getTotalCost(csvData, startDate, endDate, pointColumnIndex, carryoverPointColumnIndex)

    const chartOptions =
      { title: 'Burdown Chart'
      , hAxis: { title: 'Time'}
      , vAxis: { title: 'Points'}
      , legend: 'none'
      }

    return (
      <Row>
        <Col xs={12}>
          <Row>
            <Col xs={12}>
              <ul>
                <li>
                  <b>Total points: {stats.numPoints}</b>
                  <ul>
                    <li>New Stories points: {stats.numNewPoints}</li>
                    <li>Carryover Stories points: {stats.numCarryoverPoints}</li>
                  </ul>
                </li>
                <li>
                  <b>Number of Stories: {stats.numStories}</b>
                  <ul>
                    <li>Number of New Stories: {stats.numNewStories}</li>
                    <li>Number of Carryover Stories: {stats.numCarryoverStories}</li>
                  </ul>
                </li>

                <li>
                  <b>Number of Stories completed: {stats.numStoriesCompleted}</b>
                  <ul>
                    <li>Number of New Stories completed: {stats.numNewStoriesCompleted}</li>
                    <li>Number of Carryover Stories completed: {stats.numCarryoverStoriesCompleted}</li>
                  </ul>
                </li>
                <li>
                  <b>Number of Points completed: {stats.numPointsCompleted}</b> <br />
                  <ul>
                    <li>New Stories points: {stats.numNewPointsCompleted}</li>
                    <li>Carryover Stories points: {stats.numCarryoverPointsCompleted}</li>
                  </ul>
                </li>
              </ul>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Chart
                chartType="LineChart"
                data={chartData}
                graph_id="LineChart"
                width="100%"
                height="400px"
                options={chartOptions}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

function getTotalCost(csvData, startDate, endDate, pointColumnIndex, carryoverPointColumnIndex) {
  const {data} = csvData

  const headerRow = data[0]
  const completedAtIndex = _.findIndex(headerRow, header => header === "Completed At")

  const tasksData = _.tail(data)
  const stats = _.reduce(tasksData, (acc, taskRow) => {
      const taskInitialCost = parseInt(taskRow[pointColumnIndex], 10) || 0
      const hasCarryover = taskRow[carryoverPointColumnIndex] !== ""

      // If task has carry over, we take the carry over
      const taskActualCost =
        hasCarryover ?
          parseInt(taskRow[carryoverPointColumnIndex], 10) :
          taskInitialCost

      const isCompleted = taskRow[completedAtIndex] !== ""

      return (
        { numPoints: acc.numPoints + taskActualCost
        , numNewPoints: acc.numNewPoints + (hasCarryover ? 0 : taskActualCost)
        , numCarryoverPoints: acc.numCarryoverPoints + (hasCarryover ? taskActualCost : 0)

        , numStories: acc.numStories + 1
        , numNewStories:  acc.numNewStories + (hasCarryover ? 0 : 1)
        , numCarryoverStories: acc.numCarryoverStories + (hasCarryover ? 1 : 0)

        , numStoriesCompleted: acc.numStoriesCompleted + (isCompleted ? 1 : 0)
        , numNewStoriesCompleted: acc.numNewStoriesCompleted + (isCompleted ? (hasCarryover ? 0 : 1) : 0)
        , numCarryoverStoriesCompleted: acc.numCarryoverStoriesCompleted + (isCompleted ? (hasCarryover ? 1 : 0) : 0)

        , numPointsCompleted: acc.numPointsCompleted + (isCompleted ? taskActualCost : 0)
        , numNewPointsCompleted: acc.numNewPointsCompleted + (isCompleted ? (hasCarryover ? 0 : taskActualCost) : 0)
        , numCarryoverPointsCompleted: acc.numCarryoverPointsCompleted + (isCompleted ? (hasCarryover ? taskActualCost : 0) : 0)

        }
      )
    },
    { numPoints: 0
    , numNewPoints: 0
    , numCarryoverPoints: 0

    , numStories: 0
    , numNewStories: 0
    , numCarryoverStories: 0

    , numStoriesCompleted: 0
    , numNewStoriesCompleted: 0
    , numCarryoverStoriesCompleted: 0

    , numPointsCompleted: 0
    , numNewPointsCompleted: 0
    , numCarryoverPointsCompleted: 0
    }
  )

  const numDays = endDate.diff(startDate, 'days')
  const normalDecreaseRate = stats.numPoints/numDays

  const currentDate = startDate
  const burnDownArDates = []
  var i = 0
  var numPointsRemaining = stats.numPoints

  while (currentDate < endDate) {
    const normalPointValue = stats.numPoints - i * normalDecreaseRate
    const taskCompletedOnCurrentDay = _.filter(tasksData, taskRow => {
      const completedAtValue = taskRow[completedAtIndex]
      if (completedAtValue === "") {
        return false
      }
      return currentDate.isSame(completedAtValue, 'day')
    })
    const numPointsCompletedOnCurrentDay = _.reduce(taskCompletedOnCurrentDay, (acc, taskRow) => {
        const taskCost = parseInt(taskRow[pointColumnIndex], 10) || 0
        return acc + taskCost
      }, 0)

    numPointsRemaining = numPointsRemaining - numPointsCompletedOnCurrentDay

    burnDownArDates[i] =
      [ currentDate.format('MM/DD')
      , normalPointValue
      , numPointsRemaining
      ]

    currentDate.add(1, 'day')
    i = i + 1
  }

  const chartData =
    [ ['Date', 'Standard BurnDown', 'Actual BurnDown']
    , ...burnDownArDates
    ]
  console.log(chartData)

  return (
    { stats
    , chartData
    }
  )
}
