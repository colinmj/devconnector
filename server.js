const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();
const port = process.env.PORT || 3000;

//body parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

//db config
const db = require('./config/keys').MONG0_URI;

//connect to mongo, this returns a promise
mongoose
  .connect(db)
  .then(res => {
    console.log('connected');
  })
  .catch(e => {
    console.log(e);
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// configure routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
