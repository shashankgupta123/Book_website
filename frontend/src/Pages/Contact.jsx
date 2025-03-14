import React, {useState} from 'react';
import axios from "axios";
import emailjs from "emailjs-com"
import '../CSS/contact.css'

const Contact = () => {
  const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitCount, setSubmitCount] = useState(0);
    const [formData, setFormData] = useState({});
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (submitCount >= 5) {
      setSubmitError("You have reached the maximum number of submissions.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/save-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitCount(submitCount + 1);
        alert("Form submitted successfully!");
        setShowForm(false);
        setSubmitError("");

        const emailResponse = await sendEmail(formData);
        if (emailResponse) {
          console.log("Email sent successfully");
        } else {
          console.log("Error sending email");
        }
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  // Handle Email Sending
  const sendEmail = async (formData) => {
    const emailTemplateParams = {
      to_name: "Admin",
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      store_name: formData.storeName,
    };

    try {
      const result = await emailjs.send(
        "service_i5w8e6j",
        "template_gzgzjrq",
        emailTemplateParams,
        "jbtlMNNQBfxu8oioy"
      );
      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      return null;
    }
  };
  return (
    <>
    <div className='contact-container'>
      <form onSubmit={handleFormSubmit} className="contact-form">
        <h3>Contact Us</h3>
        {submitError && <div className="submit-error">{submitError}</div>}

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Store Name:
          <input
            type="text"
            name="storeName"
            value={formData.storeName}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Message:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      </div>
    </>
  );
}

export default Contact