import React, { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import Posts from "../components/Posts";
import Status from "../components/Status";
import axiosInstance from "../config/axiosInstance";
import "../styles/home.css";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const scrollRef = useRef();
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  const getAllPosts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/post/allPosts");
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllPosts();
  }, []);

  function scrollToTop() {
    scrollRef.current.scrollTop = 0;
  }

  return (
    <div className="home-page">
      {loading ? (
        <loading />
      ) : (
        <>
          <Header
            scrollToTop={scrollToTop}
            user={currentUser}
            setPosts={setPosts}
          />
          <div className="scrollable-container" ref={scrollRef}>
            <Status />
            {posts?.map((post) => (
              <Posts
                caption={post.caption}
                createdAt={post.createdAt}
                imgUrl={post.imgUrl}
                user={post.user[0]}
                likes={post.likes}
                comments={post.comment}
                id={post._id}
                key={post._id}
                type={post.type}
                setPosts={setPosts}
                posts={posts}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
