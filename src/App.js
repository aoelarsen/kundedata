import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';
import CustomerDetails from './CustomerDetails';
import EditCustomer from './EditCustomer';
import SearchBar from './SearchBar';

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const deleteCustomer = (id) => {
    setCustomers((prevCustomers) => prevCustomers.filter(customer => customer.id !== id));
  };

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

  return (
    <Router>
      <div>
        <nav className="bg-gray-800 p-4">
          <ul className="flex space-x-4 text-white">
            <li>
              <Link to="/" className="hover:text-gray-300">Registrer Kunde</Link>
            </li>
          </ul>
        </nav>

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
                  />
<CustomerForm addCustomer={(newCustomer) => setCustomers([...customers, newCustomer])} customers={customers} />
                  <CustomerList customers={filteredCustomers} deleteCustomer={deleteCustomer} />

                </>
              }
            />
            <Route
        path="/customer-details/:id"
        element={<CustomerDetails customers={customers} />}
            />
            <Route
              path="/edit-customer/:id"
              element={<EditCustomer customers={customers} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
