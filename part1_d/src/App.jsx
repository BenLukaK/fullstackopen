import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  const RateButton = ({stateVar, setStateFunc, buttonText}) => {
    return (
      <button onClick={() => setStateFunc(stateVar + 1)}>{buttonText}</button>
    )
  }

  const RateResult = ({stateVar, rateText}) => {
    return (
      <div>{rateText} {stateVar}</div>
    )
  }

  return (
    <div>
      <h1>give feedback</h1>
      <RateButton stateVar={good} setStateFunc={setGood} buttonText="good" />
      <RateButton stateVar={neutral} setStateFunc={setNeutral} buttonText="neutral" />
      <RateButton stateVar={bad} setStateFunc={setBad} buttonText="bad"/>
      <h1>statistics</h1>
      <RateResult stateVar={good} rateText="good" />
      <RateResult stateVar={neutral} rateText="neutral" />
      <RateResult stateVar={bad} rateText="bad" />
    </div>
  )
}

export default App