const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();
const port = process.env.PORT || 5000;

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

//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);

// configure routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // set a static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
