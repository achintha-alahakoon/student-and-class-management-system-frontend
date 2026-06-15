import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import Divider from '@mui/material/Divider';

const Folder = ({ name }) => {
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadDate, setUploadDate] = useState(null);

  const handleFolderClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const formData = new FormData();
      formData.append('file', files[0]); // Assuming only one file is selected
      formData.append('folder', name); // Add folder name to the form data

      // Log the FormData entries
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      try {
        const response = await fetch('http://localhost:8081/api/lectureMaterial/upload', {
          method: 'POST',
          body: formData,
        });

        console.log('Response:', response);

        if (!response.ok) {
          const errorText = await response.text(); // Get error message from response
          throw new Error(`Failed to upload file: ${errorText}`);
        }

        const result = await response.json();
        console.log('Uploaded file:', result);
        setUploadStatus('Uploaded');
        setUploadDate(new Date());
      } catch (error) {
        console.error('Error uploading file:', error.message);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginBottom: 2,
        cursor: "pointer",
        color: "#526d82",
        border: "1px solid #dde6ed",
        borderRadius: "10px",
        padding: "15px 15px",
        transition: "background-color 0.3s ease-in-out",
        "&:hover": {
          backgroundColor: "#dde6ed",
        },
      }}
    >
      <div className="folder-icon">
        <IconButton aria-label="folder" size="large" onClick={handleFolderClick}>
          <FolderOutlinedIcon fontSize="large" sx={{ color: "#fff" }} />
        </IconButton>
      </div>

      <div>
        <Typography variant="body1" sx={{ marginLeft: 2 }} onClick={handleFolderClick}>
          {name}
        </Typography>

        <Divider orientation="horizontal" flexItem sx={{ bgcolor: "#27374d", height: 1, marginTop: 0.5, marginBottom: 0.5, marginLeft: 2, width: "900px" }} />

        <div className="folder-details" style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '1rem' }}>
          {uploadStatus && (
            <Typography variant="body2">{uploadStatus} - {uploadDate.toLocaleString()}</Typography>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </Box>
  );
};

Folder.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Folder;

