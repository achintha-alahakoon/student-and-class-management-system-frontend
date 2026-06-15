import React, { useRef } from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import Divider from '@mui/material/Divider';

const StudentFolder = ({ folders }) => {
  const fileInputRef = useRef(null);

  const handleFolderClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      {folders.map((name, index) => (
        <Box
          key={index}
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

            {/* Additional folder details can be added here */}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange} // You need to define handleFileChange function
          />
        </Box>
      ))}
    </div>
  );
};

StudentFolder.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default StudentFolder;
