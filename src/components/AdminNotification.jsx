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
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import SendNotification from "./SendNotification";
import axios from 'axios';

const AdminNotification = ({ anchor, open, toggleDrawer, setUnreadCount }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showComposeMessage, setShowComposeMessage] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        const response = await axios.get('http://localhost:8081/api/notification/messages', {
          headers: {
            'Authorization': token,
            'Role': role
          }
        });
        setMessages(response.data);
        const initialUnreadCount = response.data.filter((msg) => msg.unread).length;
        setUnreadCount(initialUnreadCount);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [setUnreadCount]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const updatedMessages = [...messages, { text: newMessage, unread: true }];
      setMessages(updatedMessages);
      setNewMessage("");
      setUnreadCount(updatedMessages.filter((msg) => msg.unread).length);
    }
  };

  const handleSelectMessage = (index) => {
    const updatedMessages = messages.map((msg, idx) =>
      idx === index ? { ...msg, unread: false } : msg
    );
    setMessages(updatedMessages);
    setSelectedMessage(messages[index]);
    setUnreadCount(updatedMessages.filter((msg) => msg.unread).length);
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
                    <ListItemText primary={message.text} />
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
          <Typography variant="h6">Message</Typography>
          <Typography>{selectedMessage.text}</Typography>
        </Box>
      )}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "flex-end",
          mb: 3,
        }}
      >
        <Fab
          aria-label="add"
          sx={{ color: "#fff", backgroundColor: "#526d82", ":hover": { backgroundColor: "#27374D", color: "#EEF7FF" } }}
          onClick={() => setShowComposeMessage(true)}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );

  return (
    <SwipeableDrawer
      anchor={anchor}
      open={open}
      onClose={toggleDrawer(anchor, false)}
      onOpen={toggleDrawer(anchor, true)}
    >
      {showComposeMessage ? (
        <SendNotification
          handleSendMessage={handleSendMessage}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          setShowComposeMessage={setShowComposeMessage}
        />
      ) : (
        list(anchor)
      )}
    </SwipeableDrawer>
  );
};

export default AdminNotification;
