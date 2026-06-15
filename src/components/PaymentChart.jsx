// import React from "react";
// import { PieChart } from "@mui/x-charts/PieChart";

// const data = [
//   { id: 0, value: 1, label: "Not Paid" },
//   { id: 1, value: 1, label: "Paid" },
// ];

// const PaymentChart = () => {
//   return (
//     <PieChart
//       series={[
//         {
//           data,
//           highlightScope: { faded: "global", highlighted: "item" },
//           faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
//           innerRadius: 55,
//           outerRadius: 70,
//           paddingAngle: 5,
//           cornerRadius: 10,
//           startAngle: -180,
//           endAngle: 180,
//           cx: 100,
//           cy: 85,
//         },
//       ]}
//       height={170}
//     />
//   );
// };

// export default PaymentChart;




import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const PaymentChart = () => {
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
        const response = await fetch(
          "http://localhost:8081/api/payment/getTutorPaymentChart",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        setPaymentData([
          { id: 0, value: data.notPaid, label: "Not Paid" },
          { id: 1, value: data.paid, label: "Paid" }
        ]);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchPaymentData();
  }, []);

  return (
    <PieChart
      series={[
        {
          data: paymentData,
          highlightScope: { faded: "global", highlighted: "item" },
          faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          innerRadius: 55,
          outerRadius: 70,
          paddingAngle: 5,
          cornerRadius: 10,
          startAngle: -180,
          endAngle: 180,
          cx: 100,
          cy: 85
        }
      ]}
      height={170}
    />
  );
};

export default PaymentChart;
