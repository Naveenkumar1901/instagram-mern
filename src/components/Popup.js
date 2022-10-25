import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
} from "@mui/material";
import "../styles/posts.css";
import post from "../img/post.png";
import LoadingButton from "@mui/lab/LoadingButton";
import axiosInstance from "../config/axiosInstance";

const Popup = ({ addPostModalVisible, setAddPostModalVisible, setPosts }) => {
  const [caption, setCaption] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [loading, SetLoading] = useState(false);
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  const uploadFile = async () => {
    const getBase64 = (file) =>
      new Promise(function (resolve, reject) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          console.log(reader.result, "kkkk");
          resolve(reader.result);
        };

        reader.onerror = (error) => reject("Error: ", error);
      });

    getBase64(imageUpload);
    if (imageUpload == null) return;
    SetLoading(true);

    try {
      console.log(imageUpload);
      let formData = new FormData();

      formData.append("imgUrl", imageUpload);
      formData.append("caption", caption);
      formData.append("likes", []);
      formData.append("comments", []);
      formData.append("userId", currentUser.id);
      formData.append("type", imageUpload.type);

      await axiosInstance.post("post/addpost", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { data } = await axiosInstance.get("post/allPosts");
      setPosts(data);
      SetLoading(false);
      setAddPostModalVisible(false);
      setImageUpload(null);
    } catch (error) {
      SetLoading(false);
    }
  };

  return (
    <Dialog
      className="popup-box"
      open={addPostModalVisible}
      onClose={() => setAddPostModalVisible(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogTitle className="dialog-title">
        <p className="title-text">Create new post</p>
      </DialogTitle>
      <DialogContent className="content">
        <div className="dialog-content">
          <img className="post-pic" src={post} alt="" />
          <h1 className="pic-text">Add photos and videos here</h1>
          <Button className="file-upload" variant="contained" component="label">
            <input
              accept="image/*"
              multiple
              type="file"
              onChange={(event) => {
                setImageUpload(event.target.files[0]);
              }}
            />
          </Button>

          <div className="caption-box">
            <TextField
              className="caption-box"
              id="outlined-multiline-static"
              multiline
              rows={1}
              placeholder="Write a caption..."
              variant="standard"
              onChange={(event) => setCaption(event.target.value)}
            />
          </div>
          <LoadingButton loading={loading} onClick={uploadFile}>
            Upload
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default Popup;
