import React from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Pill,
  Heart,
  AlertTriangle
} from 'lucide-react';

export default function ClinicAnalytics() {
  const { patients, appointments } = useData();

  // Calculate comprehensive metrics
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const completionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;

  // Age distribution
  const ageGroups = {
    '0-18': 0,
    '19-35': 0,
    '36-50': 0,
    '51-65': 0,
    '65+': 0
  };

  patients.forEach(patient => {
    if (patient.dateOfBirth) {
      const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
      if (age <= 18) ageGroups['0-18']++;
      else if (age <= 35) ageGroups['19-35']++;
      else if (age <= 50) ageGroups['36-50']++;
      else if (age <= 65) ageGroups['51-65']++;
      else ageGroups['65+']++;
    }
  });

  // Medical conditions analysis
  const conditionCounts: { [key: string]: number } = {};
  patients.forEach(patient => {
    patient.medicalHistory?.forEach(condition => {
      conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });
  });

  const topConditions = Object.entries(conditionCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6);

  // Medication adherence analysis
  const totalMedicationEntries = patients.reduce((sum, patient) => 
    sum + patient.medicationAdherence.length, 0
  );
  const takenMedications = patients.reduce((sum, patient) => 
    sum + patient.medicationAdherence.filter(m => m.taken).length, 0
  );
  const adherenceRate = totalMedicationEntries > 0 ? 
    Math.round((takenMedications / totalMedicationEntries) * 100) : 0;

  // Lifestyle factors
  const lifestyleStats = {
    smokers: patients.filter(p => p.lifestyle?.smoking).length,
    alcoholConsumers: patients.filter(p => p.lifestyle?.alcohol).length,
    regularExercise: patients.filter(p => p.lifestyle?.exercise && p.lifestyle.exercise !== 'None').length
  };

  // Appointment trends (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyAppointments = last30Days.map(date => ({
    date,
    count: appointments.filter(a => a.date === date).length,
    day: new Date(date).getDate()
  }));

  const maxDailyAppointments = Math.max(...dailyAppointments.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Clinic Analytics</h2>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Patients</p>
                <p className="text-3xl font-bold">{totalPatients}</p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Appointments</p>
                <p className="text-3xl font-bold">{totalAppointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Completion Rate</p>
                <p className="text-3xl font-bold">{completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-200" />
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Age Distribution */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
            <div className="space-y-3">
              {Object.entries(ageGroups).map(([ageRange, count]) => {
                const percentage = totalPatients > 0 ? (count / totalPatients) * 100 : 0;
                return (
                  <div key={ageRange} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700 w-12">{ageRange}</span>
                      <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {count} ({Math.round(percentage)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Medical Conditions */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Conditions</h3>
            {topConditions.length > 0 ? (
              <div className="space-y-3">
                {topConditions.map(([condition, count], index) => {
                  const percentage = totalPatients > 0 ? (count / totalPatients) * 100 : 0;
                  return (
                    <div key={condition} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          index === 0 ? 'bg-red-500' :
                          index === 1 ? 'bg-orange-500' :
                          index === 2 ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{condition}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {count} ({Math.round(percentage)}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No condition data available</p>
            )}
          </div>
        </div>

        {/* Appointment Trends */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Trends (Last 30 Days)</h3>
          <div className="flex items-end space-x-1 h-32">
            {dailyAppointments.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col justify-end">
                <div
                  className="bg-blue-500 rounded-t-sm transition-all duration-200 hover:bg-blue-600"
                  style={{
                    height: `${(day.count / maxDailyAppointments) * 100}%`,
                    minHeight: day.count > 0 ? '2px' : '0px'
                  }}
                  title={`${day.day}: ${day.count} appointments`}
                />
                {index % 5 === 0 && (
                  <div className="text-xs text-gray-500 mt-1 text-center">{day.day}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Health Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Risk Factors</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-800">Smokers</span>
                <span className="font-bold text-red-900">{lifestyleStats.smokers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-800">Alcohol Consumers</span>
                <span className="font-bold text-red-900">{lifestyleStats.alcoholConsumers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-800">High Risk Patients</span>
                <span className="font-bold text-red-900">
                  {patients.filter(p => (p.medicalHistory?.length || 0) > 2).length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">Health Positive</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-800">Regular Exercise</span>
                <span className="font-bold text-green-900">{lifestyleStats.regularExercise}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-800">Non-Smokers</span>
                <span className="font-bold text-green-900">{totalPatients - lifestyleStats.smokers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-800">Good Adherence</span>
                <span className="font-bold text-green-900">{adherenceRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Pill className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Medication Stats</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-800">On Medications</span>
                <span className="font-bold text-blue-900">
                  {patients.filter(p => p.medications && p.medications.length > 0).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-800">Total Prescriptions</span>
                <span className="font-bold text-blue-900">
                  {patients.reduce((sum, p) => sum + (p.medications?.length || 0), 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-800">Adherence Tracking</span>
                <span className="font-bold text-blue-900">{totalMedicationEntries}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}