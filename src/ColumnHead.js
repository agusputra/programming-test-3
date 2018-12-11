import React from 'react'

export default function ColumnHead(props) {
  return (
    <div className="column-head card-header"><strong>Tweets by <a href={`https://twitter.com/${props.title}`}>{props.title}</a></strong></div>
  )
}