import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart3, Users, Calendar, TrendingUp, Pill, CheckCircle } from 'lucide-react';

export default function DoctorAnalytics() {
  const { patients, appointments } = useData();
  const { user } = useAuth();

  const doctorAppointments = appointments.filter(a => a.doctorId === user?.id);
  
  // Calculate metrics
  const totalPatients = patients.length;
  const completedAppointments = doctorAppointments.filter(a => a.status === 'completed').length;
  const scheduledAppointments = doctorAppointments.filter(a => a.status === 'scheduled').length;
  
  // Calculate adherence rate
  const totalMedicationEntries = patients.reduce((sum, patient) => 
    sum + patient.medicationAdherence.length, 0
  );
  const takenMedications = patients.reduce((sum, patient) => 
    sum + patient.medicationAdherence.filter(m => m.taken).length, 0
  );
  const adherenceRate = totalMedicationEntries > 0 ? 
    Math.round((takenMedications / totalMedicationEntries) * 100) : 0;

  // Get appointments for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyAppointments = last7Days.map(date => ({
    date,
    count: doctorAppointments.filter(a => a.date === date).length,
    day: new Date(date).toLocaleDateString('en', { weekday: 'short' })
  }));

  const maxAppointments = Math.max(...dailyAppointments.map(d => d.count), 1);

  // Patient conditions analysis
  const conditionCounts: { [key: string]: number } = {};
  patients.forEach(patient => {
    patient.medicalHistory?.forEach(condition => {
      conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });
  });

  const topConditions = Object.entries(conditionCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        </div>

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
                <p className="text-green-100">Completed Visits</p>
                <p className="text-3xl font-bold">{completedAppointments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Scheduled Visits</p>
                <p className="text-3xl font-bold">{scheduledAppointments}</p>
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

        {/* Daily Appointments Chart */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Appointments (Last 7 Days)</h3>
          <div className="flex items-end space-x-2 h-40">
            {dailyAppointments.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col justify-end h-32">
                  <div
                    className="bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600"
                    style={{
                      height: `${(day.count / maxAppointments) * 100}%`,
                      minHeight: day.count > 0 ? '4px' : '0px'
                    }}
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-gray-900">{day.count}</p>
                  <p className="text-xs text-gray-600">{day.day}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Conditions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Conditions</h3>
            {topConditions.length > 0 ? (
              <div className="space-y-3">
                {topConditions.map(([condition, count], index) => (
                  <div key={condition} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-red-500' :
                        index === 1 ? 'bg-orange-500' :
                        index === 2 ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{condition}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{count} patients</span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            index === 0 ? 'bg-red-500' :
                            index === 1 ? 'bg-orange-500' :
                            index === 2 ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`}
                          style={{ width: `${(count / totalPatients) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No condition data available</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-gray-700">Average Age</span>
                <span className="font-bold text-blue-600">
                  {patients.length > 0 
                    ? Math.round(patients.reduce((sum, p) => {
                        if (p.dateOfBirth) {
                          const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();
                          return sum + age;
                        }
                        return sum;
                      }, 0) / patients.filter(p => p.dateOfBirth).length) 
                    : 0
                  } years
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-gray-700">Patients with Allergies</span>
                <span className="font-bold text-yellow-600">
                  {patients.filter(p => p.allergies && p.allergies.length > 0).length}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-gray-700">Patients on Medication</span>
                <span className="font-bold text-green-600">
                  {patients.filter(p => p.medications && p.medications.length > 0).length}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-gray-700">Lab Results Uploaded</span>
                <span className="font-bold text-purple-600">
                  {patients.reduce((sum, p) => sum + (p.labResults?.length || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}