/* eslint-disable prettier/prettier */
import mongoose from 'mongoose';
const postSchema = mongoose.Schema(
  {
    postName: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);
const Post = mongoose.model('Post', postSchema);
export default Post;
