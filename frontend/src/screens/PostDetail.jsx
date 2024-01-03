import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetPostDetailsQuery } from "../slices/postSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const PostDetail = () => {
  const { postId } = useParams();
  const { data: post, isLoading, error } = useGetPostDetailsQuery(postId);

  return (
    <div className="container mt-4">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="post-content">
          <div className="post-header">
            <h1>{post.post.name}</h1>
            <img
              src={post.post.img}
              alt={post.post.content}
              className="img-fluid rounded post-image"
            />
          </div>
          <p className="fs-5">{post.post.content}</p>
          <Link to="/post" className="btn btn-primary">
            Quay Lại
          </Link>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
