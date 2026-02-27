import React from 'react';
import Web3Provider from './Web3Provider.jsx';
import ServicePayment from './ServicePayment.jsx';

export default function ServicesPayments({ serviceId, serviceName, price }) {
  return (
    <Web3Provider>
      <ServicePayment
        serviceId={serviceId}
        serviceName={serviceName}
        price={price}
      />
    </Web3Provider>
  );
}
