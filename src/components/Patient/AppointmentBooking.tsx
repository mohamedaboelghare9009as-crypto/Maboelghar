import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, User, Plus, CheckCircle, AlertCircle } from 'lucide-react';

export default function AppointmentBooking() {
  const { patients, doctors, addAppointment } = useData();
  const { user } = useAuth();
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const patient = patients.find((p) => p.id === user?.id);
  
  if (!patient) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>⚠️ Patient not found</h2>
      </div>
    );
  }

  // Load mock appointments
  useEffect(() => {
    const mockAppointments = [
      {
        id: '1',
        patient_id: patient.id,
        doctor_id: doctors[0]?.id || 'doc1',
        date: '2025-10-01',
        time: '09:00',
        status: 'scheduled'
      }
    ];
    setAppointments(mockAppointments);
  }, [patient.id, doctors]);

  const availableTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  ];

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert('Please fill in all fields');
      return;
    }

    const newAppointment = {
      id: Date.now().toString(),
      patient_id: patient.id,
      doctor_id: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      status: 'scheduled',
    };

    setAppointments(prev => [...prev, newAppointment]);

    addAppointment({
      patientId: patient.id,
      doctorId: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      status: 'scheduled',
    });

    setShowBooking(false);
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedTime('');

    alert('✅ Appointment booked successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return { bg: '#e3f2fd', text: '#1976d2' };
      case 'completed': return { bg: '#e8f5e8', text: '#2e7d2e' };
      case 'cancelled': return { bg: '#ffebee', text: '#d32f2f' };
      default: return { bg: '#f5f5f5', text: '#666' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>📅 Appointment Booking</h2>
        <p>✅ Step 5: Appointment display working!</p>
        <p>Patient: {patient.name} | Appointments: {appointments.length}</p>
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
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Doctor:</label>
                <select 
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Date:</label>
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Time:</label>
                <select 
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="">Choose time</option>
                  {availableTimeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleBookAppointment}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Book Appointment
              </button>
              <button
                onClick={() => setShowBooking(false)}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Appointments List */}
        <div>
          <h4>Your Appointments</h4>
          
          {appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
              <Calendar size={48} color="#ccc" style={{ margin: '0 auto 16px auto' }} />
              <p>📋 No appointments scheduled</p>
              <p>Book your first appointment to get started</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {appointments
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((appointment) => {
                  const doctor = doctors.find((d) => d.id === appointment.doctor_id);
                  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
                  const isUpcoming = appointmentDate > new Date();
                  const statusColors = getStatusColor(appointment.status);

                  return (
                    <div
                      key={appointment.id}
                      style={{
                        padding: '15px',
                        borderRadius: '8px',
                        border: `2px solid ${isUpcoming ? '#007bff' : '#ddd'}`,
                        backgroundColor: isUpcoming ? '#f8f9ff' : '#f9f9f9'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{
                            padding: '10px',
                            borderRadius: '50%',
                            backgroundColor: isUpcoming ? '#e3f2fd' : '#f5f5f5'
                          }}>
                            <User size={24} color={isUpcoming ? '#007bff' : '#666'} />
                          </div>

                          <div>
                            <h5 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                              {doctor?.name || 'Doctor Not Found'}
                            </h5>
                            <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                              {doctor?.specialization || 'General Practice'}
                            </p>
                            <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#666' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Calendar size={14} />
                                <span>{new Date(appointment.date).toLocaleDateString()}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Clock size={14} />
                                <span>{appointment.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '20px',
                          backgroundColor: statusColors.bg,
                          color: statusColors.text,
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          {getStatusIcon(appointment.status)}
                          <span style={{ textTransform: 'capitalize' }}>{appointment.status}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}