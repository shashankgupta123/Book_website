import React, { useEffect, useState } from "react";
import VoiceAssistant from "../component/VoiceAssistant";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import image from '../assets/books/header.jpg';
import sideimage from '../assets/books/sideimage2.jpg';
import '../CSS/home.css'

const Home = () => {
  const employees = [
    { name: "John Doe", position: "Store Manager", image: "data:image/jpeg;base64,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" },
    { name: "Jhanvi Smith", position: "Customer Support Specialist", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBQ9i2g3AOvmZP4ROYorcyDGbPlxBjWhWcRw&s" },
    { name: "Ankita Johnson", position: "Events Coordinator", image: "data:image/jpeg;base64,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" },
    { name: "Michael Brown", position: "Inventory Manager", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmI57giWxjA-WXBTE7HIzLV0Y9YcEnxIyrCQ&s" },
  ];

  const famousBooks  = [
    { title: "To Kill a Mockingbird", genre: "Classic", author: "Harper Lee", cover: "https://m.media-amazon.com/images/I/81gepf1eMqL._AC_UF1000,1000_QL80_.jpg" },
    { title: "1984", genre: "Dystopian", author: "George Orwell", cover: "https://miro.medium.com/v2/resize:fit:800/1*g8s4n-puPV3y-F2b7ilJ_A.jpeg" },
    { title: "The Hobbit", genre: "Fantasy", author: "J.R.R. Tolkien", cover: "https://m.media-amazon.com/images/I/71V2v2GtAtL._AC_UF1000,1000_QL80_.jpg" },
    { title: "The Da Vinci Code", genre: "Mystery", author: "Dan Brown", cover: "https://m.media-amazon.com/images/M/MV5BMjIxMjQyMTc3Nl5BMl5BanBnXkFtZTcwMTA1MDUzMw@@._V1_.jpg" },
    { title: "A Brief History of Time", genre: "Science", author: "Stephen Hawking", cover: "https://m.media-amazon.com/images/I/91ebghaV-eL._AC_UF350,350_QL50_.jpg" },
    { title: "The Subtle Art of Not Giving a F*ck", genre: "Self-Help", author: "Mark Manson", cover: "https://m.media-amazon.com/images/I/71QKQ9mwV7L.jpg" },
    { title: "Pride and Prejudice", genre: "Romance", author: "Jane Austen", cover: "https://m.media-amazon.com/images/I/712P0p5cXIL._AC_UF1000,1000_QL80_.jpg" },
    { title: "The Alchemist", genre: "Philosophical Fiction", author: "Paulo Coelho", cover: "https://m.media-amazon.com/images/I/81ioPZFMeUL._UF1000,1000_QL80_.jpg" }
  ];

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
        <img src={image} style={{ width: "100%", objectFit: "cover" , backgroundSize: "cover",backgroundPosition: "center", height: "500px",marginBottom: "20px"}} />

        
        {/* Banner Image */}
        <div
          // style={{
          //   backgroundImage: `url('https://static3.bigstockphoto.com/5/7/3/large1500/375393538.jpg')`,
          //   backgroundSize: "cover",
          //   backgroundPosition: "center",
          //   height: "300px",
          //   marginBottom: "20px",
          // }}
        >
          {/* Banner Text */}
          {/* <h1 style={{ color: "white", padding: "100px 0", fontSize: "3rem" }}>
            Welcome to Books Haven
          </h1> */}
        </div>

        {/* Achievements Section */}
        <div style={{ display: "flex", alignItems: "center", marginTop: "20px", padding: "20px" }}>
          <img
            src={sideimage}
            alt="Achievement"
            style={{
              width: "500px",
              height: "auto",
              borderRadius: "10px",
              marginRight: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
          <div style={{ textAlign: "center", flex: 1 }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "#333" }}>About Us</h1>
            <p style={{ fontSize: "1.2rem", lineHeight: "1.6", textAlign: "left", fontFamily: "'Lobster', cursive" }}>
            At Books Haven, we take immense pride in our journey of making literature accessible to readers around the world. Since our inception, we cover a vast range of genres, from timeless classics to modern bestsellers.

            Our platform has grown into a thriving community of book lovers. With an ever-expanding digital and physical library, we ensure that readers of all ages can find books that ignite their curiosity, broaden their perspectives, and fuel their passion for reading.

            In addition to offering a diverse collection, we have collaborated with renowned authors, publishers, and literary organizations to bring exclusive content, book recommendations, and engaging discussions to our readers.

            We are helping to shape a world where books are accessible to everyone.

            At Books Haven, we believe that every book opens a door to new possibilities, and we remain dedicated to expanding our collection, enhancing our user experience, and fostering a love for reading across generations.

            Join us on this incredible journey and become a part of our ever-growing book-loving family! 📚✨
            </p>
          </div>
        </div>
        <div className="employees-section">
        <h2 className="section-title">Meet Our Team</h2>
        <div className="employees-list">
          {employees.map((employee, index) => (
            <div key={index} className="employee">
              <img
                src={employee.image}
                alt={employee.name}
                className="employee-image"
              />
              <p className="employee-name">{employee.name}</p>
              <p className="employee-position">{employee.position}</p>
            </div>
          ))}
        </div>
      </div>

        {/* Upcoming Events or Book Clubs */}
        {/* <div style={{ margin: "40px 0", padding: "20px", textAlign: "left" }}>
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
        </div> */}

        {/* Offers and Discounts */}
        {/* <div style={{ margin: "40px 0", padding: "20px", background: "#f9f9f9", borderRadius: "10px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "20px", color: "#333" }}>💸 Offers and Discounts</h2>
          <p style={{ fontSize: "1.2rem", lineHeight: "1.8" }}>
            - Get <b>20% off</b> on all purchases above $50. Use code <b>BOOK20</b>. <br />
            - Buy 3 books and get <b>1 free</b> on selected genres. <br />
            - Exclusive discount for premium members: <b>30% off</b> on new arrivals.
          </p>
        </div> */}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <h2 className="section-title">Famous Books by Genre</h2>
      <div className="books-grid">
        {famousBooks.map((book, index) => (
          <div className="book-card" key={index}>
            <img src={book.cover} alt={book.title} className="book-cover" />
            <h3 className="book-title">{book.title}</h3>
            <p className="book-genre">{book.genre}</p>
          </div>
        ))}
      </div>
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant />

      {/* Logout Button */}
      <button
  onClick={handleLogout}
  style={{
    margin: "20px auto",
    display: "block",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "12px 20px",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.3s ease, transform 0.2s ease",
    width: "150px",
    textAlign: "center",
  }}
  onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
  onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
  onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
  onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
>
  Logout
</button>

    </>
  );
};

export default Home;
