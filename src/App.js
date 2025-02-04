import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';  // Importer ProtectedRoute
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
import SendSMS from './SendSMS';
import StatusForm from './StatusForm';
import StatusList from './StatusList';
import StatusChange from './StatusChange';
import TodoList from './TodoList';
import ServiceDetailsBike from './ServiceDetailsBike';
import ServiceDetailsSki from './ServiceDetailsSki';
import ServiceDetailsClub from './ServiceDetailsClub';
import ServiceDetailsSkate from './ServiceDetailsSkate';
import CompletedTasks from './CompletedTasks'; // Importer den nye komponenten
import FixedPriceForm from './FixedPriceForm';
import FixedPriceList from './FixedPriceList';
import FixedPriceChange from './FixedPriceChange';
import PartList from './PartList';
import PartForm from './PartForm';
import PartChange from './PartChange';
import Login from './Login';



function App() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');

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
        const response = await fetch(`${API_BASE_URL}/services`);
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
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute element={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
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
                  </div>
                  <CompletedTasks />
                </div>
              } />
            }
          />
          
          <Route
            path="/customer-list"
            element={<ProtectedRoute element={<CustomerList customers={customers} deleteCustomer={(id) => setCustomers(customers.filter(customer => customer.id !== id))} />} />}
          />
          
          <Route
            path="/customer-details/:id"
            element={<ProtectedRoute element={<CustomerDetails customers={customers} />} />}
          />
          
          <Route
            path="/edit-customer/:id"
            element={<ProtectedRoute element={<EditCustomer customers={customers} updateCustomer={updateCustomer} />} />}
          />
          
          <Route
            path="/order-details/:id"
            element={<ProtectedRoute element={<OrderDetails />} />}
          />
          
          <Route
            path="/ordre"
            element={<ProtectedRoute element={<OrderList orders={orders} />} />}
          />
          
          <Route
            path="/service-details/:id"
            element={<ProtectedRoute element={<ServiceDetails />} />}
          />
          
          <Route
            path="/service"
            element={<ProtectedRoute element={<ServiceList services={services} />} />}
          />
          
          <Route
            path="/hjelpemidler"
            element={<ProtectedRoute element={<Calculator />} />}
          />
          
          <Route
            path="/sms-template-change/:id"
            element={<ProtectedRoute element={<SmsTemplateChange />} />}
          />
          
          <Route
            path="/sms-templates"
            element={<ProtectedRoute element={<SmsTemplateList />} />}
          />
          
          <Route
            path="/sms-template-form"
            element={<ProtectedRoute element={<SmsTemplateForm />} />}
          />
          
          <Route
            path="/employees"
            element={<ProtectedRoute element={<EmployeeList />} />}
          />
          
          <Route
            path="/employee-list"
            element={<ProtectedRoute element={<EmployeeList />} />}
          />
          
          <Route
            path="/employee-change/:id"
            element={<ProtectedRoute element={<EmployeeChange />} />}
          />
          
          <Route
            path="/employee-form"
            element={<ProtectedRoute element={<EmployeeForm />} />}
          />
          
          <Route
            path="/create-order/:customerNumber"
            element={<ProtectedRoute element={<CreateOrder />} />}
          />
          
          <Route
            path="/create-service/:customerNumber"
            element={<ProtectedRoute element={<CreateService />} />}
          />
          
          <Route
            path="/status-form"
            element={<ProtectedRoute element={<StatusForm />} />}
          />
          
          <Route
            path="/status-list"
            element={<ProtectedRoute element={<StatusList />} />}
          />
          
          <Route
            path="/status-change/:id"
            element={<ProtectedRoute element={<StatusChange />} />}
          />
          
          <Route
            path="/sendsms"
            element={<ProtectedRoute element={<SendSMS />} />}
          />
          
          <Route
            path="/todo"
            element={<ProtectedRoute element={<TodoList />} />}
          />
          
          <Route
            path="/service-details-bike/:id"
            element={<ProtectedRoute element={<ServiceDetailsBike />} />}
          />
          
          <Route
            path="/service-details-ski/:id"
            element={<ProtectedRoute element={<ServiceDetailsSki />} />}
          />
          
          <Route
            path="/service-details-skate/:id"
            element={<ProtectedRoute element={<ServiceDetailsSkate />} />}
          />
          
          <Route
            path="/service-details-club/:id"
            element={<ProtectedRoute element={<ServiceDetailsClub />} />}
          />
          
          <Route
            path="/fixed-price-form"
            element={<ProtectedRoute element={<FixedPriceForm />} />}
          />
          
          <Route
            path="/fixed-price-list"
            element={<ProtectedRoute element={<FixedPriceList />} />}
          />
          
          <Route
            path="/fixed-price-change/:id"
            element={<ProtectedRoute element={<FixedPriceChange />} />}
          />
          
          <Route
            path="/part-form"
            element={<ProtectedRoute element={<PartForm />} />}
          />
          
          <Route
            path="/part-list"
            element={<ProtectedRoute element={<PartList />} />}
          />
          
          <Route
            path="/part-change/:id"
            element={<ProtectedRoute element={<PartChange />} />}
          />
        </Routes>
      </div>
    </div>
  </Router>
);


}

export default App;
