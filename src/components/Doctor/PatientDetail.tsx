import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { ArrowLeft, User, Heart, Pill, AlertTriangle, FileText, Brain, Calendar, CreditCard as Edit, Save, X } from 'lucide-react';

interface PatientDetailProps {
  patientId: string;
  onBack: () => void;
}

export default function PatientDetail({ patientId, onBack }: PatientDetailProps) {
  const { patients, appointments, updateAppointment } = useData();
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const patient = patients.find(p => p.id === patientId);
  const patientAppointments = appointments.filter(a => a.patientId === patientId);

  if (!patient) {
    return <div>Patient not found</div>;
  }

  const handleEditNotes = (appointmentId: string, currentNotes: string = '') => {
    setEditingNotes(appointmentId);
    setNoteText(currentNotes);
  };

  const handleSaveNotes = (appointmentId: string) => {
    updateAppointment(appointmentId, { 
      notes: noteText,
      status: 'completed'
    });
    setEditingNotes(null);
    setNoteText('');
  };

  const handleCancelEdit = () => {
    setEditingNotes(null);
    setNoteText('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <User className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
        </div>

        {/* Patient Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{patient.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{patient.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{patient.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-medium">{patient.dateOfBirth ? formatDate(patient.dateOfBirth) : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-medium">{patient.gender || 'N/A'}</p>
                </div>
              </div>
              {patient.address && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{patient.address}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Medical History</h4>
              </div>
              <div className="text-sm text-blue-800">
                {patient.medicalHistory && patient.medicalHistory.length > 0 
                  ? patient.medicalHistory.join(', ')
                  : 'No conditions recorded'
                }
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Pill className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-900">Current Medications</h4>
              </div>
              <div className="text-sm text-green-800">
                {patient.medications && patient.medications.length > 0 
                  ? patient.medications.join(', ')
                  : 'No medications recorded'
                }
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <h4 className="font-medium text-yellow-900">Allergies</h4>
              </div>
              <div className="text-sm text-yellow-800">
                {patient.allergies && patient.allergies.length > 0 
                  ? patient.allergies.join(', ')
                  : 'No allergies recorded'
                }
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        {patient.aiSummary && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="h-6 w-6 text-indigo-600" />
              <h3 className="text-lg font-semibold text-indigo-900">AI Health Summary</h3>
            </div>
            <p className="text-indigo-800">{patient.aiSummary}</p>
          </div>
        )}

        {/* Lab Results */}
        {patient.labResults && patient.labResults.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Lab Results</h3>
            <div className="space-y-4">
              {patient.labResults.map((result) => (
                <div key={result.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{result.fileName}</h4>
                    <span className="text-sm text-gray-500">
                      {formatDate(result.uploadDate)}
                    </span>
                  </div>
                  <div className="bg-white border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                      <p className="text-sm text-blue-800">{result.aiSummary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visit History */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit History</h3>
          {patientAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p>No appointments recorded</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patientAppointments
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((appointment) => (
                  <div key={appointment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatDate(appointment.date)} at {appointment.time}
                          </p>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>

                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => handleEditNotes(appointment.id, appointment.notes)}
                          className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Add Notes</span>
                        </button>
                      )}
                    </div>

                    {editingNotes === appointment.id ? (
                      <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add visit notes..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-3"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveNotes(appointment.id)}
                            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            <Save className="h-4 w-4" />
                            <span>Save & Complete</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            <X className="h-4 w-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : appointment.notes && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start space-x-2">
                          <FileText className="h-4 w-4 text-gray-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">Visit Notes:</p>
                            <p className="text-sm text-gray-700">{appointment.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}