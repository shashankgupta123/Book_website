import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import './piechartstyle.css'; // Import external CSS file

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = () => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);

  const getRandomColor = () => {
    const randomColor = () => Math.floor(Math.random() * 256);
    return `rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/purchase/total-income');
        const data = response.data;

        const labels = [];
        const values = [];
        const colors = [];
        let total = 0;

        // Process the data to extract book titles and their respective total income
        data.forEach(item => {
          labels.push(item._id.bookTitle); // Using bookTitle for labels
          const totalPrice = item.totalPurchases.reduce((sum, purchase) => sum + purchase.price, 0);
          values.push(totalPrice); // Total price for the book
          colors.push(getRandomColor()); // Random color for each book
          total += totalPrice; // Accumulate total income
        });

        setChartData({
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: colors,
            hoverOffset: 4,
          }],
        });

        setTotalIncome(total);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const bookTitle = tooltipItem.label;
            const totalIncome = tooltipItem.raw;
            return `${bookTitle}: Rs.${totalIncome}`;
          },
        },
      },
    },
  };

  return (
    <div className="pie-chart-container">
      <h2 className="chart-title">Total Purchases by Book</h2>
      <div className="chart-wrapper">
        <Pie data={chartData} options={options} />
      </div>
      <div className="total-income">
        Total Income: Rs.{totalIncome}
      </div>
    </div>
  );
};

export default PieChart;
