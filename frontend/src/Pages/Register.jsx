// src/components/Register.jsx
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { registerUser } from "../service/authService"; // Axios service
import "react-toastify/dist/ReactToastify.css";
import "../CSS/user.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData); // Axios service call
      toast.success(response.message || "Registration successful!");
      setFormData({ username: "", email: "", phone: "", password: "" });
      navigate("/login",{
        state: {toastMessage: response.message || "Registration successful!"}
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Registration Page | Book Haven </title>
      </Helmet>
      <section className="loginbg">
        <div className="innerContainer">
          <div className="row glassBox">
            <h1 className="text-center">Registration</h1>
            <form onSubmit={handleSubmit} className="inputArea">
              {/* Username Input */}
              <div className="col-auto my-2">
                <label htmlFor="username" className="form-label fw-bold" style={{ color: "whitesmoke", fontSize: "1.10rem" }}>
                  User Name
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-control"
                  id="username"
                  placeholder="Enter Your Username..."
                  required
                />
              </div>

              {/* Email Input */}
              <div className="col-auto my-2">
                <label htmlFor="email" className="form-label fw-bold" style={{ color: "whitesmoke", fontSize: "1.10rem" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  id="email"
                  placeholder="Enter Your Email..."
                  required
                />
              </div>

              {/* Phone Input */}
              <div className="col-auto my-2">
                <label htmlFor="phone" className="form-label fw-bold" style={{ color: "whitesmoke", fontSize: "1.10rem" }}>
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-control"
                  id="phone"
                  placeholder="Enter Your Phone Number..."
                  required
                />
              </div>

              {/* Password Input */}
              <div className="col-auto my-2">
                <label htmlFor="password" className="form-label fw-bold" style={{ color: "whitesmoke", fontSize: "1.10rem" }}>
                  Password
                </label>
                <div className="d-flex">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-control"
                    style={{ borderRadius: "0.5rem 0rem 0rem 0.5rem"}}
                    id="password"
                    placeholder="Enter Password..."
                    required
                  />
                  <button
                    type="button"
                    className="passbtn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Login Redirect */}
              <div className="col-auto my-2">
                <p className="text-center fw-bold" style={{ color: "black", fontSize: "1.10rem" }}>
                  Already Have an Account?{" "}
                  <Link to="/login" className="fw-bold"> 
                  Login Now
                  </Link>

                </p>
              </div>

              {/* Submit Button */}
              <div className="col-auto my-1 d-flex justify-content-center submit-btn">
                <button type="submit">Register Now</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default Register;
