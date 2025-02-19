import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './SalesChart.css'; // Import the external CSS file

// Registering the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const getRandomColor = () => {
  const randomColor = () => Math.floor(Math.random() * 256);
  return `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.6)`;
};

const SalesByGenreChart = () => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/purchase/sales-by-genre'); // Your backend endpoint
        const data = response.data;
        const genres = [];
        const incomes = [];

        data.forEach(item => {
          genres.push(item._id);
          incomes.push(item.totalIncome);
        });

        setChartData({
          labels: genres,
          datasets: [
            {
              label: 'Total Income by Genre',
              data: incomes,
              backgroundColor: genres.map(() => getRandomColor()),
              borderColor: genres.map(() => getRandomColor()),
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
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Total Income by Genre',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Genres',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Income',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <h2>Sales by Genre</h2>
      <div className="chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SalesByGenreChart;