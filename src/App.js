import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerForm from './CustomerForm';
import CustomerDetails from './CustomerDetails';
import EditCustomer from './EditCustomer';
import SearchBar from './SearchBar';
import NavBar from './NavBar';
import Service from './Service';
import Calculator from './Calculator';
import CustomerList from './CustomerList';
import OrderDetails from './OrderDetails'; // Importer OrderDetails
import OrderList from './OrderList';

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:5000/customers');
        if (response.ok) {
          const customersData = await response.json();
          setCustomers(customersData);
        } else {
          console.error('Feil ved henting av kunder');
        }
      } catch (error) {
        console.error('Feil ved kommunikasjon med serveren:', error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const results = customers.filter((customer) =>
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phoneNumber.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(results);

    // Sjekk for 8-sifret telefonnummer som ikke finnes i kundelisten
    if (searchQuery.length === 8 && /^\d{8}$/.test(searchQuery)) {
      const phoneExists = customers.some(c => c.phoneNumber === searchQuery);
      if (!phoneExists) {
        setPhoneNumber(searchQuery);
      } else {
        setPhoneNumber('');
      }
    } else {
      setPhoneNumber('');
    }

  }, [searchQuery, customers]);

  const updateCustomer = (updatedCustomer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  };

  return (
    <Router>
      <div>
        <NavBar />
        <div className="p-4">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filteredCustomers={filteredCustomers}
                    setPhoneNumber={setPhoneNumber} // Passer setPhoneNumber til SearchBar
                  />
                  <CustomerForm 
                    addCustomer={(newCustomer) => setCustomers([...customers, newCustomer])} 
                    customers={customers} 
                    phoneNumber={phoneNumber} // Passer phoneNumber til CustomerForm
                    setSearchQuery={setSearchQuery} // Passer setSearchQuery til CustomerForm
                  />
                </>
              }
            />
            <Route
              path="/customer-list"
              element={
                <CustomerList 
                  customers={customers} 
                  deleteCustomer={(id) => setCustomers(customers.filter(customer => customer.id !== id))} 
                />
              }
            />
            <Route
              path="/customer-details/:id"
              element={<CustomerDetails customers={customers} />}
            />
            <Route
              path="/edit-customer/:id"
              element={<EditCustomer customers={customers} updateCustomer={updateCustomer} />}
            />
            <Route path="/order-details/:id" element={<OrderDetails />} /> {/* Legg til denne ruten */}
            <Route path="/ordre" element={<OrderList />} />
            <Route path="/service" element={<Service />} />
            <Route path="/hjelpemidler" element={<Calculator />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
