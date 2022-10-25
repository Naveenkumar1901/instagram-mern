import React, { useState } from "react";
import homeLogo from "../img/title.png";
import homeIcon from "../img/logo.png";
import "../styles/header.css";
import { CgAddR } from "react-icons/cg";
import { GrHomeRounded } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import { IoMdLogOut } from "react-icons/io";
import { Tooltip } from "@mui/material";

export const Header = ({ user, scrollToTop, setPosts }) => {
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Popup
        addPostModalVisible={openPopup}
        setAddPostModalVisible={setOpenPopup}
        setPosts={setPosts}
      />
      <div className="header-container">
        <div className="header-left">
          <img className="app-icon" src={homeIcon} alt="" />
          <img className="home-logo" src={homeLogo} alt="" />
        </div>
        <span className="header-right">
          <Tooltip title="Home">
            <div className="home-icon">
              <GrHomeRounded onClick={scrollToTop} />
            </div>
          </Tooltip>
          <Tooltip title="Add Post">
            <div className="add-post">
              <CgAddR onClick={() => setOpenPopup(true)} />
            </div>
          </Tooltip>
          <Tooltip title={user.name}>
            <div className="header-avatar">{user.name?.at(0)}</div>
          </Tooltip>
          <Tooltip title="Log Out">
            <div className="logout-option">
              <IoMdLogOut
                onClick={() => {
                  sessionStorage.removeItem("currentUser");
                  navigate("/login");
                }}
              />
            </div>
          </Tooltip>
        </span>
      </div>
    </>
  );
};
