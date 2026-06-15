import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import dayjs from 'dayjs';

const OveroleChart = ({ title }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [dates, setDates] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8081/api/attendance/getParentChildrenAttendance', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = response.data;
        setAttendanceData(data.map(item => item.AttendancePercentage));
        setStudents(data.map(item => item.StudentID));

        const today = dayjs();
        const dateRange = [];

        for (let i = 0; i < data.length; i++) {
          dateRange.push(today.add(i, 'day').format('YYYY-MM-DD'));
        }

        setDates(dateRange);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, []);

  const series = [{
    name: title.includes("Attendance") ? "Attendance" : "Payment",
    data: attendanceData
  }];

  const options = {
    chart: {
      type: 'area',
      height: 350,
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      text: title,
      align: 'left',
      style: {
        color: '#526d82'
      }
    },
    labels: dates,
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'yyyy-MM-dd'
      }
    },
    yaxis: {
      opposite: true
    },
    tooltip: {
      y: {
        formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
          return `StudentID: ${students[dataPointIndex]}, Attendance: ${val}%`;
        }
      }
    },
    legend: {
      horizontalAlign: 'left'
    }
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="area" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default OveroleChart;
