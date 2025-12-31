import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const totalNum = good + neutral + bad;
  const avgRating = totalNum === 0 ? 0 : (good * 1 + neutral * 0 + bad * -1) / totalNum;
  const posPercent = totalNum === 0 ? 0 : good / totalNum;


  const helper = (stateVar, setStateFunc) => {
    return () => {
      setStateFunc(stateVar + 1); 
    }
  };

  const RateButton = ({stateVar, setStateFunc, buttonText}) => {
    return (
      <button onClick={helper(stateVar, setStateFunc, buttonText)}>{buttonText}</button>
    )
  };

  const RateResult = ({stateVar, rateText}) => {
    return (
      <div>{rateText} {stateVar}</div>
    )
  };

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
      <RateResult stateVar={totalNum} rateText="all" />
      <RateResult stateVar={avgRating} rateText="average" />
      <RateResult stateVar={posPercent} rateText="positive" />
    </div>
  );
}

export default App