import mongoose from 'mongoose';
const postSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    img: {
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
  }
);
const Post = mongoose.model('Post', postSchema);
export default Post;
