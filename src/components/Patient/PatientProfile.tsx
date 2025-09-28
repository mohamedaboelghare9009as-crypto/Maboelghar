import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Pill, 
  AlertTriangle,
  Brain,
  Calendar,
  Activity
} from 'lucide-react';

export default function PatientProfile() {
  const { patients } = useData();
  const { user } = useAuth();
  
  const patient = patients.find(p => p.id === user?.id);
  
  if (!patient) return <div>Patient not found</div>;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <User className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Patient Profile</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">{patient.name}</div>
                <div className="text-sm text-gray-600">Full Name</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">{patient.email}</div>
                <div className="text-sm text-gray-600">Email Address</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">{patient.phone}</div>
                <div className="text-sm text-gray-600">Phone Number</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {patient.dateOfBirth && (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">
                    {formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)} years old)
                  </div>
                  <div className="text-sm text-gray-600">Date of Birth</div>
                </div>
              </div>
            )}

            {patient.gender && (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">{patient.gender}</div>
                  <div className="text-sm text-gray-600">Gender</div>
                </div>
              </div>
            )}

            {patient.address && (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">{patient.address}</div>
                  <div className="text-sm text-gray-600">Address</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medical History */}
        {patient.medicalHistory && patient.medicalHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Medical History</h3>
            </div>
            <div className="space-y-2">
              {patient.medicalHistory.map((condition, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-red-800">{condition}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Medications */}
        {patient.medications && patient.medications.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Pill className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Current Medications</h3>
            </div>
            <div className="space-y-2">
              {patient.medications.map((medication, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-800">{medication}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Allergies */}
        {patient.allergies && patient.allergies.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Known Allergies</h3>
            </div>
            <div className="space-y-2">
              {patient.allergies.map((allergy, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-800">{allergy}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lifestyle */}
        {patient.lifestyle && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Lifestyle</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                <span className="text-sm text-purple-800">Smoking</span>
                <span className={`text-sm font-medium ${patient.lifestyle.smoking ? 'text-red-600' : 'text-green-600'}`}>
                  {patient.lifestyle.smoking ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                <span className="text-sm text-purple-800">Alcohol</span>
                <span className={`text-sm font-medium ${patient.lifestyle.alcohol ? 'text-yellow-600' : 'text-green-600'}`}>
                  {patient.lifestyle.alcohol ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                <span className="text-sm text-purple-800">Exercise Level</span>
                <span className="text-sm font-medium text-purple-800">{patient.lifestyle.exercise}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Health Summary */}
      {patient.aiSummary && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Health Summary</h3>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-indigo-800">{patient.aiSummary}</p>
          </div>
        </div>
      )}

      {/* Emergency Contact */}
      {patient.emergencyContact && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Phone className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800 font-medium">{patient.emergencyContact}</p>
          </div>
        </div>
      )}
    </div>
  );
}