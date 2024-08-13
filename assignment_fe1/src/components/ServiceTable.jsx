import React, { useEffect, useState, useMemo } from 'react';
import './../index.css';

const ServiceTable = () => {
  const [services, setServices] = useState([]);
  const [serviceNameFilter, setServiceNameFilter] = useState('');
  const [sideFilter, setSideFilter] = useState('');
  const [sortMetric, setSortMetric] = useState('requests');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/services.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []);

  const filteredAndSortedServices = useMemo(() => {
    let filtered = services;

    if (serviceNameFilter) {
      filtered = filtered.filter(service =>
        service.service.toLowerCase().includes(serviceNameFilter.toLowerCase())
      );
    }

    if (sideFilter) {
      filtered = filtered.filter(service => service[sideFilter.toLowerCase()]);
    }

    // Sorting logic
    filtered.sort((a, b) => {
      const aValue = sideFilter === 'Server' ? a.server[sortMetric] : a.client[sortMetric];
      const bValue = sideFilter === 'Server' ? b.server[sortMetric] : b.client[sortMetric];
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [serviceNameFilter, sideFilter, sortMetric, sortOrder, services]);

  return (
    <div className='poppins-regular mx-10'>
      <h1 className='text-4xl py-4 mb-4'>Service Metrics</h1>

      <div className='button-container'>
        <input
          type='text'
          placeholder='Filter by Service Name'
          value={serviceNameFilter}
          onChange={(e) => setServiceNameFilter(e.target.value)}
          className='border p-2 rounded'
        />
        <select
          value={sideFilter}
          onChange={(e) => setSideFilter(e.target.value)}
          className='border p-2 rounded'
        >
          <option value=''>Filter by Client/Server</option>
          <option value='Client'>Client</option>
          <option value='Server'>Server</option>
        </select>

        <select
          value={sortMetric}
          onChange={(e) => setSortMetric(e.target.value)}
          className='border p-2 rounded'
        >
          <option value='requests'>Requests</option>
          <option value='rate'>Rates</option>
          <option value='p75'>P75</option>
          <option value='p90'>P90</option>
          <option value='p99'>P99</option>
          <option value='error'>Errors</option>
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className='border p-2 rounded sort-button'
        >
          {sortOrder === 'asc' ? 'Ascending ▲' : 'Descending ▼'}
        </button>
      </div>

      <div className="table-container">
        <table className='w-full'>
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Metric By Client/Server</th>
              <th>Requests</th>
              <th>Rates</th>
              <th>P75</th>
              <th>P90</th>
              <th>P99</th>
              <th>Errors</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedServices.map((service) => (
              <React.Fragment key={service.service}>
                {sideFilter !== 'Server' && (
                  <tr>
                    <td rowSpan={sideFilter === 'Server' ? 1 : 2} className='text-center border'>{service.service}</td>
                    <td className='text-center border'>Client</td>
                    <td className='text-center border'>{service.client.requests}</td>
                    <td className='text-center border'>{service.client.rate}</td>
                    <td className='text-center border'>{service.client.p75}</td>
                    <td className='text-center border'>{service.client.p90}</td>
                    <td className='text-center border'>{service.client.p99}</td>
                    <td className='text-center border'>{service.client.error}</td>
                  </tr>
                )}
                {sideFilter !== 'Client' && (
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
    </div>
  );
};

export default ServiceTable;
