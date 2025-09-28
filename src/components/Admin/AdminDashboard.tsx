import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminOverview from './AdminOverview';
import PatientManagement from './PatientManagement';
import ClinicAnalytics from './ClinicAnalytics';
import Header from '../UI/Header';
import { 
  BarChart3, 
  Users,
  Activity,
  Settings
} from 'lucide-react';

type AdminView = 'dashboard' | 'patients' | 'analytics' | 'settings';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'patients', label: 'Patient Management', icon: Users },
    { id: 'analytics', label: 'Clinic Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const renderContent = () => {
    switch (currentView) {
      case 'patients':
        return <PatientManagement />;
      case 'analytics':
        return <ClinicAnalytics />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Admin Portal" user={user} />
      
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
                    ? 'bg-purple-600 text-white'
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
                    ? 'bg-purple-600 text-white'
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

function AdminSettings() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Clinic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
              <input
                type="text"
                defaultValue="SmartClinic Demo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
              <input
                type="tel"
                defaultValue="+1-555-0123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Notification Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3 h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-700">Email notifications for new appointments</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3 h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-700">SMS reminders for patients</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3 h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-700">Weekly analytics reports</span>
            </label>
          </div>
        </div>

        <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}