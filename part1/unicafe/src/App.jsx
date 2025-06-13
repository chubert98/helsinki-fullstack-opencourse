import { useState } from "react";

const Header = ({ text }) => {
  return (
    <h1>{text}</h1>
  )
}

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const Statistics = (props) => {
  if (props.total === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine text={"good"} value={props.good} />
        <StatisticLine text={"neutral"} value={props.neutral} />
        <StatisticLine text={"bad"} value={props.bad}/>
        <StatisticLine text={"all"} value={props.total}/>
        <StatisticLine text={"average"} value={props.average}/>
        <StatisticLine text={"posivite"} value={props.positive+"%"}/>
      </tbody>
    </table>
  )
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const App = () => {
  //save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)
  const feedbackValues = {
    good: 1,
    neutral: 0,
    bad: -1
  }

  const handleGoodClick = () => {
    let updatedGood = good + 1
    let updatedTotal = total + 1
    setGood(updatedGood)
    setTotal(updatedTotal)
    setAverage(
      (
        updatedGood * feedbackValues.good
        + neutral * feedbackValues.neutral
        + bad * feedbackValues.bad
      )/updatedTotal
    )
    setPositive(updatedGood / updatedTotal * 100)
  }

  const handleNeutralClick = () => {
    let updatedNeutral = neutral + 1
    let updatedTotal = total + 1
    setNeutral(updatedNeutral)
    setTotal(updatedTotal)
    setAverage(
      (
        good * feedbackValues.good
        + updatedNeutral * feedbackValues.neutral
        + bad * feedbackValues.bad
      )/updatedTotal
    )
    setPositive(good / updatedTotal * 100)
  }

  const handleBadClick = () => {
    let updatedBad = bad + 1
    let updatedTotal = total + 1
    setBad(updatedBad)
    setTotal(updatedTotal)
    setAverage(
      (
        good * feedbackValues.good
        + neutral * feedbackValues.neutral
        + updatedBad * feedbackValues.bad
      )/updatedTotal
    )
    setPositive(good / updatedTotal * 100)
  }

  return (
    <div>
      <Header text="give feedback"/>
      <Button onClick={handleGoodClick} text="Good"></Button>
      <Button onClick={handleNeutralClick} text="Neutral"></Button>
      <Button onClick={handleBadClick} text="Bad"></Button>
      <Header text="statistics"/>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positive={positive}
      />
    </div>
  )
}

export default App
