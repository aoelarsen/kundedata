import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerForm from './CustomerForm';
import CustomerDetails from './CustomerDetails';
import EditCustomer from './EditCustomer';
import SearchBar from './SearchBar';
import NavBar from './NavBar';
import ServiceList from './ServiceList';
import ServiceDetails from './ServiceDetails';
import Calculator from './Calculator';
import CustomerList from './CustomerList';
import OrderDetails from './OrderDetails';
import OrderList from './OrderList';
import EmployeeList from './EmployeeList';
import EmployeeChange from './EmployeeChange';
import EmployeeForm from './EmployeeForm';
import CreateOrder from './CreateOrder';
import CreateService from './CreateService';
import SmsTemplateList from './SmsTemplateList';
import SmsTemplateForm from './SmsTemplateForm';
import SmsTemplateChange from './SmsTemplateChange';
import SendSMS from './SendSMS'; // Import SendSMS
import StatusForm from './StatusForm';
import StatusList from './StatusList';
import StatusChange from './StatusChange';






function App() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Bruk miljøvariabelen direkte
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/customers`);
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
  }, [API_BASE_URL]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders`);
        if (response.ok) {
          const ordersData = await response.json();
          setOrders(ordersData);
        } else {
          console.error('Feil ved henting av ordrer');
        }
      } catch (error) {
        console.error('Feil ved kommunikasjon med serveren:', error);
      }
    };

    fetchOrders();
  }, [API_BASE_URL]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Services`);
        if (response.ok) {
          const servicesData = await response.json();
          setServices(servicesData);
        } else {
          console.error('Feil ved henting av servicer');
        }
      } catch (error) {
        console.error('Feil ved kommunikasjon med serveren:', error);
      }
    };

    fetchServices();
  }, [API_BASE_URL]);

  useEffect(() => {
    const results = customers.filter((customer) =>
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phoneNumber.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(results);

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
                    setPhoneNumber={setPhoneNumber}
                  />
                  <CustomerForm
                    addCustomer={(newCustomer) => setCustomers([...customers, newCustomer])}
                    customers={customers}
                    phoneNumber={phoneNumber}
                    setSearchQuery={setSearchQuery}
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
            <Route
              path="/order-details/:id"
              element={<OrderDetails />}
            />
            <Route
              path="/ordre"
              element={<OrderList orders={orders} />}
            />
            <Route
              path="/service-details/:id"
              element={<ServiceDetails />}
            />
<Route path="/service" element={<ServiceList services={services} />} />

            <Route
              path="/hjelpemidler"
              element={<Calculator />}
            />
            <Route path="/sms-template-change/:id" element={<SmsTemplateChange />} />

        <Route path="/sms-templates" element={<SmsTemplateList />} />
        <Route path="/sms-template-form" element={<SmsTemplateForm />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employee-list" element={<EmployeeList />} />
            <Route path="/employee-change/:id" element={<EmployeeChange />} />
            <Route path="/employee-form" element={<EmployeeForm />} />
            <Route path="/create-order/:customerNumber" element={<CreateOrder />} />
            <Route path="/create-service/:customerNumber" element={<CreateService />} />
            <Route path="/status-form" element={<StatusForm />} />
            <Route path="/status-list" element={<StatusList />} />
            <Route path="/status-change/:id" element={<StatusChange />} />
            <Route path="/sendsms" element={<SendSMS />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
