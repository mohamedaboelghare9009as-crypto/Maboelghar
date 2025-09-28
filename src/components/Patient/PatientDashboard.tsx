import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PatientIntake from './PatientIntake';
import MedicationTracker from './MedicationTracker';
import LabUpload from './LabUpload';
import AppointmentBooking from './AppointmentBooking';
import PatientProfile from './PatientProfile';
import Header from '../UI/Header';
import { 
  User, 
  Calendar, 
  Upload, 
  Pill, 
  FileText,
  Activity
} from 'lucide-react';

type PatientView = 'dashboard' | 'intake' | 'medications' | 'labs' | 'appointments' | 'profile';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<PatientView>('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'intake', label: 'Health Intake', icon: FileText },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'labs', label: 'Lab Results', icon: Upload },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  const renderContent = () => {
    switch (currentView) {
      case 'intake':
        return <PatientIntake />;
      case 'medications':
        return <MedicationTracker />;
      case 'labs':
        return <LabUpload />;
      case 'appointments':
        return <AppointmentBooking />;
      case 'profile':
        return <PatientProfile />;
      default:
        return <PatientDashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Patient Portal" user={user} />
      
      <div className="flex flex-col lg:flex-row">
        {/* Mobile Menu */}
        <div className="lg:hidden bg-white border-b overflow-x-auto">
          <div className="flex space-x-1 p-4">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  currentView === id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white shadow-sm">
          <nav className="p-6 space-y-2">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function PatientDashboardHome() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to SmartClinic</h2>
        <p className="text-gray-600 mb-6">
          Manage your health information, track medications, and book appointments all in one place.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Health Intake</h3>
                <p className="text-sm text-gray-600">Complete your medical history</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Pill className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Medications</h3>
                <p className="text-sm text-gray-600">Track your daily medications</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Appointments</h3>
                <p className="text-sm text-gray-600">Schedule your next visit</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Medication reminder completed</span>
            <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Appointment scheduled for next week</span>
            <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}