const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  };

  return (
    <div>
      <Header courseName={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  );
}

const Header = (props) => {
  return <h1>{props.courseName}</h1>
};

const Content = (props) => {
  return (
    <div>
      {props.parts.map(part => (
        <Part partNo={part.name} excNo={part.exercises}/>
      ))
      }
    </div>
  )
};

const Part = (props) => {
  return (
    <p>{props.partNo} {props.excNo}</p>
  )
};

const Total = (props) => {
  return (
    <p>Number of exercises {props.parts.reduce((sum, part) => sum + part.exercises, 0)}</p>
  )
};

export default App