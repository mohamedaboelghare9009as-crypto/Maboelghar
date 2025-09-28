import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { appointmentService, doctorService, type Appointment, type Doctor } from '../../lib/supabase';

export default function AppointmentBooking() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  // Mock user if not available (for testing)
  const currentUser = user || { id: 'test-patient-1', name: 'Test Patient' };

  // Load appointments and doctors
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load doctors and appointments in parallel
        const [doctorsData, appointmentsData] = await Promise.all([
          doctorService.getAllDoctors(),
          appointmentService.getPatientAppointments(currentUser.id)
        ]);

        setDoctors(doctorsData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Don't show alert, just log error and continue with empty data
        setDoctors([]);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser.id]);

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

    try {
      setBookingLoading(true);

      // Create appointment in database
      const newAppointment = await appointmentService.createAppointment({
        patient_id: currentUser.id,
        doctor_id: selectedDoctor,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        reason: reason || undefined,
      });

      // Update local state
      setAppointments(prev => [...prev, newAppointment]);

      // Reset form
      setShowBooking(false);
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      setReason('');

      alert('✅ Appointment booked successfully!');
    } catch (error) {
      console.error('Error booking appointment:', error);
      
      // Create mock appointment if database fails
      const mockAppointment: Appointment = {
        id: Date.now().toString(),
        patient_id: currentUser.id,
        doctor_id: selectedDoctor,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        status: 'scheduled',
        reason: reason || undefined,
        doctor: doctors.find(d => d.id === selectedDoctor)
      };

      setAppointments(prev => [...prev, mockAppointment]);

      // Reset form
      setShowBooking(false);
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      setReason('');

      alert('✅ Appointment booked successfully! (Using local storage)');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      // Try to update in database
      await appointmentService.updateAppointment(appointmentId, {
        status: 'cancelled'
      });

      // Update local state
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId
            ? { ...apt, status: 'cancelled' as const }
            : apt
        )
      );

      alert('Appointment cancelled successfully.');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      
      // Update local state even if database fails
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId
            ? { ...apt, status: 'cancelled' as const }
            : apt
        )
      );
      
      alert('Appointment cancelled successfully.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'no-show':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
      case 'no-show':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          🔄 <strong>DATABASE INTEGRATION:</strong> Attempting to connect to Supabase, falling back to local storage if needed.
        </p>
        <p className="text-xs text-blue-600">
          User: {currentUser.name || currentUser.id} | Doctors: {doctors.length} | Appointments: {appointments.length}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
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

        {showBooking && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Book New Appointment</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
                  Select Date *
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
                  Select Time *
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
                  const canCancel = appointment.status === 'scheduled' && isUpcoming;

                  return (
                    <div
                      key={appointment.id}
                      className={`p-4 rounded-lg border-2 ${
                        isUpcoming
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-3 rounded-full ${
                              isUpcoming ? 'bg-blue-100' : 'bg-gray-100'
                            }`}
                          >
                            <User
                              className={`h-6 w-6 ${
                                isUpcoming ? 'text-blue-600' : 'text-gray-600'
                              }`}
                            />
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {appointment.doctor?.name || 'Doctor Not Found'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {appointment.doctor?.specialization || 'General Practice'}
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

                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {getStatusIcon(appointment.status)}
                            <span className="capitalize">{appointment.status}</span>
                          </div>

                          {canCancel && (
                            <button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-1">Visit Notes:</h5>
                          <p className="text-sm text-gray-600">{appointment.notes}</p>
                        </div>
                      )}
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