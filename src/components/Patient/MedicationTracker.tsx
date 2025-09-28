import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Pill, Check, X, Clock, Calendar, TrendingUp } from 'lucide-react';

export default function MedicationTracker() {
  const { patients, updateMedicationAdherence } = useData();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const patient = patients.find(p => p.id === user?.id);
  
  if (!patient) return <div>Patient not found</div>;

  const handleMedicationToggle = (medication: string, taken: boolean) => {
    updateMedicationAdherence(patient.id, medication, selectedDate, taken);
  };

  const getAdherenceForDate = (medication: string, date: string) => {
    return patient.medicationAdherence.find(
      a => a.medication === medication && a.date === date
    );
  };

  const calculateAdherenceRate = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    let totalMedications = 0;
    let takenMedications = 0;

    patient.medications.forEach(medication => {
      last7Days.forEach(date => {
        totalMedications++;
        const adherence = patient.medicationAdherence.find(
          a => a.medication === medication && a.date === date && a.taken
        );
        if (adherence) takenMedications++;
      });
    });

    return totalMedications > 0 ? Math.round((takenMedications / totalMedications) * 100) : 0;
  };

  const adherenceRate = calculateAdherenceRate();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Pill className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Medication Tracker</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{adherenceRate}%</span>
            <span className="text-sm text-gray-600">7-day adherence</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Daily Reminders</h3>
              <p className="text-sm text-blue-700 mt-1">
                Mark your medications as taken each day. Consistent tracking helps your healthcare team monitor your progress.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {patient.medications.length === 0 ? (
          <div className="text-center py-8">
            <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No medications found. Complete your intake form to add medications.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {patient.medications.map((medication, index) => {
              const adherence = getAdherenceForDate(medication, selectedDate);
              const isTaken = adherence?.taken || false;
              const isToday = selectedDate === new Date().toISOString().split('T')[0];
              
              return (
                <div key={index} className={`p-4 rounded-lg border-2 transition-all ${
                  isTaken 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isTaken ? 'bg-green-600' : 'bg-gray-200'
                      }`}>
                        <Pill className={`h-5 w-5 ${isTaken ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900">{medication}</h3>
                        <p className="text-sm text-gray-500">
                          {isToday ? 'Today' : new Date(selectedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMedicationToggle(medication, false)}
                        disabled={!isToday && selectedDate < new Date().toISOString().split('T')[0]}
                        className={`p-2 rounded-lg transition-colors ${
                          !isTaken
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleMedicationToggle(medication, true)}
                        disabled={!isToday && selectedDate < new Date().toISOString().split('T')[0]}
                        className={`p-2 rounded-lg transition-colors ${
                          isTaken
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {isTaken && (
                    <div className="mt-3 flex items-center space-x-2 text-sm text-green-700">
                      <Check className="h-4 w-4" />
                      <span>Taken at {new Date().toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Weekly Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Overview</h3>
        
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dateStr = date.toISOString().split('T')[0];
            
            const dayMeds = patient.medications.length;
            const takenMeds = patient.medications.filter(med => {
              const adherence = patient.medicationAdherence.find(
                a => a.medication === med && a.date === dateStr && a.taken
              );
              return adherence;
            }).length;
            
            const percentage = dayMeds > 0 ? (takenMeds / dayMeds) * 100 : 0;
            
            return (
              <div key={i} className="text-center">
                <div className="text-xs text-gray-500 mb-2">
                  {date.toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {date.getDate()}
                </div>
                <div className={`w-full h-2 rounded-full ${
                  percentage === 100 ? 'bg-green-500' :
                  percentage > 50 ? 'bg-yellow-500' :
                  percentage > 0 ? 'bg-red-500' :
                  'bg-gray-200'
                }`} />
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(percentage)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}