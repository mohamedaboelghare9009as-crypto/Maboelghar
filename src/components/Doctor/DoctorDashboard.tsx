import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import PatientList from './PatientList';
import PatientDetail from './PatientDetail';
import DoctorSchedule from './DoctorSchedule';
import DoctorAnalytics from './DoctorAnalytics';
import Header from '../UI/Header';
import { 
  Users, 
  Calendar, 
  BarChart3,
  Stethoscope,
  Activity
} from 'lucide-react';

type DoctorView = 'dashboard' | 'patients' | 'schedule' | 'analytics' | 'patient-detail';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { patients, appointments } = useData();
  const [currentView, setCurrentView] = useState<DoctorView>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] as const;

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today && apt.doctorId === user?.id;
  });

  const renderContent = () => {
    switch (currentView) {
      case 'patients':
        return (
          <PatientList 
            onPatientSelect={(patientId) => {
              setSelectedPatientId(patientId);
              setCurrentView('patient-detail');
            }} 
          />
        );
      case 'schedule':
        return <DoctorSchedule />;
      case 'analytics':
        return <DoctorAnalytics />;
      case 'patient-detail':
        return (
          <PatientDetail 
            patientId={selectedPatientId!} 
            onBack={() => setCurrentView('patients')}
          />
        );
      default:
        return <DoctorDashboardHome todayAppointments={todayAppointments} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Doctor Portal" user={user} />
      
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

function DoctorDashboardHome({ todayAppointments }: { todayAppointments: any[] }) {
  const { patients } = useData();
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, Doctor</h2>
        <p className="text-gray-600 mb-6">
          Here's your daily overview and patient management dashboard.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{todayAppointments.length}</h3>
                <p className="text-sm text-gray-600">Today's Appointments</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{patients.length}</h3>
                <p className="text-sm text-gray-600">Total Patients</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Stethoscope className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">95%</h3>
                <p className="text-sm text-gray-600">Patient Satisfaction</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">85%</h3>
                <p className="text-sm text-gray-600">Avg. Adherence Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
        
        {todayAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p>No appointments scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((appointment) => {
              const patient = patients.find(p => p.id === appointment.patientId);
              return (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{patient?.name || 'Unknown Patient'}</p>
                      <p className="text-sm text-gray-600">{appointment.time}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}