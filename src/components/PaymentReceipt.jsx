import React from "react";
import jsPDF from "jspdf";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const PaymentReceipt = ({ studentData, selectedRows, totalAmount, handleClose }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Payment Receipt", 20, 20);
    doc.text(`Student ID: ${studentData.student.StudentID}`, 20, 30);
    doc.text(`Grade: ${studentData.student.Grade}`, 20, 40);

    selectedRows.forEach((row, index) => {
      const y = 50 + index * 10;
      doc.text(`Class ID: ${row.id}`, 20, y);
      doc.text(`Subject: ${row.subject}`, 50, y);
      doc.text(`Tutor: ${row.tutor}`, 100, y);
      doc.text(`Fees: ${row.fees}`, 150, y);
      doc.text(`Month: ${row.month}`, 180, y);
    });

    doc.text(`Total Amount: Rs ${totalAmount}.00`, 20, 50 + selectedRows.length * 10 + 10);
    doc.save("payment_receipt.pdf");
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 1000,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: "10px",
      }}
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <Typography
        variant="h6"
        component="h2"
        sx={{
          textAlign: "center",
          color: "#526d82",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Payment Receipt
      </Typography>
      <div className="payment-confirmation">
        <p>Student ID: {studentData.student.StudentID}</p>
        <p>Grade: {studentData.student.Grade}</p>
      </div>
      <div className="payment-row-container">
        {selectedRows.map((row, index) => (
          <div key={index} className="payment-row">
            <p>Class ID: {row.id}</p>
            <p>Subject: {row.subject}</p>
            <p>Tutor: {row.tutor}</p>
            <p>Fees: {row.fees}</p>
            <p>Month: {row.month}</p>
          </div>
        ))}
      </div>
      <Typography
        sx={{ mt: 2, mb: 2, color: "#526d82", fontWeight: "bold", fontSize: "20px" }}
      >
        Total Amount: Rs {totalAmount}.00
      </Typography>
      <button onClick={generatePDF}>Download Receipt</button>
    </Box>
  );
};

export default PaymentReceipt;
