import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import { BiChat, BiChevronLeft } from "react-icons/bi";
import axios from 'axios';

const Notification = ({ anchor, open, toggleDrawer, setUnreadCount }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        const response = await axios.get('http://localhost:8081/api/notification/messages', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Role': role
          }
        });
        const messagesWithUnread = response.data.map(msg => ({
          ...msg,
          unread: msg.unread // This should already be a boolean
        }));
        setMessages(messagesWithUnread);
        const initialUnreadCount = messagesWithUnread.filter((msg) => msg.unread).length;
        setUnreadCount(initialUnreadCount);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [setUnreadCount]);

  const handleSelectMessage = async (index) => {
    const selected = messages[index];
    if (selected.unread) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:8081/api/notification/updateStatus', {
          messageId: selected.messageId
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const updatedMessages = messages.map((msg, idx) =>
          idx === index ? { ...msg, unread: false } : msg
        );
        setMessages(updatedMessages);
        setUnreadCount(updatedMessages.filter((msg) => msg.unread).length);
      } catch (error) {
        console.error('Error updating message status:', error);
      }
    }
    setSelectedMessage(selected);
  };

  const handleBack = () => {
    setSelectedMessage(null);
  };

  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 400,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      role="presentation"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #ccc",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", fontSize: "26px", color: "#27374D" }}
        >
          Notification
        </Typography>
        <IconButton onClick={toggleDrawer(anchor, false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      {selectedMessage === null ? (
        <Box sx={{ flexGrow: 1, width: "370px" }}>
          <List>
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                <ListItem
                  disablePadding
                  sx={{
                    backgroundColor: message.unread ? "#EEF7FF" : "inherit",
                    ml: 2,
                    my: 1,
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#EEF7FF",
                      borderRadius: "10px",
                    },
                  }}
                  onClick={() => handleSelectMessage(index)}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <BiChat />
                    </ListItemIcon>
                    <ListItemText primary={message.Content} />
                  </ListItemButton>
                </ListItem>
                {index < messages.length - 1 && (
                  <Divider sx={{ ml: 2, my: 1, borderColor: "#27374D" }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
          <IconButton onClick={handleBack}>
            <BiChevronLeft />
          </IconButton>
          <Typography variant="h6">Message</Typography><br />
          <Typography>Sender: {selectedMessage.Sender}</Typography>
          <Typography>Date: {selectedMessage.Date}</Typography>
          <Typography>Time: {selectedMessage.Time}</Typography><br />
          <Typography>{selectedMessage.Content}</Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <SwipeableDrawer
      anchor={anchor}
      open={open}
      onClose={toggleDrawer(anchor, false)}
      onOpen={toggleDrawer(anchor, true)}
    >
      {list(anchor)}
    </SwipeableDrawer>
  );
};

export default Notification;
