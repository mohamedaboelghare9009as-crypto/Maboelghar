import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, User, Plus } from 'lucide-react';

export default function AppointmentBooking() {
  const { patients, doctors } = useData();
  const { user } = useAuth();
  const [showBooking, setShowBooking] = useState(false);

  const patient = patients.find((p) => p.id === user?.id);
  
  if (!patient) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>⚠️ Patient not found</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>📅 Appointment Booking</h2>
        <p>✅ Step 3: Icons working!</p>
        <p>Patient: {patient.name}</p>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={24} color="#007bff" />
            <h3>Your Appointments</h3>
          </div>
          <button
            onClick={() => setShowBooking(!showBooking)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={16} />
            Book Appointment
          </button>
        </div>

        {showBooking && (
          <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            <h4>Book New Appointment</h4>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Select Doctor:</label>
              <select style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowBooking(false)}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        )}

        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
          <Calendar size={48} color="#ccc" style={{ margin: '0 auto 16px auto' }} />
          <p>📋 No appointments scheduled</p>
          <p>Book your first appointment to get started</p>
        </div>
      </div>
    </div>
  );
}