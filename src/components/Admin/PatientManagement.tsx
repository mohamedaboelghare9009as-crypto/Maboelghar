import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Users, Search, Eye, Mail, Phone, Calendar, Filter } from 'lucide-react';

export default function PatientManagement() {
  const { patients } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'with-conditions') return matchesSearch && patient.medicalHistory && patient.medicalHistory.length > 0;
    if (selectedFilter === 'on-medications') return matchesSearch && patient.medications && patient.medications.length > 0;
    if (selectedFilter === 'with-allergies') return matchesSearch && patient.allergies && patient.allergies.length > 0;
    
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getPatientRiskLevel = (patient: any) => {
    let riskFactors = 0;
    
    if (patient.medicalHistory && patient.medicalHistory.length > 2) riskFactors++;
    if (patient.allergies && patient.allergies.length > 0) riskFactors++;
    if (patient.lifestyle?.smoking) riskFactors++;
    if (patient.medications && patient.medications.length > 3) riskFactors++;
    
    if (riskFactors >= 3) return 'high';
    if (riskFactors >= 1) return 'medium';
    return 'low';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Total Patients: {filteredPatients.length}</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Patients</option>
              <option value="with-conditions">With Medical Conditions</option>
              <option value="on-medications">On Medications</option>
              <option value="with-allergies">With Allergies</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{patients.length}</h3>
                <p className="text-sm text-gray-600">Total Patients</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-600 rounded-full" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {patients.filter(p => getPatientRiskLevel(p) === 'low').length}
                </h3>
                <p className="text-sm text-gray-600">Low Risk</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-yellow-600 rounded-full" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {patients.filter(p => getPatientRiskLevel(p) === 'medium').length}
                </h3>
                <p className="text-sm text-gray-600">Medium Risk</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-600 rounded-full" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {patients.filter(p => getPatientRiskLevel(p) === 'high').length}
                </h3>
                <p className="text-sm text-gray-600">High Risk</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        {filteredPatients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p>No patients found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Demographics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conditions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => {
                  const riskLevel = getPatientRiskLevel(patient);
                  
                  return (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <Users className="h-5 w-5 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {patient.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {patient.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {patient.phone}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Age: {calculateAge(patient.dateOfBirth)} years
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.gender || 'N/A'}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(riskLevel)}`}>
                          {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                            <div className="space-y-1">
                              {patient.medicalHistory.slice(0, 2).map((condition, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mr-1"
                                >
                                  {condition}
                                </span>
                              ))}
                              {patient.medicalHistory.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{patient.medicalHistory.length - 2} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">No conditions</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-900">
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}