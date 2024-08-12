import React, { useEffect, useState } from 'react';
import './../index.css';

const ServiceTable = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [serviceNameFilter, setServiceNameFilter] = useState('');
  const [sideFilter, setSideFilter] = useState('');
  const [sortMetric, setSortMetric] = useState('requests'); // Default metric for sorting
  const [sortOrder, setSortOrder] = useState('asc'); // Default order is ascending

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/services.json');
      const data = await response.json();
      setServices(data);
      setFilteredServices(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = services;

    // Filter logic
    if (serviceNameFilter) {
      filtered = filtered.filter(service =>
        service.service.toLowerCase().includes(serviceNameFilter.toLowerCase())
      );
    }

    if (sideFilter) {
      filtered = filtered.filter(service =>
        (sideFilter === 'Client' ? service.client : service.server)
      );
    }

    // Sorting logic
    filtered.sort((a, b) => {
      const aValue = sideFilter === 'Server' ? a.server[sortMetric] : a.client[sortMetric];
      const bValue = sideFilter === 'Server' ? b.server[sortMetric] : b.client[sortMetric];
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredServices(filtered);
  }, [serviceNameFilter, sideFilter, sortMetric, sortOrder, services]);

  return (
    <div className='poppins-regular mx-10'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-4xl py-4'>Service Metric</h1>
        
        {/* Filter Inputs */}
        <div className='flex items-center'>
          <input
            type='text'
            placeholder='Filter by Service Name'
            value={serviceNameFilter}
            onChange={(e) => setServiceNameFilter(e.target.value)}
            className='border p-2 rounded mr-4'
          />
          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value)}
            className='border p-2 rounded mr-4'
          >
            <option value=''>Filter by Side</option>
            <option value='Client'>Filter by Client</option>
            <option value='Server'>Filter by Server</option>
          </select>

          <select
            value={sortMetric}
            onChange={(e) => setSortMetric(e.target.value)}
            className='border p-2 rounded mr-4'
          >
            <option value='requests'> Sort by Requests</option>
            <option value='rate'>Sort by Rates</option>
            <option value='p75'>Sort by P75</option>
            <option value='p90'>Sort by P90</option>
            <option value='p99'>Sort by P99</option>
            <option value='error'>Sort by Errors</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className='border p-2 rounded'
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      <table className='w-full border-collapse'>
        <thead>
          <tr className='bg-blue-200 rounded-t-md'>
            <th className='text-center border rounded-tl-lg'>Service Name</th>
            <th className='text-center border'>Metric By Client/Server</th>
            <th className='text-center border'>Requests</th>
            <th className='text-center border'>Rates</th>
            <th className='text-center border'>P75</th>
            <th className='text-center border'>P90</th>
            <th className='text-center border'>P99</th>
            <th className='text-center border rounded-tr-lg'>Errors</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.map((service, index) => (
            <React.Fragment key={index}>
              {/* Client metrics row */}
              {(!sideFilter || sideFilter === 'Client') && (
                <tr>
                  <td rowSpan="2" className='text-center border'>{service.service}</td>
                  <td className='text-center border'>Client</td>
                  <td className='text-center border'>{service.client.requests}</td>
                  <td className='text-center border'>{service.client.rate}</td>
                  <td className='text-center border'>{service.client.p75}</td>
                  <td className='text-center border'>{service.client.p90}</td>
                  <td className='text-center border'>{service.client.p99}</td>
                  <td className='text-center border'>{service.client.error}</td>
                </tr>
              )}
              {/* Server metrics row */}
              {(!sideFilter || sideFilter === 'Server') && (
                <tr>
                  <td className='text-center border'>Server</td>
                  <td className='text-center border'>{service.server.requests}</td>
                  <td className='text-center border'>{service.server.rate}</td>
                  <td className='text-center border'>{service.server.p75}</td>
                  <td className='text-center border'>{service.server.p90}</td>
                  <td className='text-center border'>{service.server.p99}</td>
                  <td className='text-center border'>{service.server.error}</td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTable;
