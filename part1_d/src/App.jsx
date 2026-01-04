import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const totalNum = good + neutral + bad;
  const avgRating = (good * 1 + neutral * 0 + bad * -1) / totalNum;
  const posPercent = `${(good / totalNum) * 100} %`;


  const helper = (stateVar, setStateFunc) => () =>
      setStateFunc(stateVar + 1)
    

  const RateButton = ({stateVar, setStateFunc, text}) => {
    return (
      <button onClick={helper(stateVar, setStateFunc)}>{text}</button>
    )
  }

  const Statistics = () => {
    if (totalNum === 0) {
      return (
        <div>
          <h1>statistics</h1>
          <p>No feedback given</p>
        </div>
      )
    }
    return (
      <div>
        <h1>statistics</h1>
        <StatisticLine value={good} text="good" />
        <StatisticLine value={neutral} text="neutral" />
        <StatisticLine value={bad} text="bad" />
        <StatisticLine value={totalNum} text="all" />
        <StatisticLine value={avgRating} text="average" />
        <StatisticLine value={posPercent} text="positive" />
      </div>
    )
  }


  const StatisticLine = ({value, text}) => {
    return (
      <div>{text} {value}</div>
    )
  }

  return (
    <div>
      <h1>give feedback</h1>
      <RateButton stateVar={good} setStateFunc={setGood} text="good" />
      <RateButton stateVar={neutral} setStateFunc={setNeutral} text="neutral" />
      <RateButton stateVar={bad} setStateFunc={setBad} text="bad"/>
      <Statistics />
    </div>
  )
}

export default App