import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './chartstyle.css'; // Import the external CSS file

// Registering the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const getRandomColor = () => {
  const randomColor = () => Math.floor(Math.random() * 256);
  return `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.6)`;
};

const HistogramChart = () => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to convert month number to month name
  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1];
  };

  // Fetching the data from the backend and processing it
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/purchase/weekly-income'); // Your backend endpoint
        const data = response.data;
        const weeks = [];
        const prices = [];

        // Process data to get week labels and the corresponding income
        data.forEach(item => {
          const monthName = getMonthName(item._id.month);
          const weekLabel = `${monthName} ${item._id.week} Week`;
          weeks.push(weekLabel);
          const totalPrice = item.purchases.reduce((sum, purchase) => sum + purchase.price, 0);
          prices.push(totalPrice);
        });

        // Set the chart data with weeks as labels and prices as data
        setChartData({
          labels: weeks,
          datasets: [
            {
              label: 'Total Income',
              data: prices,
              backgroundColor: getRandomColor(),
              borderColor: getRandomColor(),
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensure we can control the chart size
    plugins: {
      title: {
        display: true,
        text: 'Total Income by Week and Month',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Weeks',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Income',
        },
        beginAtZero: true, // Ensure the y-axis starts at zero
      },
    },
  };

  return (
    <div className="chart-container">
      <h2>Total Income Histogram</h2>
      <div className="chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default HistogramChart;
