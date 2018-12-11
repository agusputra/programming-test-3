const spawn = require('child_process').spawn
const express = require('express')

spawn('twitter-proxy')
spawn('http-server')

const puts = console.log.bind(console)
const app = express()

console.log('Server running on http://localhost:8080')
console.log('Request the Twitter API using: http://localhost:7890/1.1/statuses/user_timeline.json\?count\=30\&screen_name\=makeschool')

app.use(express.static('build'));
app.use((req, res, cb) => {
  res.render = (filePath) => res.sendFile(`${__dirname}/${filePath}`);
  cb()
});

app.get("/", (req, res) => {
  res.render('index.html')
});

const listener = app.listen(process.env.PORT, () => {
  puts(`Node.js ${process.version} - Listening on port ${listener.address().port}`);
});