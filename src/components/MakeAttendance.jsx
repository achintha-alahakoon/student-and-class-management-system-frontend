import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { BiEdit } from "react-icons/bi";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import ViewListIcon from "@mui/icons-material/ViewList";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import BarcodeScanner from './BarcodeScanner';

// Popup Component
const Popup = ({ anchorEl, handleClose, handleEdit, handleDelete }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 2,
          backgroundColor: "#f5f5f5",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          minWidth: 120,
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem onClick={handleEdit} sx={{ borderRadius: "8px 8px 0 0" }}>
        <ChangeCircleIcon />
        <Typography sx={{ ml: 1 }}>Change Status</Typography>
      </MenuItem>
      <MenuItem onClick={handleDelete} sx={{ borderRadius: "0 0 8px 8px" }}>
        <ViewListIcon />
        <Typography sx={{ ml: 1 }}>View Attendance History</Typography>
      </MenuItem>
    </Menu>
  );
};

// Row Component
function Row({ studentId, name, grade }) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const handleClick = (event, scheduledClass) => {
    setAnchorEl(event.currentTarget);
    setSelectedClass(scheduledClass);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeStatus = (classId) => {
    setOpenModal(true);
    setSelectedClass(classId);
    handleClose();
  };

  const handleConfirmStatusChange = async () => {
    try {
      const requestData = {
        studentId: studentId,
        classId: selectedClass,
        attendanceStatus: attendanceStatus[selectedClass],
      };

      const response = await fetch(
        "http://localhost:8081/api/attendance/updateAttendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );
      if (response.ok) {
        console.log("Attendance status updated successfully!");
      } else {
        console.error(
          "Failed to update attendance status:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error updating attendance status:", error);
    } finally {
      setOpenModal(false);
    }
  };

  useEffect(() => {
    if (open) {
      const fetchAttendance = async () => {
        try {
          const response = await fetch(
            `http://localhost:8081/api/attendance/getAttendanceByStudent/${studentId}`
          );
          const data = await response.json();

          // Update attendance status state
          const statusData = {};
          data.forEach((row) => {
            statusData[row.ClassID] = row.Status || "Absent";
          });

          setAttendanceData(data);
          setAttendanceStatus(statusData);
        } catch (error) {
          console.error("Error fetching attendance details:", error);
        }
      };
      fetchAttendance();
    }
  }, [open, studentId]);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {name}
        </TableCell>
        <TableCell align="right">{studentId}</TableCell>
        <TableCell align="right">{grade}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Attendance Details
              </Typography>
              <Table size="small" aria-label="attendance details">
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell>Tutor</TableCell>
                    <TableCell align="right">Attendance Date</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.map((attendanceRow, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {attendanceRow.Subject}
                      </TableCell>
                      <TableCell>{attendanceRow.Tutor}</TableCell>
                      <TableCell align="right">
                        {new Date().toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color:
                            attendanceStatus[attendanceRow.ClassID] ===
                            "Present"
                              ? "green"
                              : "red",
                        }}
                      >
                        {attendanceStatus[attendanceRow.ClassID] || "Absent"}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(event) =>
                            handleClick(event, attendanceRow.ClassID)
                          }
                        >
                          <BiEdit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Popup
        anchorEl={anchorEl}
        handleClose={handleClose}
        handleEdit={() => handleChangeStatus(selectedClass)}
        handleDelete={() => {}}
      />
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Change Attendance Status</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="attendance-status"
              name="attendance-status"
              value={attendanceStatus[selectedClass] || "Absent"}
              onChange={(event) =>
                setAttendanceStatus({
                  ...attendanceStatus,
                  [selectedClass]: event.target.value,
                })
              }
            >
              <FormControlLabel
                value="Absent"
                control={<Radio />}
                label="Absent"
              />
              <FormControlLabel
                value="Present"
                control={<Radio />}
                label="Present"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleConfirmStatusChange}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

Row.propTypes = {
  studentId: PropTypes.number.isRequired,
  grade: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

// Main Component
export default function MakeAttendance({ studentData }) {
  const [rows, setRows] = useState([]);
  const [scannedStudentId, setScannedStudentId] = useState(null);

  const handleScan = async (barcodeData) => {
    const studentId = parseInt(barcodeData, 10);
    setScannedStudentId(studentId);
  
    try {
      const filteredStudent = rows.find((student) => student.studentId === studentId);
      setRows([filteredStudent]);
  
      const studentDetailsResponse = await fetch(
        `http://localhost:8081/api/students/${studentId}`
      );
      const studentDetails = await studentDetailsResponse.json();
  
      await fetch("http://localhost:8081/api/attendance/updateAttendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          classId: studentDetails.classId,
          attendanceStatus: "Present",
        }),
      });
  
      alert("Attendance marked successfully!");
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to mark attendance. Please try again.");
    }
  };
  
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/api/attendance/getAttendance"
        );
        const data = await response.json();
        const formattedData = data.map((student) => ({
          studentId: student.StudentID,
          name: `${student.FirstName} ${student.LastName}`,
          grade: student.Grade,
        }));
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };
    fetchAttendance();
  }, []);

  const filteredRows = studentData
    ? rows.filter(row => row.studentId === studentData.student.StudentID)
    : rows;

  return (
    <div className="attendance-table">
      <BarcodeScanner onScan={handleScan} />
      <TableContainer
        style={{ marginTop: "2rem", overflowY: "auto", height: "61vh" }}
        component={Paper}
      >
        <Table aria-label="collapsible table">
          <TableHead
            sx={{
              backgroundColor: "#dde6ed",
              position: "sticky",
              top: 0,
              zIndex: 1,
              padding: "10px 0",
            }}
          >
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell align="right">Student ID</TableCell>
              <TableCell align="right">Grade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <Row key={row.studentId} {...row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

MakeAttendance.propTypes = {
  studentData: PropTypes.object,
};
