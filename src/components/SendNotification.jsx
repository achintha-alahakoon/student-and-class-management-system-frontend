import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import { BiChevronLeft } from "react-icons/bi";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import Collapse from "@mui/material/Collapse";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";

const  SendNotification = ({
  newMessage,
  setNewMessage,
  setShowComposeMessage,
}) => {
  const [recipientType, setRecipientType] = useState("");
  const [tutorSelection, setTutorSelection] = useState("");
  const [studentSelection, setStudentSelection] = useState("");
  const [parentSelection, setParentSelection] = useState("");
  const [tutorOptionsOpen, setTutorOptionsOpen] = useState(false);
  const [studentOptionsOpen, setStudentOptionsOpen] = useState(false);
  const [parentOptionsOpen, setParentOptionsOpen] = useState(false);
  const [allOptions, setAllOptions] = useState({
    tutors: [],
    grades: [],
    subjects: [],
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/count/getAll"
        );
        setAllOptions(response.data);
      } catch (error) {
        console.error("Error fetching all details:", error);
      }
    };

    fetchAll();
  }, []);

  const handleRecipientChange = (event) => {
    setRecipientType(event.target.value);
  };

  const handleSendNotification = async () => {
    let grade, subject, tutor = "";
    if (recipientType === "Tutor") {
      tutor = tutorSelection;
    } else if (recipientType === "Student") {
      grade = studentSelection.grade 
      subject = studentSelection.subject
      tutor = studentSelection.tutor
    } else if (recipientType === "Parent") {
      grade = parentSelection.grade
      subject = parentSelection.subject
      tutor = parentSelection.tutor
    }

    try {
      await axios.post("http://localhost:8081/api/notification/send", {
        recipientType,
        grade,
        subject,
        tutor,
        message: newMessage,
      });
      
      alert("Message sent successfully");
      setNewMessage("");
      setShowComposeMessage(false);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message");
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        borderTop: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <IconButton
          onClick={() => setShowComposeMessage(false)}
          sx={{ mr: 2, color: "#27374D" }}
        >
          <BiChevronLeft />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", fontSize: "24px", color: "#27374D" }}
        >
          Compose Message
        </Typography>
      </Box>
      <Box>
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <RadioGroup
            aria-label="recipient"
            name="recipient"
            value={recipientType}
            onChange={handleRecipientChange}
          >
            <FormControlLabel
              value="Tutor"
              control={<Radio />}
              label="Tutor"
              onClick={() => {
                setTutorOptionsOpen(!tutorOptionsOpen);
                setStudentOptionsOpen(false);
                setParentOptionsOpen(false);
              }}
            />
            <Collapse in={tutorOptionsOpen}>
              <Box sx={{ pl: 2 }}>
                <FormControlLabel
                  value="allTutors"
                  control={<Radio />}
                  label="Select All Tutors"
                  onClick={() => setTutorSelection("allTutors")}
                />
                <TextField
                  select
                  label="Select Tutor"
                  variant="outlined"
                  fullWidth
                  value={tutorSelection}
                  onChange={(e) => setTutorSelection(e.target.value)}
                >
                  {allOptions.tutors.map((tutor, index) => (
                    <MenuItem key={index} value={tutor}>
                      {tutor}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Collapse>
            <FormControlLabel
              value="Student"
              control={<Radio />}
              label="Student"
              onClick={() => {
                setStudentOptionsOpen(!studentOptionsOpen);
                setTutorOptionsOpen(false);
                setParentOptionsOpen(false);
              }}
            />
            <Collapse in={studentOptionsOpen}>
              <Box sx={{ pl: 2 }}>
                <FormControlLabel
                  value="allStudents"
                  control={<Radio />}
                  label="Select All Students"
                  onClick={() => setStudentSelection("allStudents")}
                />
                <TextField
                  sx={{ mb: 2 }}
                  select
                  label="Select Grade"
                  variant="outlined"
                  fullWidth
                  value={studentSelection.grade}
                  onChange={(e) =>
                    setStudentSelection({
                      ...studentSelection,
                      grade: e.target.value,
                    })
                  }
                >
                  {allOptions.grades.map((grade, index) => (
                    <MenuItem key={index} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  sx={{ mb: 2 }}
                  select
                  label="Select Subject"
                  variant="outlined"
                  fullWidth
                  value={studentSelection.subject}
                  onChange={(e) =>
                    setStudentSelection({
                      ...studentSelection,
                      subject: e.target.value,
                    })
                  }
                >
                  {allOptions.subjects.map((subject, index) => (
                    <MenuItem key={index} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  sx={{ mb: 2 }}
                  select
                  label="Select Tutor"
                  variant="outlined"
                  fullWidth
                  value={studentSelection.tutor}
                  onChange={(e) =>
                    setStudentSelection({
                      ...studentSelection,
                      tutor: e.target.value,
                    })
                  }
                >
                  {allOptions.tutors.map((tutor, index) => (
                    <MenuItem key={index} value={tutor}>
                      {tutor}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Collapse>
            <FormControlLabel
              value="Parent"
              control={<Radio />}
              label="Parent"
              onClick={() => {
                setParentOptionsOpen(!parentOptionsOpen);
                setTutorOptionsOpen(false);
                setStudentOptionsOpen(false);
              }}
            />
            <Collapse in={parentOptionsOpen}>
              <Box sx={{ pl: 2 }}>
                <FormControlLabel
                  value="allParents"
                  control={<Radio />}
                  label="Select All Parents"
                  onClick={() => setParentSelection("allParents")}
                />
                <TextField
                  sx={{ mb: 2 }}
                  select
                  label="Select Grade"
                  variant="outlined"
                  fullWidth
                  value={parentSelection.grade}
                  onChange={(e) =>
                    setParentSelection({
                      ...parentSelection,
                      grade: e.target.value,
                    })
                  }
                >
                  {allOptions.grades.map((grade, index) => (
                    <MenuItem key={index} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  sx={{ mb: 2 }}
                  select
                  label="Select Subject"
                  variant="outlined"
                  fullWidth
                  value={parentSelection.subject}
                  onChange={(e) =>
                    setParentSelection({
                      ...parentSelection,
                      subject: e.target.value,
                    })
                  }
                >
                  {allOptions.subjects.map((subject, index) => (
                    <MenuItem key={index} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  sx={{ mb: 2 }}
                  select
                  label="Select Tutor"
                  variant="outlined"
                  fullWidth
                  value={parentSelection.tutor}
                  onChange={(e) =>
                    setParentSelection({
                      ...parentSelection,
                      tutor: e.target.value,
                    })
                  }
                >
                  {allOptions.tutors.map((tutor, index) => (
                    <MenuItem key={index} value={tutor}>
                      {tutor}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Collapse>
          </RadioGroup>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TextField
          label="Type a message"
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <IconButton color="primary" onClick={handleSendNotification}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SendNotification;
