const Notification = ({ notice }) => {
  if (notice === null) {
    return null
  }

  const colors = {
    success: 'green',
    error: 'red',
    info: 'blue'
  }

  const infoStyle = {
    color: colors[notice.type] || 'blue',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  return (
    <div style={infoStyle}>
      {notice.message}
    </div>
  )
}

export default Notification