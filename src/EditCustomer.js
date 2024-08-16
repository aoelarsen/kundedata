import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditCustomer({ customers, updateCustomer }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
  });

  useEffect(() => {
    const customer = customers.find(cust => cust.id === parseInt(id));
    if (customer) {
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phoneNumber,
        email: customer.email,
      });
    }
  }, [id, customers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCustomer(id, formData);
    navigate('/');
  };

  return (
    <div>
      <h2>Rediger Kunde</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <button type="submit">Lagre</button>
      </form>
    </div>
  );
}

export default EditCustomer;
