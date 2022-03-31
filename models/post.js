const Joi = require('joi');
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  article: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 4000
  },
  postBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Post = mongoose.model('Post', postSchema);

function validatePost(post) {
  const schema = {
    title: Joi.string().min(3).max(255).required(),
    article: Joi.string().min(3).max(4000).required()
  };

  return Joi.validate(post, schema);
}

exports.postSchema = postSchema;
exports.Post = Post;
exports.validate = validatePost;