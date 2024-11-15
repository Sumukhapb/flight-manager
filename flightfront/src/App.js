import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [flights, setFlights] = useState([]);
  const [newFlight, setNewFlight] = useState({
    id: '',
    name: '',
    boarding: '',
    destination: '',
    passport: ''
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get('http://localhost:8001/getAllFlights');
      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFlight({
      ...newFlight,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put('http://localhost:8001/updateData', {
          _id: editing,
          ...newFlight,
        });
        setEditing(null);
      } else {
        await axios.post('http://localhost:8001/insertData', newFlight);
      }
      setNewFlight({
        id: '',
        name: '',
        boarding: '',
        destination: '',
        passport: ''
      });
      fetchFlights();
    } catch (error) {
      console.error('Error saving flight:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8001/deleteRecord/${id}`);
      fetchFlights();
    } catch (error) {
      console.error('Error deleting flight:', error);
    }
  };

  const handleEdit = (flight) => {
    setNewFlight(flight);
    setEditing(flight._id);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Flight Manager</h1>

      <form onSubmit={handleSubmit} className="flight-form">
        <input
          type="text"
          name="name"
          value={newFlight.name}
          onChange={handleChange}
          placeholder="Flight Name"
          required
          className="input-field"
        />
        <input
          type="text"
          name="boarding"
          value={newFlight.boarding}
          onChange={handleChange}
          placeholder="Boarding Location"
          required
          className="input-field"
        />
        <input
          type="text"
          name="destination"
          value={newFlight.destination}
          onChange={handleChange}
          placeholder="Destination"
          required
          className="input-field"
        />
        <input
          type="number"
          name="passport"
          value={newFlight.passport}
          onChange={handleChange}
          placeholder="Passport Number"
          required
          className="input-field"
        />
        <button type="submit" className="submit-button">
          {editing ? 'Update Flight' : 'Add Flight'}
        </button>
      </form>

      <h2 className="flight-list-title">Flights List</h2>
      <ul>
        {flights.map((flight) => (
          <li key={flight._id} className="flight-item">
            <div className="flight-details">
              <p><strong>Name:</strong> {flight.name}</p>
              <p><strong>Boarding:</strong> {flight.boarding}</p>
              <p><strong>Destination:</strong> {flight.destination}</p>
              <p><strong>Passport:</strong> {flight.passport}</p>
            </div>
            <div className="button-group">
              <button onClick={() => handleEdit(flight)} className="edit-button">Edit</button>
              <button onClick={() => handleDelete(flight._id)} className="delete-button">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
