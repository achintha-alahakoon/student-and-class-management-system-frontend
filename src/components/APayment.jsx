import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/AddPayment.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import Modal from "@mui/material/Modal";

const APayment = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    subject: "",
    tutor: "",
    grade: "",
    month: "",
    paymentType: "",
    amount: "",
  });

  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCardInputChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleInputFocus = (e) => {
    setCardData({ ...cardData, focus: e.target.name });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty
    for (const key in formData) {
      if (formData[key] === "") {
        Swal.fire({
          title: "Error!",
          text: "Please fill out all fields.",
          icon: "error",
        });
        return;
      }
    }
    setOpenModal(true);
    try {
      const response = await axios.post(
        "http://localhost:8081/api/payment/addPayment",
        formData
      );
      console.log(response.data);
      Swal.fire({
        title: "Good job!",
        text: "Successfully scheduled a class!",
        icon: "success",
      });
      setFormData({
        studentId: "",
        studentName: "",
        subject: "",
        tutor: "",
        grade: "",
        month: "",
        paymentType: "",
        amount: "",
      });
    } catch (error) {
      console.log(error);
      // handle error, maybe show an error message to the user
    }
  };

  return (
    <div className="add-payment">
      <h2>Add Payment</h2>
      <div className="form-content">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-container">
            <div className="form-column">
              <div>
                <label>Student ID:</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
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
                  <option value="English">English</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
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
                  <option value="Amila Jayarathne">Amila Jayarathne</option>
                  <option value="Kamalsiri Jayasinghe">
                    Kamalsiri Jayasinghe
                  </option>
                  <option value="Dilan M Bandara">Dilan M Bandara</option>
                </select>
              </div>
              <div>
                <label>Amount (Rs):</label>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-column">
              <div>
                <label>Student Name:</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
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
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                </select>
              </div>
              <div>
                <label>Month:</label>
                <select
                  type="text"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                >
                  <option value="">Select Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
              <div>
                <label>Payment Type:</label>
                <br />
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    defaultValue="Card"
                    name="paymentType"
                    value={formData.paymentType}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="Card"
                      control={<Radio />}
                      label="Card"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div>
          <br />

          <div className="addpayment-btn">
            <button type="submit">
              Add Payment
            </button>
            &nbsp;&nbsp;&nbsp;
            <button type="reset">Reset</button>
          </div>
        </form>
      </div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal-container">
          <Cards
            number={cardData.number}
            expiry={cardData.expiry}
            cvc={cardData.cvc}
            name={cardData.name}
            focused={cardData.focus}
          />
          <form>
            <input
              type="tel"
              name="number"
              placeholder="Card Number"
              value={cardData.number}
              onChange={handleCardInputChange}
              onFocus={handleInputFocus}
            />
            <input
              type="tel"
              name="expiry"
              placeholder="MM/YY Expiry"
              value={cardData.expiry}
              onChange={handleCardInputChange}
              onFocus={handleInputFocus}
            />
            <input
              type="tel"
              name="cvc"
              placeholder="CVC"
              value={cardData.cvc}
              onChange={handleCardInputChange}
              onFocus={handleInputFocus}
            />
            <input
              type="text"
              name="name"
              placeholder="Name on Card"
              value={cardData.name}
              onChange={handleCardInputChange}
              onFocus={handleInputFocus}
            />
          </form>
          <button>PAY</button>
        </div>
      </Modal>
    </div>
  );
};

export default APayment;
