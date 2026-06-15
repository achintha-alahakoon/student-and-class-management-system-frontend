import React from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const Submission = ({ assignment, onBack }) => (
  <div className="submission-container">
    <div className="submission-header">
      <IconButton aria-label="back" onClick={onBack} sx={{ color: "#526d82" }}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <h3>Submission for {assignment}</h3>
    </div>
    <div className="submission-content"></div>
  </div>
);

Submission.propTypes = {
  assignment: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default Submission;
