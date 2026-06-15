import React from "react";

const TotalPayment = ({ cartItems }) => {
  const totalAmount = cartItems.reduce((acc, item) => acc + item.paying, 0);
  return (
    <div className="total-payment">
      <div>
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.fullName} - {item.paying}
            </li>
          ))}
        </ul>
        <h4>Total Amount: Rs {totalAmount}.00</h4>
      </div>
      <div>
        <button className="total-payment-btn">Pay Now</button>
      </div>
    </div>
  );
};

export default TotalPayment;
