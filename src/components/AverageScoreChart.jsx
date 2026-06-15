import React from 'react';
import ReactApexChart from 'react-apexcharts';

const AverageScoreChart = ({ label, average }) => {
  const series = [average];

  const options = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        }
      },
    },
    labels: [label],
  };

  return (
    <div className="average-score-chart">
      <ReactApexChart options={options} series={series} type="radialBar" height={220} />
    </div>
  );
}

export default AverageScoreChart;
