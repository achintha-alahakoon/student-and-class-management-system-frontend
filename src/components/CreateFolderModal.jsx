// CreateFolderModal.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CreateFolderModal = ({ open, onClose, onCreate }) => {
  const [folderName, setFolderName] = useState("");

  const handleCreate = () => {
    onCreate(folderName);
    setFolderName("");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create New Folder
        </Typography>
        <TextField
          fullWidth
          label="Folder Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" onClick={handleCreate}>
          Create
        </Button>
      </Box>
    </Modal>
  );
};

CreateFolderModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreateFolderModal;
