import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';

export default function DoctorSchedule() {
  const { appointments, patients, updateAppointment } = useData();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const doctorAppointments = appointments.filter(a => a.doctorId === user?.id);
  const selectedDateAppointments = doctorAppointments.filter(a => a.date === selectedDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
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
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  const getDayAppointments = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return doctorAppointments.filter(a => a.date === dateStr);
  };

  const weekDays = getWeekDays();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Schedule</h2>
          </div>
          
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Week View */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Week Overview</h3>
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((date, index) => {
              const dateStr = date.toISOString().split('T')[0];
              const dayAppointments = getDayAppointments(date);
              const isToday = dateStr === today;
              const isSelected = dateStr === selectedDate;
              
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : isToday
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">
                      {date.toLocaleDateString('en', { weekday: 'short' })}
                    </p>
                    <p className={`text-2xl font-bold ${
                      isSelected ? 'text-blue-600' :
                      isToday ? 'text-green-600' :
                      'text-gray-900'
                    }`}>
                      {date.getDate()}
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        dayAppointments.length > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {dayAppointments.length} appointments
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Appointments for {new Date(selectedDate).toLocaleDateString('en', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          {selectedDateAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p>No appointments scheduled for this day</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  
                  return (
                    <div key={appointment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {patient?.name || 'Unknown Patient'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {patient?.email}
                            </p>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{appointment.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            <span className="capitalize">{appointment.status}</span>
                          </div>
                          
                          {appointment.status === 'scheduled' && (
                            <button
                              onClick={() => updateAppointment(appointment.id, { status: 'completed' })}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-900 mb-1">Visit Notes:</p>
                          <p className="text-sm text-gray-700">{appointment.notes}</p>
                        </div>
                      )}

                      {patient && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                            <div className="bg-red-50 p-3 rounded-lg">
                              <p className="font-medium text-red-900 mb-1">Medical History:</p>
                              <p className="text-red-800">{patient.medicalHistory.join(', ')}</p>
                            </div>
                          )}
                          
                          {patient.medications && patient.medications.length > 0 && (
                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="font-medium text-green-900 mb-1">Medications:</p>
                              <p className="text-green-800">{patient.medications.join(', ')}</p>
                            </div>
                          )}
                          
                          {patient.allergies && patient.allergies.length > 0 && (
                            <div className="bg-yellow-50 p-3 rounded-lg">
                              <p className="font-medium text-yellow-900 mb-1">Allergies:</p>
                              <p className="text-yellow-800">{patient.allergies.join(', ')}</p>
                            </div>
                          )}
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