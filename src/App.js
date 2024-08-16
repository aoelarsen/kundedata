import React, { useState, useEffect } from 'react';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';

function App() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await fetch('http://localhost:5000/customers');
      const data = await response.json();
      setCustomers(data);
    };

    fetchCustomers();
  }, []);

  const addCustomer = (newCustomer) => {
    setCustomers([...customers, newCustomer]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 p-4">
        <h1 className="text-white text-2xl">Kunderegistrering</h1>
      </nav>
      <div className="container mx-auto p-4">
        <CustomerForm addCustomer={addCustomer} />
        <CustomerList customers={customers} />
      </div>
    </div>
  );
}

export default App;
