import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import EditClassModal from "./EditClassModal"; // Import the EditClassModal

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
        <EditIcon />
        <Typography sx={{ ml: 1 }}>Edit</Typography>
      </MenuItem>
      <MenuItem onClick={handleDelete} sx={{ borderRadius: "0 0 8px 8px" }}>
        <DeleteIcon />
        <Typography sx={{ ml: 1 }}>Delete</Typography>
      </MenuItem>
    </Menu>
  );
};

const DisplayClass = () => {
  const [scheduledClasses, setScheduledClasses] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleClick = (event, scheduledClass) => {
    setAnchorEl(event.currentTarget);
    setSelectedClass(scheduledClass);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
    handleClose();
  };

  const handleDelete = () => {
    handleClose();
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8081/api/classSchedule/${selectedClass.ScheduleID}`)
          .then(() => {
            setScheduledClasses(prevClasses => 
              prevClasses.filter(classItem => classItem.ScheduleID !== selectedClass.ScheduleID)
            );
            Swal.fire(
              'Deleted!',
              'Your class has been deleted.',
              'success'
            );
          })
          .catch((error) => {
            console.error("Error deleting class schedule:", error);
            Swal.fire(
              'Error!',
              'There was an error deleting the class.',
              'error'
            );
          });
      }
    });
  };

  const handleSave = (updatedClass) => {
    axios.put(`http://localhost:8081/api/classSchedule/${updatedClass.ScheduleID}`, updatedClass)
      .then(() => {
        setScheduledClasses(prevClasses =>
          prevClasses.map(classItem => 
            classItem.ScheduleID === updatedClass.ScheduleID ? updatedClass : classItem
          )
        );
        setIsEditModalOpen(false);
        Swal.fire(
          'Updated!',
          'Your class has been updated.',
          'success'
        );
      })
      .catch((error) => {
        console.error("Error updating class schedule:", error);
        Swal.fire(
          'Error!',
          'There was an error updating the class.',
          'error'
        );
      });
  };

  useEffect(() => {
    const getScheduledClasses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/classSchedule/scheduledClasses"
        );
        setScheduledClasses(response.data);
      } catch (error) {
        console.error("Error fetching scheduled classes", error);
      }
    };

    getScheduledClasses();
  }, []);

  return (
    <div className="display-class">
      <div className="scheduled-classes">
        {scheduledClasses.map((scheduledClass) => (
          <div className="course" key={scheduledClass.ScheduleID}>
            <div className="course-details">
              <div className="course-name">
                <div className="row1">
                  <span className="title">{scheduledClass.Subject}</span>
                  <span className="tutor">{scheduledClass.Tutor}</span>
                </div>
                <div className="row2">
                  <span className="grade">Grade {scheduledClass.Grade}</span>
                  <span className="day">{scheduledClass.Repeat_On}</span>
                </div>
                <div className="row3">
                  <span className="hall">Hall {scheduledClass.Hall_Num}</span>
                  <div className="time-container">
                    <span className="time">
                      {scheduledClass.Start_Time} - {scheduledClass.End_Time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="action">
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={(event) => handleClick(event, scheduledClass)}
              >
                :
              </IconButton>
            </div>
          </div>
        ))}
      </div>
      <Popup
        anchorEl={anchorEl}
        handleClose={handleClose}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {selectedClass && (
        <EditClassModal
          open={isEditModalOpen}
          handleClose={() => setIsEditModalOpen(false)}
          classData={selectedClass}
          handleSave={handleSave}
        />
      )}
    </div>
  );
};

export default DisplayClass;
