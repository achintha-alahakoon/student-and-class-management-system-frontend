import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const StatusCell = ({ value }) => {
  const statusColor = value === "Paid" ? "green" : "red";

  return (
    <div style={{ color: statusColor }}>
      {value}
    </div>
  );
};

const AddPayment = ({ studentData }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const currentMonth = moment().format("MMMM");

    const updatedRows = studentData && studentData.classes
      ? studentData.classes.map((cls, index) => ({
          name: `${studentData.student.FirstName} ${studentData.student.LastName}`,
          id: cls.ClassID,
          subject: cls.Subject,
          tutor: cls.Tutor,
          grade: cls.Grade,
          fees: cls.Fees,
          month: currentMonth,
          status: cls.status || "Not Paid", // Ensure status is handled correctly
          studentId: studentData.student.StudentID, // Add studentId
          index: index,
        }))
      : [];

    setRows(updatedRows);
  }, [studentData]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const columns = [
    { field: "name", headerName: "Name", width: 250 },
    { field: "id", headerName: "Class ID", width: 80 },
    { field: "subject", headerName: "Subject", width: 140 },
    { field: "tutor", headerName: "Tutor", width: 200 },
    { field: "grade", headerName: "Grade", width: 80, type: "number" },
    { field: "fees", headerName: "Fees", width: 100, type: "number" },
    { field: "month", headerName: "Month", width: 120 },
    { field: "status", headerName: "Status", width: 100, renderCell: StatusCell }, // Use StatusCell for rendering
  ];

  const handleRowSelection = (selectedIds) => {
    const selectedItems = selectedIds.map((id) => rows.find((row) => row.id === id));
    setSelectedRows(selectedItems);
    const total = selectedItems.reduce((acc, curr) => acc + Number(curr.fees), 0);
    setTotalAmount(total);
  };

  const handlePayNow = () => {
    const paymentData = {
      studentId: studentData.student.StudentID,
      paymentDetails: selectedRows,
    };
  
    axios
      .post("http://localhost:8081/api/payment/admin/processpayment", paymentData)
      .then((response) => {
        
        // Update the status of selected rows to "Paid"
        const updatedRows = rows.map((row) => {
          if (selectedRows.find((selectedRow) => selectedRow.id === row.id)) {
            return { ...row, status: "Paid" };
          }
          return row;
        });
        // Update the rows state with the updated status
        setRows(updatedRows);
        setSelectedRows([]);
        setTotalAmount(0);
        Swal.fire("Payment Successful", "Your payment has been processed", "success");
  
        const doc = new jsPDF();
  
        doc.setFontSize(18);
        doc.text("Aurora Academy", 14, 22);
  
        doc.setFontSize(12);
        doc.text("Watappitiya, Parakaduwa", 14, 30);
        doc.text("Mobile: +94 71 528 4616", 14, 36);
        doc.text("Email: auroraacademy@gmail.com", 14, 42);
  
        const paymentTime = moment().format("DD-MMM-YYYY, h:mm A");
        doc.text(`Student ID: ${studentData.student.StudentID}`, 14, 50);
        doc.text(`Student Name: ${studentData.student.FirstName} ${studentData.student.LastName}`, 14, 56);
        doc.text(`Grade: ${studentData.student.Grade}`, 14, 62);
        doc.text(`Payment Time: ${paymentTime}`, 14, 68);
  
        doc.autoTable({
          startY: 74,
          head: [['Subject', 'Tutor', 'Month', 'Fees']],
          body: selectedRows.map(row => [row.subject, row.tutor, row.month, `Rs ${row.fees}.00`]),
        });
  
        doc.text(`Total Amount: Rs ${totalAmount}.00`, 14, doc.autoTable.previous.finalY + 10);
  
        doc.save("payment_receipt.pdf");
      })
      .catch((error) => {
        Swal.fire("Payment Failed", "There was an issue processing your payment", "error");
      });
  };

  return (
    <div>
      <Box sx={{ height: 350, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          onRowClick={(params) => {
            const id = params.row.id;
            const row = rows.find((row) => row.id === id);
            if (row) {
              const selectedIds = selectedRows.map((row) => row.id);
              if (selectedIds.includes(id)) {
                setSelectedRows(selectedRows.filter((row) => row.id !== id));
              } else {
                handleRowSelection([...selectedIds, id]);
              }
            }
          }}
          selectionModel={selectedRows.map((row) => row.id)}
        />
      </Box>
      <div className="add-to-cart-btn">
        <IconButton color="primary" aria-label="add to cart" onClick={handleOpen}>
          <StyledBadge badgeContent={selectedRows.length} color="secondary">
            <AddShoppingCartIcon />
          </StyledBadge>
        </IconButton>
      </div>

      <div className="total-payment">
        <div>
          <h4>Total Amount: Rs {totalAmount}.00</h4>
        </div>

        <div>
          <button variant="contained" color="primary" className="total-payment-btn" onClick={handlePayNow}>
            Pay Now
          </button>
        </div>
      </div>

      <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
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
          <IconButton aria-label="close" onClick={handleClose} sx={{ position: "absolute", top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>
          <Typography
            id="simple-modal-title"
            variant="h6"
            component="h2"
            sx={{
              textAlign: "center",
              color: "#526d82",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Payment Summary
          </Typography>
          {studentData && studentData.student && (
            <>
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
                    <p>Status: {row.status}</p> {/* Display status */}
                    <IconButton
                      aria-label="close"
                      onClick={() => {
                        const updatedRows = selectedRows.filter((r) => r.id !== row.id);
                        setSelectedRows(updatedRows);
                        const total = updatedRows.reduce((acc, curr) => acc + Number(curr.fees), 0);
                        setTotalAmount(total);
                      }}
                      sx={{ color: "red" }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                ))}
              </div>
              <Typography id="simple-modal-description" sx={{ mt: 2, mb: 2, color: "#526d82", fontWeight: "bold", fontSize: "20px" }}>
                Total Amount: Rs {totalAmount}.00
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default AddPayment;
