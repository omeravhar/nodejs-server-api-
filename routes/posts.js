const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Post, validate } = require('../models/post');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const posts = await Post.find().populate('postBy', 'name').sort('title');
  res.send(posts);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let post = new Post({ title: req.body.title, article: req.body.article, postBy: req.user._id });
  post = await post.save();
  const newPost = await Post.findById(post.id).populate('postBy', 'name');
  res.send(newPost);
  req.io.sockets.emit('message', { action: 'addPost', newPost: newPost });
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const post = await Post.findByIdAndUpdate(req.params.id, { title: req.body.title, article: req.body.article }, {
    new: true
  });

  if (!post) return res.status(404).send('The post with the given ID was not found.');

  res.send(post);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const post = await Post.findByIdAndRemove(req.params.id);

  if (!post) return res.status(404).send('The post with the given ID was not found.');

  res.send(post);
});

router.get('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).send('The post with the given ID was not found.');

  res.send(post);
});

module.exports = router;