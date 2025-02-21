const express = require('express')
const app = express()
const uuid = require('uuid');
const db = require('./db');
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

db.connect(function(err) {
  if (err) throw err;
});

app.post('/api/users', (req, res) => {
  var username = req.body.username;
  var id = uuid.v4();

  db.query('insert into users(_id, username) values($1, $2);', [id, username]);

  res.json({
    username: username,
    _id: id,
  });
});

app.post('/api/users/:_id/exercises', (req, res) => {
  var description = req.body.description;
  var duration = req.body.duration;
  var date = req.body.date;
  var id = req.params._id;

  var username = db.query(`select top 1 username from users where _id = ${id}`);

  db.query(`insert into exercises(description, duration, date, userId) values(${description}, ${duration}, ${date}, ${id})`);

  res.json({
    username: username,
    description: description,
    duration: duration,
    date: date,
    _id: id,
  });
});

app.get('/api/users/:_id/logs?[from][&to][&limit]', (req, res) => {
  var id = req.params.id;
  var from = req.params.from;
  var to = req.params.to;
  var limit = req.params.limit;

});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
