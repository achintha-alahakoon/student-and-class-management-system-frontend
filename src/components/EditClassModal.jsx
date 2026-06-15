import React, { useState } from "react";
import { Modal, Box, TextField, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };
  
  const EditClassModal = ({ open, handleClose, classData, handleSave }) => {
    const [formData, setFormData] = useState(classData);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleSubmit = () => {
      handleSave(formData);
    };
  
    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <h2>Edit Class</h2>
          <TextField
            label="Subject"
            name="Subject"
            value={formData.Subject}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tutor"
            name="Tutor"
            value={formData.Tutor}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Grade"
            name="Grade"
            value={formData.Grade}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Repeat On"
            name="Repeat_On"
            value={formData.Repeat_On}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Hall Number"
            name="Hall_Num"
            value={formData.Hall_Num}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Time"
            name="Start_Time"
            value={formData.Start_Time}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Time"
            name="End_Time"
            value={formData.End_Time}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        </Box>
      </Modal>
    );
  };
  
  export default EditClassModal;
  