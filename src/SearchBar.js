import React from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar({ searchQuery, setSearchQuery, filteredCustomers }) {
  const navigate = useNavigate();

  const handleSelect = (customer) => {
    setSearchQuery('');  // Nullstill søkefeltet
    navigate(`/customer-details/${customer.id}`);  // Naviger til kundens detaljer.
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

export default SearchBar;
