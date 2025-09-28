import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Plus, Loader2 } from 'lucide-react';

// Inline Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Types
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  is_available: boolean;
}

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason?: string;
  notes?: string;
  doctors?: Doctor;
}

export default function PatientDashboard() {
  const currentPatientId = 'john-smith-patient-id'; // This should come from your auth context

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  // Load data functions
  const loadDoctors = async () => {
    if (!supabase) {
      console.log('Using mock doctors - no database connection');
      return [
        { id: 'doc1', name: 'Dr. Sarah Johnson', specialization: 'Internal Medicine', email: 'sarah@hospital.com', is_available: true },
        { id: 'doc2', name: 'Dr. Michael Chen', specialization: 'Cardiology', email: 'michael@hospital.com', is_available: true },
        { id: 'doc3', name: 'Dr. Emily Rodriguez', specialization: 'Pediatrics', email: 'emily@hospital.com', is_available: true }
      ];
    }

    try {
      console.log('Loading doctors from Supabase...');
      const { data, error } = await supabase.from('doctors').select('*').eq('is_available', true);
      if (error) {
        console.error('Error loading doctors:', error);
        return [];
      }
      console.log(`Loaded ${data?.length || 0} doctors from database`);
      return data || [];
    } catch (error) {
      console.error('Exception loading doctors:', error);
      return [];
    }
  };

  const loadAppointments = async () => {
    if (!supabase) {
      console.log('No database connection - empty appointments');
      return [];
    }

    try {
      console.log('Loading appointments for patient:', currentPatientId);
      const { data, error } = await supabase
        .from('appointments')
        .select('*, doctors(*)')
        .eq('patient_id', currentPatientId);
      
      if (error) {
        console.error('Error loading appointments:', error);
        return [];
      }
      console.log(`Loaded ${data?.length || 0} appointments from database`);
      return data || [];
    } catch (error) {
      console.error('Exception loading appointments:', error);
      return [];
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Starting data load...');
        
        const [doctorsData, appointmentsData] = await Promise.all([
          loadDoctors(),
          loadAppointments()
        ]);

        setDoctors(doctorsData);
        setAppointments(appointmentsData);
        console.log('✅ Data loading complete');
      } catch (error) {
        console.error('❌ Error in loadData:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const availableTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  ];

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert('Please fill in all required fields');
      return;
    }

    // If no database connection, create mock appointment
    if (!supabase) {
      const mockAppointment = {
        id: Date.now().toString(),
        patient_id: currentPatientId,
        doctor_id: selectedDoctor,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        status: 'scheduled',
        reason: reason || undefined,
        doctors: doctors.find(d => d.id === selectedDoctor)
      };
      
      setAppointments(prev => [...prev, mockAppointment]);
      setShowBooking(false);
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      setReason('');
      alert('✅ Demo appointment booked! (Connect database for real booking)');
      return;
    }

    try {
      setBookingLoading(true);
      console.log('📅 Creating appointment in database...');

      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: currentPatientId,
          doctor_id: selectedDoctor,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          status: 'scheduled',
          reason: reason || null
        }])
        .select('*, doctors(*)')
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(error.message);
      }

      console.log('✅ Appointment created successfully');
      setAppointments(prev => [...prev, data]);

      // Reset form
      setShowBooking(false);
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      setReason('');

      alert('✅ Appointment booked successfully!');
    } catch (error: any) {
      console.error('❌ Failed to book appointment:', error);
      alert(`Failed to book appointment: ${error.message}`);
    } finally {
      setBookingLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading appointments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🔵 BLUE STATUS BOX - YOU SHOULD SEE THIS! */}
      <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-blue-600 rounded-full flex-shrink-0"></div>
          <div>
            <h3 className="text-lg font-bold text-blue-800">
              🚀 UPDATED PATIENT DASHBOARD ACTIVE!
            </h3>
            <p className="text-sm text-blue-700">
              Database: {supabase ? '✅ Connected to Supabase' : '❌ Demo mode'} | 
              Doctors: {doctors.length} | 
              Appointments: {appointments.length}
            </p>
            <p className="text-xs text-blue-600">
              Environment: URL {supabaseUrl ? '✅' : '❌'} | Key {supabaseAnonKey ? '✅' : '❌'} | 
              Patient: {currentPatientId}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
          </div>

          <button
            onClick={() => setShowBooking(!showBooking)}
            disabled={bookingLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Booking Form */}
        {showBooking && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Book New Appointment</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor *
                </label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={bookingLoading}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={bookingLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={bookingLoading}
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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Visit (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Brief description of your health concern..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={bookingLoading}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleBookAppointment}
                disabled={bookingLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {bookingLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Book Appointment</span>
              </button>
              <button
                onClick={() => setShowBooking(false)}
                disabled={bookingLoading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Appointments List */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Appointments</h3>

          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p>No appointments scheduled</p>
              <p className="text-sm">Book your first appointment to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments
                .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
                .map((appointment) => {
                  const appointmentDate = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
                  const isUpcoming = appointmentDate > new Date();

                  return (
                    <div
                      key={appointment.id}
                      className={`p-4 rounded-lg border-2 ${
                        isUpcoming ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${isUpcoming ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <User className={`h-6 w-6 ${isUpcoming ? 'text-blue-600' : 'text-gray-600'}`} />
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {appointment.doctors?.name || 'Doctor Not Found'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {appointment.doctors?.specialization || 'General Practice'}
                            </p>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{appointment.appointment_time}</span>
                              </div>
                            </div>
                            {appointment.reason && (
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Reason:</strong> {appointment.reason}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="capitalize">{appointment.status}</span>
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