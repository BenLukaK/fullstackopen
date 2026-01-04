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
        <table>
          <tbody>
            <StatisticLine value={good} text="good" key="1" />
            <StatisticLine value={neutral} text="neutral" key="2" />
            <StatisticLine value={bad} text="bad" key="3" />
            <StatisticLine value={totalNum} text="all" key="4" />
            <StatisticLine value={avgRating} text="average" key="5" />
            <StatisticLine value={posPercent} text="positive" key="6" />
          </tbody>
        </table>
      </div>
    )
  }


  const StatisticLine = ({value, text, id}) => {
    return (
      <tr key={id}>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
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