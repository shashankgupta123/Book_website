import React, { useRef, useState, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";

import { Container, Row, Col } from "reactstrap";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

import PhoneImage from "../../assets/Header/phone.jpg";
import SearchImage from "../../assets/Header/search_image.jpg";
import { FaShoppingCart } from "react-icons/fa"; 
import iconimage from '../../assets/Header/icon1_copy.jpg';

const navLinks = [
  {
    path: "/",
    display: "Home",
  },
  // {
  //   path: "/about",
  //   display: "About",
  // },
  {
    path: "/user-books",
    display: "Book",
  },

  {
    path: "/map",
    display: "Maps",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];

const Header = forwardRef((prop, ref) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [searchTerm, setSearchTerm] =useState('');
  const [userEmail, setUserEmail]= useState(null);

  useEffect(()=>{
    const email=localStorage.getItem('email');
    console.log("User_email",email);
    setUserEmail(email);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("menu__active");

  const handleSearch = async (e, term = searchTerm) => {
    if (e) e.preventDefault();

    const query = decodeURIComponent(term.trim()); // Decode before sending
    if (!query) {
        alert("Search query cannot be empty.");
        return;
    }

    if (!userEmail) {
        alert("You must be logged in to submit a search term.");
        return;
    }

    console.log("Search Term:", query);
    console.log("User Email:", userEmail);

    try {
        const response = await fetch(`http://localhost:5000/api/users/store-search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, email: userEmail }),
        });

        const data = await response.json();
        console.log("Response from Flask:", data);

        if (response.ok) {
            navigate("/search-results", { state: { response: data } });
        } else {
            alert(data.message || "Search failed.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error sending search term to the server.");
    }
};

  useEffect(() => {
    const handleVoiceSearch = (event) => {
      const carQuery = event.detail.trim();
      console.log("Voice Triggered Search for:", carQuery);
    
      if (carQuery) {
        setSearchTerm(carQuery);
        setTimeout(() => handleSearch(null, carQuery), 500);
      } else {
        console.warn("Voice search result is empty.");
      }
    };
    

    window.addEventListener("searchBookEvent", handleVoiceSearch);
    return () => window.removeEventListener("searchBookEvent", handleVoiceSearch);
  }, [userEmail]);

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
    <header className="header">
      {/* ============ header top ============ */}
      <div className="header__top">
        <Container>
          {/* <Row>
            <Col lg="6" md="6" sm="6">
              <div className="header__top__left">
              <img src={iconimage} style={{ width: "30px", height: "30px", objectFit: "contain" }} />
                <span>Need Help?</span>
                <span className="header__top__help">
                  <img src={PhoneImage} alt="Phone icon" style={{ width: "20px", height: "20px", marginRight: "10px" }} />
                  +1-202-555-0149
                </span>
              </div>
            </Col>
          </Row> */}
        </Container>
      </div>

      {/* =============== header middle =========== */}


      {/* ========== main navigation =========== */}

      <div className="main__navbar">
        <Container>
          <div className="navigation__wrapper d-flex align-items-center justify-content-between">
            <span className="mobile__menu">
              <i class="ri-menu-line" onClick={toggleMenu}></i>
            </span>

            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <div className="menu">
              <img src={iconimage} style={{ width: "70px", height: "70px", objectFit: "contain" }} />
              <p style={{ fontSize: "22px" , paddingTop: "15px", fontFamily: "Arial", color:"#9279BA"}}>BOOKS HAVEN</p>
                {navLinks.map((item, index) => (
                  <NavLink
                    to={item.path}
                    className={(navClass) =>
                      navClass.isActive ? "nav__active nav__item" : "nav__item"
                    }
                    key={index}
                  >
                    {item.display}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="nav__right">
              <div className="">
                <form onSubmit={handleSearch}>
                  <div className="search-container">
                  <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                  <button type="submit" className="search-button">
                    <img src={SearchImage} alt="Search Icon" className="search-icon"/>
                  </button>
                  </div>
                </form> 
              </div>
              <Link 
                  to="/cart" 
                  className="cart-icon"
                  style={{
                    position: "absolute",
                    right: "85px", // Adjust the position as needed
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
  <FaShoppingCart size={24} />
</Link>

            </div>
          </div>
        </Container>
      </div>
    </header>
  );
});

export default Header;