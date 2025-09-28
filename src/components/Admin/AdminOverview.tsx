import React from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  Users, 
  Calendar, 
  UserCheck, 
  TrendingUp, 
  Pill,
  AlertCircle,
  Activity,
  Clock
} from 'lucide-react';

export default function AdminOverview() {
  const { patients, doctors, appointments } = useData();

  // Calculate metrics
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled').length;

  // Calculate adherence rate
  const totalMedicationEntries = patients.reduce((sum, patient) => 
    sum + patient.medicationAdherence.length, 0
  );
  const takenMedications = patients.reduce((sum, patient) => 
    sum + patient.medicationAdherence.filter(m => m.taken).length, 0
  );
  const adherenceRate = totalMedicationEntries > 0 ? 
    Math.round((takenMedications / totalMedicationEntries) * 100) : 0;

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today);

  // Recent activity
  const recentAppointments = appointments
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Clinic Overview</h2>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Patients</p>
                <p className="text-3xl font-bold">{totalPatients}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Active Doctors</p>
                <p className="text-3xl font-bold">{totalDoctors}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Today's Appointments</p>
                <p className="text-3xl font-bold">{todayAppointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Adherence Rate</p>
                <p className="text-3xl font-bold">{adherenceRate}%</p>
              </div>
              <Pill className="h-8 w-8 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-gray-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{totalAppointments}</h3>
                <p className="text-sm text-gray-600">Total Appointments</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{completedAppointments}</h3>
                <p className="text-sm text-gray-600">Completed Visits</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{scheduledAppointments}</h3>
                <p className="text-sm text-gray-600">Scheduled Visits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          
          {recentAppointments.length > 0 ? (
            <div className="space-y-3">
              {recentAppointments.map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                const doctor = doctors.find(d => d.id === appointment.doctorId);
                
                return (
                  <div key={appointment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      appointment.status === 'completed' ? 'bg-green-500' :
                      appointment.status === 'scheduled' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {patient?.name || 'Unknown Patient'} • {doctor?.name || 'Unknown Doctor'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p>No recent activity</p>
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-gray-900">Patient Portal</span>
              </div>
              <span className="text-xs text-green-700 font-medium">Online</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-gray-900">Doctor Dashboard</span>
              </div>
              <span className="text-xs text-green-700 font-medium">Online</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-gray-900">AI Analysis</span>
              </div>
              <span className="text-xs text-green-700 font-medium">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-sm font-medium text-gray-900">SMS Notifications</span>
              </div>
              <span className="text-xs text-yellow-700 font-medium">Limited</span>
            </div>
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">System Update</p>
                <p className="text-xs text-blue-700 mt-1">
                  All systems are running normally. Next maintenance window: Sunday 2:00 AM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}