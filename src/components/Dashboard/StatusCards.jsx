import React from 'react'

function StatusCards({title, body}) {
  return (
    <div className="card">
      <div className="card-body">
        <h6 className="card-title">{title}</h6>
        <p className="card-text">{body}</p>
      </div>
    </div>
  );
}

export default StatusCards