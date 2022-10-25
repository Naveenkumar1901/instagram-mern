import React, {  useState } from "react";
import "../styles/posts.css";
import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as PlainLikeIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import LoadingButton from "@mui/lab/LoadingButton";
import { TextField, Tooltip } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import axiosInstance from "../config/axiosInstance";
const Posts = ({
  caption,
  createdAt,
  imgUrl,
  likes,
  user,
  comments,
  id,
  type,
  setPosts,
  posts,
}) => {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const [commentValue, setCommentValue] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [loading, SetLoading] = useState(false);

  const handleLike = async (update, postId, likes) => {
    let newLikedArray;
    if (update) {
      newLikedArray = [...likes, currentUser.name];
    } else {
      newLikedArray = likes?.filter((value) => value !== currentUser.id);
    }
    const newPost = posts.map((post) =>
      post._id === postId ? { ...post, likes: newLikedArray } : post
    );
    setPosts(newPost);
    try {
      await axiosInstance.patch("/post/likePost", {
        postId,
        newLikedArray,
      });
    } catch (error) {}
  };

  const handleComment = async (postId) => {
    let newCommentArray;
    if (commentValue.length) {
      SetLoading(true);
      newCommentArray = [
        ...comments,
        { user: currentUser.name, comment: commentValue },
      ];

      const newPost = posts.map((post) =>
        post._id === postId ? { ...post, comment: newCommentArray } : post
      );
      try {
        await axiosInstance.patch("/post/commentPost", {
          postId,
          newCommentArray,
        });
        SetLoading(false);
        setPosts(newPost);
        setCommentValue("");
      } catch (error) {
        SetLoading(false);
      }
    }
  };

  const deletePost = async (id) => {
    try {
      await axiosInstance.delete(`/post/deletePost?id=${id}`);
      const { data } = await axiosInstance.get("post/allPosts");
      setPosts(data);
    } catch (error) {}
  };

  return (
    <>
      <div className="posts-container">
        <div className="each-post">
          <div className="post-header">
            <div className="post-header-seperate">
              <div className="user-avatar">{user?.name.at(0)}</div>
              <h1 className="header-username">{user.name}</h1>
            </div>
            {currentUser.id === user._id && (
              <Tooltip title="Delete Post">
                <div className="delete-post">
                  <AiOutlineDelete onClick={() => deletePost(id, imgUrl)} />
                </div>
              </Tooltip>
            )}
          </div>
          <img
            className="post-image"
            src={`data:image/*;base64,${imgUrl}`}
            alt=""
          />

          <div className="like-section">
            <div className="like-icon">
              {likes?.includes(currentUser.id) ? (
                <HeartIcon
                  className="liked-icon"
                  onClick={() => handleLike(0, id, likes)}
                />
              ) : (
                <PlainLikeIcon
                  className="plain-liked-icon"
                  onClick={() => handleLike(1, id, likes)}
                />
              )}
            </div>
            <h1 className="like-count">
              <p className="count-text">{likes?.length} likes </p>
            </h1>
          </div>
          <div className="caption">
            <h1 className="post-caption">
              <strong className="caption-username">{user.name}</strong>
              {caption?.length > 100 && !showFullCaption ? (
                <p style={{ display: "inline" }}>
                  {caption.substring(0, 50)}{" "}
                  <span
                    style={{
                      cursor: "pointer",
                      color: "#8e8e8e",
                    }}
                    onClick={() => setShowFullCaption(true)}
                  >
                    ... more
                  </span>
                </p>
              ) : showFullCaption ? (
                <p style={{ display: "inline" }}>{caption}</p>
              ) : (
                caption
              )}
            </h1>
          </div>
          <h1 className="time-stamp">
            {createdAt ? moment(createdAt).format("MMM D, h:mm a") : "JUST NOW"}
          </h1>
          {comments?.length ? (
            <p
              className="view-comments"
              onClick={() => setShowComments((prev) => !prev)}
            >
              {!showComments ? "view" : "hide"} all {comments.length} comments
            </p>
          ) : null}
          <div className="added-comments">
            {showComments ? (
              <span className="comments-received">
                {comments?.map((comment, index) => (
                  <p key={index}>
                    <strong className="comment-user">{comment.user}</strong>
                    <span className="comment-content">{comment.comment}</span>
                  </p>
                ))}
              </span>
            ) : null}
          </div>
          <div className="post-comment">
            <TextField
              type="text"
              className="comment-input"
              id="standard-multiline-static"
              multiline
              rows={1}
              placeholder="Add a comment..."
              variant="standard"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
            />

            <LoadingButton
              loading={loading}
              className="comment-submit"
              loadingPosition="middle"
              onClick={() => handleComment(id)}
            >
              Post
            </LoadingButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default Posts;
