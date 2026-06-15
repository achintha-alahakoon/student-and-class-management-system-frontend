import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const chartSetting = {
  width: 1000,
  height: 300,
};

const Count = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/count/getCounts");
        const responseData = await response.json();

        const transformedData = [
          { month: 'Students', count: responseData.studentCount },
          { month: 'Tutors', count: responseData.tutorCount },
          { month: 'Subjects', count: responseData.subjectCount },
          { month: 'Parents', count: responseData.parentCount }
        ];

        setData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='student-count'>
      {data && (
        <BarChart
          dataset={data}
          yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
          series={[{ dataKey: 'count', label: 'Count' }]}
          layout="horizontal"
          grid={{ vertical: true }}
          {...chartSetting}
        />
      )}
    </div>
  )
}

export default Count;
