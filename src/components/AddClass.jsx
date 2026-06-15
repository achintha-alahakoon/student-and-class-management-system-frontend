import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "@mui/material/Modal";
import CheckAvailability from "./CheckAvailability";

const AddClass = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    grade: "",
    repeatOn: "",
    hallNumber: "",
    startTime: "",
    endTime: "",
    tutor: "",
    subject: "",
  });

  const [showModal, setShowModal] = useState(false); // State to manage the visibility of the modal

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8081/api/classSchedule", formData)
      .then((response) => {
        console.log(response.data);
        Swal.fire({
          title: "Good job!",
          text: "Successfully scheduled a class!",
          icon: "success",
        });
        setFormData({
          startDate: "",
          grade: "",
          repeatOn: "",
          hallNumber: "",
          startTime: "",
          endTime: "",
          tutor: "",
          subject: "",
        });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred while scheduling the class.",
          icon: "error",
        });
      });
  };

  const handleCheckAvailability = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="add-class">
      <div className="check-availability">
        <button
          className="check-availability-btn"
          onClick={handleCheckAvailability}
        >
          Check Availability
        </button>
      </div>
      <div className="form-content">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-container">
            <div className="form-column">
              <div>
                <label>Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Grade:</label>
                <select
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                >
                  <option value="">Select Grade</option>
                  <option value="06">Grade 6</option>
                  <option value="07">Grade 7</option>
                  <option value="08">Grade 8</option>
                  <option value="09">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                </select>
              </div>
              <div>
                <label>Repeat On:</label>
                <select
                  type="text"
                  name="repeatOn"
                  value={formData.repeatOn}
                  onChange={handleChange}
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
              <div>
                <label>Hall Number:</label>
                <select
                  type="text"
                  name="hallNumber"
                  value={formData.hallNumber}
                  onChange={handleChange}
                >
                  <option value="">Select Hall Number</option>
                  <option value="1">Hall 1</option>
                  <option value="2">Hall 2</option>
                  <option value="3">Hall 3</option>
                  <option value="4">Hall 4</option>
                </select>
              </div>
            </div>

            <div className="form-column2">
              <div>
                <label>Start Time:</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>End Time:</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Subject:</label>
                <select
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Sinhala">Sinhala</option>
                  <option value="ICT">ICT</option>
                  <option value="Tamil">Tamil</option>
                </select>
              </div>
              <div>
                <label>Tutor:</label>
                <select
                  type="text"
                  name="tutor"
                  value={formData.tutor}
                  onChange={handleChange}
                >
                  <option value="">Select Tutor</option>
                  <option value="Kamalsiri Jayasinghe">Kamalsiri Jayasinghe</option>
                  <option value="Amila Jayarathne">Amila Jayarathne</option>
                  <option value="Dilan M Bandara">Dilan M Bandara</option>
                  <option value="Sanchana Weerakkodi">Sanchana Weerakkodi</option>
                  <option value="Isuru Sanjeewa">Isuru Sanjeewa</option>
                  <option value="Deneth Pehesara">Deneth Pehesara</option>
                  <option value="Kalani Jayalath">Kalani Jayalath</option>
                </select>
              </div>
            </div>
          </div>
          <br />

          <div className="addclass-btn">
            <button type="submit">Add Class</button>&nbsp;&nbsp;&nbsp;
            <button type="reset">Reset</button>
          </div>
        </form>
      </div>
      <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal-content">
          <CheckAvailability />
          <button onClick={handleCloseModal}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default AddClass;

