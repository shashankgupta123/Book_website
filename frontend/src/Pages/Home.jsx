import React, { useEffect, useState } from "react";
import VoiceAssistant from "../component/VoiceAssistant";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Home = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUserName = localStorage.getItem("username");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
    }
  }, [location.state]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.clear();
        navigate("/login");
      } else {
        const data = await response.json();
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <ToastContainer />
        
        {/* Banner Image */}
        <div
          style={{
            backgroundImage: `url('https://static3.bigstockphoto.com/5/7/3/large1500/375393538.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "300px",
            marginBottom: "20px",
          }}
        >
          {/* Banner Text */}
          <h1 style={{ color: "white", padding: "100px 0", fontSize: "3rem" }}>
            Welcome to Books Haven
          </h1>
        </div>

        {/* Achievements Section */}
        <div style={{ display: "flex", alignItems: "center", marginTop: "40px", padding: "20px" }}>
          <img
            src="https://img.freepik.com/premium-photo/photo-books-with-graduation-cap-representing-academic-achievement_763111-337683.jpg"
            alt="Achievement"
            style={{
              width: "300px",
              height: "auto",
              borderRadius: "10px",
              marginRight: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
          <div style={{ textAlign: "center", flex: 1 }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "#333" }}>Achievement Section</h1>
            <p style={{ fontSize: "1.2rem", lineHeight: "1.6", textAlign: "left" }}>
              At <b>Books Haven</b>, we are proud to have achieved the milestone of providing access to over
              <b> one million books</b> to avid readers worldwide. Our commitment to fostering a community of
              knowledge and imagination continues to inspire us every day.
            </p>
          </div>
        </div>

        {/* Upcoming Events or Book Clubs */}
        <div style={{ margin: "40px 0", padding: "20px", textAlign: "left" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "20px", color: "#333" }}>📚 Upcoming Events</h2>
          <ul style={{ fontSize: "1.2rem", lineHeight: "1.8" }}>
            <li>
              <b>Virtual Author Meet:</b> Join us on February 10th for an exclusive talk with bestselling author John Doe.
            </li>
            <li>
              <b>Book Reading Event:</b> Participate in a live reading of "The Great Gatsby" on March 5th.
            </li>
            <li>
              <b>Online Book Club:</b> Discuss "Atomic Habits" with fellow readers on February 20th.
            </li>
          </ul>
        </div>

        {/* Offers and Discounts */}
        <div style={{ margin: "40px 0", padding: "20px", background: "#f9f9f9", borderRadius: "10px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "20px", color: "#333" }}>💸 Offers and Discounts</h2>
          <p style={{ fontSize: "1.2rem", lineHeight: "1.8" }}>
            - Get <b>20% off</b> on all purchases above $50. Use code <b>BOOK20</b>. <br />
            - Buy 3 books and get <b>1 free</b> on selected genres. <br />
            - Exclusive discount for premium members: <b>30% off</b> on new arrivals.
          </p>
        </div>
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant />

      {/* Logout Button */}
      <button onClick={handleLogout} style={{ margin: "20px" }}>
        Logout
      </button>
    </>
  );
};

export default Home;
