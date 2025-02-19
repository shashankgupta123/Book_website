import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./chartstyle.css"; // Import external CSS file

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AverageRatingChart = () => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/purchase/review-by-category");
        const data = response.data;

        const categories = data.map((item) => item._id);
        const ratings = data.map((item) => item.averageRating);
        const counts = data.map((item) => item.count);

        setChartData({
          labels: categories,
          datasets: [
            {
              label: "Average Rating",
              data: ratings,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "Review Count",
              data: counts,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Average Rating per Category",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Book Categories",
        },
      },
      y: {
        title: {
          display: true,
          text: "Average Rating",
        },
        beginAtZero: true,
        max: 5, // Ratings are usually between 1 to 5
      },
    },
  };

  return (
    <div className="chart-container">
      <h2>Average Rating per Category</h2>
      <div className="chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AverageRatingChart;
