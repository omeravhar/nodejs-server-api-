const config = require('config');
const cors = require('cors')
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const users = require('./routes/users');
const auth = require('./routes/auth');
const posts = require('./routes/posts');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/eshop')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/posts', posts);

io.on('connection', () => {
  console.log('a user is connected');
});

const port = process.env.PORT || 3000;
http.listen(port, () => console.log(`Listening on port ${port}...`));