import React, { useState, useEffect } from "react";
import { BiNotification, BiSearch } from "react-icons/bi";
import AvatarComponent from "./AvatarComponent";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import AdminNotification from "./AdminNotification";
import Notification from "./Notification";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 'auto',
    left: 10,
    top: -8,
    backgroundColor: '#27374d',
    color: '#FFF',
  },
}));

const ContentHeader = ({ header }) => {
  const [state, setState] = useState({ right: false });
  const [unreadCount, setUnreadCount] = useState(0);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Fetch the role from local storage
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const renderNotificationComponent = () => {
    if (role === 'Admin') {
      return (
        <AdminNotification
          anchor="right"
          open={state.right}
          toggleDrawer={toggleDrawer}
          setUnreadCount={setUnreadCount}
        />
      );
    } else {
      return (
        <Notification
          anchor="right"
          open={state.right}
          toggleDrawer={toggleDrawer}
          setUnreadCount={setUnreadCount}
        />
      );
    }
  };

  return (
    <div className="content-header">
      <h2 className="header-title">{header}</h2>
      <div className="header-activity">
        <div>
          {renderNotificationComponent()}
        </div>
        <div className="search-box">
          <input type="text" placeholder="Search" />
          <BiSearch className="icon" />
        </div>
        <div className="notification" onClick={toggleDrawer("right", true)}>
          <StyledBadge badgeContent={unreadCount}>
            <BiNotification className="icon" />
          </StyledBadge>
        </div>
        <div className="avatar">
          <AvatarComponent />
        </div>
      </div>
    </div>
  );
};

export default ContentHeader;
