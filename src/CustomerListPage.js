// src/CustomerListPage.js
import React from 'react';
import CustomerList from './CustomerList';

function CustomerListPage({ customers, deleteCustomer }) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Kundeliste</h2>
      <CustomerList customers={customers} deleteCustomer={deleteCustomer} />
    </div>
  );
}

export default CustomerListPage;
