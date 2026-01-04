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
    

  const RateButton = ({stateVar, setStateFunc, buttonText}) => {
    return (
      <button onClick={helper(stateVar, setStateFunc)}>{buttonText}</button>
    )
  }

  const Statistics = ({stateVar, rateText}) => {
    return (
      <div>{rateText} {stateVar}</div>
    )
  }

  if (totalNum === 0) {
    return (
      <div>
        <h1>give feedback</h1>
        <RateButton stateVar={good} setStateFunc={setGood} buttonText="good" />
        <RateButton stateVar={neutral} setStateFunc={setNeutral} buttonText="neutral" />
        <RateButton stateVar={bad} setStateFunc={setBad} buttonText="bad"/>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>give feedback</h1>
      <RateButton stateVar={good} setStateFunc={setGood} buttonText="good" />
      <RateButton stateVar={neutral} setStateFunc={setNeutral} buttonText="neutral" />
      <RateButton stateVar={bad} setStateFunc={setBad} buttonText="bad"/>
      <h1>statistics</h1>
      <Statistics stateVar={good} rateText="good" />
      <Statistics stateVar={neutral} rateText="neutral" />
      <Statistics stateVar={bad} rateText="bad" />
      <Statistics stateVar={totalNum} rateText="all" />
      <Statistics stateVar={avgRating} rateText="average" />
      <Statistics stateVar={posPercent} rateText="positive" />
    </div>
  )
  
}

export default App