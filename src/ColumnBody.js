import React from 'react'

export default function ColumnBody(props) {
  let tweets;

  if (props.tweets.length) {
    tweets = props.tweets.map(tweet => {
      let text = replaceUrl(tweet.text)
      text = replaceUsername(text)
      return (
        <div className="tweet" key={tweet.id}>
          <div className="card-title tweet-created-at">
            <a href={`https://twitter.com/statuses/${tweet.id_str}`}>{tweet.created_at.format('DD MMM YYYY - h:mm A')}</a>
          </div>
          <div className="card-text">
            <p dangerouslySetInnerHTML={{ __html: text }}></p>
          </div>
        </div>
      )
    })
  } else {
    tweets = <div>Loading...</div>
  }

  return (
    <div className="column-body card-body">
      {tweets}
    </div>
  )
}

function replaceUrl(text) {
  // https://www.regextester.com/53716
  const urlRegex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gmi
  return text.replace(urlRegex, '<a href="$&">$&</a>')
}

function replaceUsername(text) {
  const usernameRegex = /\@\w+/gmi
  return text.replace(usernameRegex, '<a href="https://twitter.com/$&">$&</a>')
}