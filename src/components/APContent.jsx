import React, { useState } from "react";
import "../styles/content.css";
import ContentHeader from "./ContentHeader";
import AddPayment from "./AddPayment";
import PaymentSearchbar from "./PaymentSearchbar";

const APContent = () => {
  const [studentData, setStudentData] = useState(null);

  return (
    <div className="content">
      <ContentHeader header="Payment" />

      <div className="payment-container">
        <div className="payment-searchbar">
          <PaymentSearchbar onStudentDataFetched={setStudentData} />
        </div>

        <AddPayment studentData={studentData} />
      </div>
    </div>
  );
};

export default APContent;
