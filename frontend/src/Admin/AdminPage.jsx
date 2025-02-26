import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Admin.css'; 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import HistogramChart from './Graph/HistogramChart';
import PieChart from './Graph/PieChart';
import SalesByGenreChart from './Graph/SalesByGener';
import AverageRatingChart from './Graph/AverageRating';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch("http://localhost:5000/api/users/adminlogout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }), 
      });

      if (response.ok) {
        localStorage.clear();
        navigate('/login');
      } else {
        const data = await response.json();
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <>
    <div className="admin-page">
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li><Link to="/admin/books">Books</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
          <li><Link to="/admin/contact">Contact</Link></li>
          <li><Link to="/admin/purchase">Payment List</Link></li>
          <li><Link to="/admin/reviews">Reviews</Link></li>
        </ul>
      </div>

      <div className="content">
        <h1>Welcome to the Admin Dashboard</h1>
        <HistogramChart />
        <PieChart />
        <SalesByGenreChart />
        <AverageRatingChart />
      </div>
    </div>
    <button onClick={handleLogout}>Logout</button>

    </>
  );
};

export default AdminPage;
