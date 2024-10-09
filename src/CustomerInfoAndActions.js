import React from 'react';

function CustomerInfoAndActions({ customer, serviceDetails, handlePrintLabel, handleSendSMS }) {
    return (
        <>
            {customer && (
                <div className="bg-gray-100 p-6 rounded-lg mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Kundedetaljer</h2>
                    <div className="space-y-4">
                        <div>
                            <span className="font-semibold">Navn: </span>
                            {customer.firstName} {customer.lastName}
                        </div>
                        <div>
                            <span className="font-semibold">Telefonnummer: </span>
                            {customer.phoneNumber}
                        </div>
                        <div>
                            <span className="font-semibold">Epost: </span>
                            {customer.email}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between mb-6">
                <button
                    onClick={handlePrintLabel}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Skriv ut label (Servicenr: {serviceDetails?.serviceid})
                </button>

                <button
                    onClick={handleSendSMS}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Send SMS
                </button>
            </div>
        </>
    );
}

export default CustomerInfoAndActions;
