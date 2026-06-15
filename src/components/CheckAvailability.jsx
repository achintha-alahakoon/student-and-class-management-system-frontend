import React from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

class CheckAvailability extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [],
      options: {
        chart: {
          height: 350,
          type: 'rangeBar'
        },
        plotOptions: {
          bar: {
            horizontal: true,
            distributed: true,
            dataLabels: {
              hideOverflowingLabels: false
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function(val, opts) {
            var a = new Date(val[0]);
            var b = new Date(val[1]);
            var diff = Math.floor((b - a) / (1000 * 60 * 60));
            return diff + (diff > 1 ? ' hours' : ' hour');
          },
          style: {
            colors: ['#f3f4f5', '#fff']
          }
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          categories: ['Hall 1', 'Hall 2', 'Hall 3', 'Hall 4'],
          title: {
            text: 'Hall Number'
          }
        },
        grid: {
          row: {
            colors: ['#f3f4f5', '#fff'],
            opacity: 1
          }
        }
      }
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    axios.get('http://localhost:8081/api/classSchedule/scheduledClasses')
      .then(response => {
        const data = response.data;
        const transformedData = this.transformData(data);
        this.setState({ series: transformedData });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  transformData = (data) => {
    const seriesData = data.map(item => ({
      x: `${item.Subject} - Grade ${item.Grade}`,
      y: [
        new Date(`1970-01-01T${item.Start_Time}`).getTime(),
        new Date(`1970-01-01T${item.End_Time}`).getTime()
      ],
      fillColor: this.getFillColor(item.Hall_Num)
    }));

    return [{
      data: seriesData
    }];
  };

  getFillColor = (hallNumber) => {
    switch (hallNumber) {
      case 1: return '#008FFB';
      case 2: return '#00E396';
      case 3: return '#775DD0';
      case 4: return '#FF4560';
      default: return '#008FFB';
    }
  };

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart options={this.state.options} series={this.state.series} type="rangeBar" height={350} />
        </div>
      </div>
    );
  }
}

export default CheckAvailability;


