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

app.get('/api/users', async (req, res) => {
  var result = await db.query('select * from users;');
  var users = result.rows;
  res.json(users);
})

app.post('/api/users', async (req, res) => {
  var username = req.body.username;
  var id = uuid.v4();

  await db.query('insert into users(_id, username) values($1, $2);', [id, username]);

  res.json({
    username: username,
    _id: id,
  });
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  var description = req.body.description;
  var duration = req.body.duration;
  var date = req.body.date ?? new Date().toDateString();
  var id = req.params._id;

  var result = await db.query('select username from users where _id = $1;', [id]);
  var username = result.rows[0].username;

  await db.query('insert into exercises(description, duration, date, userId) values($1, $2, $3, $4);', [description, duration, date, id]);

  res.json({
    username: username,
    description: description,
    duration: parseInt(duration),
    date: date,
    _id: id,
  });
});

app.get('/api/users/:_id/logs', async (req, res) => {
  var id = req.params._id;

  var query = 'select description, duration, date from exercises where userid = $1';
  var from = req.query.from;
  var to = req.query.to;
  var limit = req.query.limit;

  if (from) {
    query += ' and date >= $2::date';
  } else {
    query += ' and (true or $2 = $2)';
  }

  if (to) {
    query += ' and date <= $3::date';
  } else {
    query += ' and (true or $3 = $3)';
  }

  if (limit) {
    query += ' limit $4';
  } else {
    query += ' and (true or $4 = $4)';
  }

  var result = await db.query('select username from users where _id = $1', [id]);
  var username = result.rows[0].username;

  result = await db.query(query, [id, from, to, limit]);
  var log = result.rows.map(exercise => ({
    ...exercise,
    date: new Date(exercise.date).toDateString(),
  }));
  var count = result.rowCount;

  res.json({
    username: username,
    count: count,
    _id: id,
    log: log,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
