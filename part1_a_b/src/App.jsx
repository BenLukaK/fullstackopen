
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

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <h1>Web Development Curriculum</h1>
      {courses.map(course => <Course key={course.id} course={course} />)}
    </div>
  )
}



export default App