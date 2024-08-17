import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';
import CustomerDetails from './CustomerDetails';
import EditCustomer from './EditCustomer';
import SearchBar from './SearchBar';
import NavBar from './NavBar';  // Importer NavBar-komponenten
import Ordre from './Ordre';
import Service from './Service';
import Hjelpemidler from './Hjelpemidler';


function App() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

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
        <NavBar />  {/* Inkluder NavBar-komponenten */}
        <div className="p-4">
          <Routes>
          <Route
        path="/customer-details/:id"
        element={<CustomerDetails customers={customers} />}
      />
      <Route
        path="/edit-customer/:id"
        element={<EditCustomer customers={customers} />}
      />
            <Route
              path="/"
              element={
                <>
                  <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filteredCustomers={filteredCustomers}
                  />
                  <CustomerForm addCustomer={(newCustomer) => setCustomers([...customers, newCustomer])} customers={customers} />
                  <CustomerList customers={filteredCustomers} deleteCustomer={(id) => setCustomers(customers.filter(customer => customer.id !== id))} />
                </>
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
<Route path="/ordre" element={<Ordre />} />
             <Route path="/service" element={<Service />} />
            
             <Route path="/hjelpemidler" element={<Hjelpemidler />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
