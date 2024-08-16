import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';
import CustomerDetails from './CustomerDetails';
import EditCustomer from './EditCustomer';

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

    // Sjekk om søkefeltet inneholder et 8-sifret nummer som ikke er registrert
    if (searchQuery.length === 8 && !customers.some(c => c.phoneNumber === searchQuery)) {
      setPhoneNumber(searchQuery);
    } else {
      setPhoneNumber('');
    }

  }, [searchQuery, customers]);

  const addCustomer = (newCustomer) => {
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
  };

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
                    setPhoneNumber={setPhoneNumber}
                  />
                  <CustomerForm addCustomer={addCustomer} phoneNumber={phoneNumber} />
                  <CustomerList customers={filteredCustomers} />
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

function SearchBar({ searchQuery, setSearchQuery, filteredCustomers, setPhoneNumber }) {
  const handleSelect = (customer) => {
    setSearchQuery(customer.firstName + ' ' + customer.lastName);
    setPhoneNumber('');  // Reset phone number if a customer is selected
  };

  return (
    <div className="mb-6 relative">
      <input
        type="text"
        placeholder="Søk etter kunde..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      {searchQuery.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-2 shadow-lg">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <li
                key={customer.id}
                onClick={() => handleSelect(customer)}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {customer.firstName} {customer.lastName} - {customer.email}
              </li>
            ))
          ) : (
            <li className="p-2 text-red-500">Ingen treff</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default App;
