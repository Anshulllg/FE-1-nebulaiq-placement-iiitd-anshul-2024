import React, { useEffect, useState } from 'react';
import './../index.css'; 

const ServiceTable = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/services.json');
      const data = await response.json();
      setServices(data);
    };

    fetchData();
  }, []);

  return (
    <div className='poppins-regular mx-10'>
        <h1 className='text-4xl py-4'>Service Metric</h1>
        <table className='w-full border-collapse'>
        <thead>
            <tr bg-blue-200 rounded-t-md>
            <th className='text-center border rounded-tl-lg'>Service Name</th>
            <th className='text-center border'>Metric By Client/Server</th>
            <th className='text-center'>Requests</th>
            <th className='text-center'>Rates</th>
            <th className='text-center'>P75</th>
            <th className='text-center'>P90</th>
            <th className='text-center'>P99</th>
            <th className='text-center rounded-tr-lg'>Errors</th>
            </tr>
        </thead>
        <tbody >
            {services.map((service, index) => ( 
            <React.Fragment key={index}>
                <tr>
                <td rowSpan="2" className='text-center' >{service.service}</td>
                <td  className='text-center'>Client</td>
                <td  className='text-center'>{service.client.requests}</td>
                <td  className='text-center'>{service.client.rate}</td>
                <td  className='text-center'>{service.client.p75}</td>
                <td  className='text-center'>{service.client.p90}</td>
                <td  className='text-center'>{service.client.p99}</td>
                <td  className='text-center'>{service.client.error}</td>
                </tr>
  
                <tr>
                <td className='text-center'>Server</td>
                <td className='text-center'>{service.server.requests}</td>
                <td className='text-center'>{service.server.rate}</td>
                <td className='text-center'>{service.server.p75}</td>
                <td className='text-center'>{service.server.p90}</td>
                <td className='text-center'>{service.server.p99}</td>
                <td className='text-center'>{service.server.error}</td>
                </tr>
            </React.Fragment>
            ))}
        </tbody>
        </table>
    </div>
  );
};

export default ServiceTable;
