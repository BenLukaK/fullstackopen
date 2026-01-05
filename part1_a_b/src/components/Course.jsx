
const Header = ({courseName}) => {
  return <h2>{courseName}</h2>
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} partNo={part.name} excNo={part.exercises}/>
      ))
      }
    </div>
  )
}

const Part = ({partNo, excNo}) => {
  return (
    <p>{partNo} {excNo}</p>
  )
}

const Total = ({parts}) => {
  return (
    <h3>Total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</h3>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header courseName={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course