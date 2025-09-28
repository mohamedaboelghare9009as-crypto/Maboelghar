import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Heart, 
  Activity, 
  AlertTriangle, 
  Pill,
  ChevronRight,
  ChevronLeft,
  Check,
  Cigarette,
  Wine,
  Dumbbell
} from 'lucide-react';

interface IntakeData {
  demographics: {
    dateOfBirth: string;
    gender: string;
    address: string;
    emergencyContact: string;
  };
  familyHistory: string[];
  allergies: string[];
  medications: string[];
  medicalHistory: string[];
  lifestyle: {
    smoking: boolean;
    alcohol: boolean;
    exercise: string;
  };
}

export default function PatientIntake() {
  const { updatePatient } = useData();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [intakeData, setIntakeData] = useState<IntakeData>({
    demographics: {
      dateOfBirth: '',
      gender: '',
      address: '',
      emergencyContact: ''
    },
    familyHistory: [],
    allergies: [],
    medications: [],
    medicalHistory: [],
    lifestyle: {
      smoking: false,
      alcohol: false,
      exercise: 'None'
    }
  });

  const steps = [
    { title: 'Demographics', icon: User, description: 'Basic information' },
    { title: 'Medical History', icon: Heart, description: 'Past conditions' },
    { title: 'Medications', icon: Pill, description: 'Current medications' },
    { title: 'Allergies', icon: AlertTriangle, description: 'Known allergies' },
    { title: 'Lifestyle', icon: Activity, description: 'Health habits' },
    { title: 'Review', icon: Check, description: 'Confirm information' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (user) {
      // Generate AI summary based on intake data
      const aiSummary = generateAISummary(intakeData);
      
      updatePatient(user.id, {
        ...intakeData.demographics,
        allergies: intakeData.allergies,
        medications: intakeData.medications,
        medicalHistory: intakeData.medicalHistory,
        lifestyle: intakeData.lifestyle,
        aiSummary
      });

      alert('Intake form submitted successfully!');
    }
  };

  const generateAISummary = (data: IntakeData): string => {
    const summaryParts = [];
    
    if (data.medicalHistory.length > 0) {
      summaryParts.push(`Patient has a history of ${data.medicalHistory.join(', ')}.`);
    }
    
    if (data.allergies.length > 0) {
      summaryParts.push(`Known allergies: ${data.allergies.join(', ')}.`);
    }
    
    if (data.medications.length > 0) {
      summaryParts.push(`Current medications: ${data.medications.join(', ')}.`);
    }
    
    const lifestyleFactors = [];
    if (data.lifestyle.smoking) lifestyleFactors.push('smoking');
    if (data.lifestyle.alcohol) lifestyleFactors.push('alcohol consumption');
    
    if (lifestyleFactors.length > 0) {
      summaryParts.push(`Lifestyle factors include ${lifestyleFactors.join(' and ')}.`);
    }
    
    summaryParts.push(`Exercise level: ${data.lifestyle.exercise.toLowerCase()}.`);
    summaryParts.push('Regular monitoring and follow-up recommended.');
    
    return summaryParts.join(' ');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <DemographicsStep data={intakeData.demographics} onChange={(data) => setIntakeData(prev => ({ ...prev, demographics: data }))} />;
      case 1:
        return <MedicalHistoryStep data={intakeData.medicalHistory} onChange={(data) => setIntakeData(prev => ({ ...prev, medicalHistory: data }))} />;
      case 2:
        return <MedicationsStep data={intakeData.medications} onChange={(data) => setIntakeData(prev => ({ ...prev, medications: data }))} />;
      case 3:
        return <AllergiesStep data={intakeData.allergies} onChange={(data) => setIntakeData(prev => ({ ...prev, allergies: data }))} />;
      case 4:
        return <LifestyleStep data={intakeData.lifestyle} onChange={(data) => setIntakeData(prev => ({ ...prev, lifestyle: data }))} />;
      case 5:
        return <ReviewStep data={intakeData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Progress Header */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Health Intake Form</h1>
          
          {/* Desktop Progress */}
          <div className="hidden md:flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-600 text-white' :
                      isActive ? 'bg-blue-600 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <div className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Progress */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 min-h-96">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="p-6 border-t flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Check className="h-4 w-4" />
              <span>Submit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Step Components
function DemographicsStep({ data, onChange }: { data: IntakeData['demographics']; onChange: (data: IntakeData['demographics']) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => onChange({ ...data, dateOfBirth: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={data.gender}
              onChange={(e) => onChange({ ...data, gender: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Full address including city, state, and ZIP code"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
        <input
          type="text"
          value={data.emergencyContact}
          onChange={(e) => onChange({ ...data, emergencyContact: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Name and phone number"
        />
      </div>
    </div>
  );
}

function MedicalHistoryStep({ data, onChange }: { data: string[]; onChange: (data: string[]) => void }) {
  const commonConditions = [
    'Hypertension', 'Diabetes', 'Heart Disease', 'Asthma', 'Arthritis',
    'High Cholesterol', 'Depression', 'Anxiety', 'Thyroid Disease', 'Cancer'
  ];

  const toggleCondition = (condition: string) => {
    if (data.includes(condition)) {
      onChange(data.filter(c => c !== condition));
    } else {
      onChange([...data, condition]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
        <p className="text-gray-600 mb-6">Select any conditions you have been diagnosed with:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {commonConditions.map(condition => (
            <button
              key={condition}
              onClick={() => toggleCondition(condition)}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                data.includes(condition)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{condition}</span>
                {data.includes(condition) && <Check className="h-5 w-5 text-blue-600" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MedicationsStep({ data, onChange }: { data: string[]; onChange: (data: string[]) => void }) {
  const [newMedication, setNewMedication] = useState('');

  const addMedication = () => {
    if (newMedication.trim()) {
      onChange([...data, newMedication.trim()]);
      setNewMedication('');
    }
  };

  const removeMedication = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
        <p className="text-gray-600 mb-6">List all medications you are currently taking:</p>
        
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addMedication()}
            placeholder="e.g., Lisinopril 10mg daily"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addMedication}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {data.length > 0 && (
          <div className="space-y-2">
            {data.map((medication, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>{medication}</span>
                <button
                  onClick={() => removeMedication(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AllergiesStep({ data, onChange }: { data: string[]; onChange: (data: string[]) => void }) {
  const commonAllergies = [
    'Penicillin', 'Sulfa drugs', 'Aspirin', 'Ibuprofen', 'Shellfish',
    'Nuts', 'Eggs', 'Milk', 'Latex', 'Pollen'
  ];

  const [customAllergy, setCustomAllergy] = useState('');

  const toggleAllergy = (allergy: string) => {
    if (data.includes(allergy)) {
      onChange(data.filter(a => a !== allergy));
    } else {
      onChange([...data, allergy]);
    }
  };

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !data.includes(customAllergy.trim())) {
      onChange([...data, customAllergy.trim()]);
      setCustomAllergy('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Known Allergies</h3>
        <p className="text-gray-600 mb-6">Select any allergies you have:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {commonAllergies.map(allergy => (
            <button
              key={allergy}
              onClick={() => toggleAllergy(allergy)}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                data.includes(allergy)
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{allergy}</span>
                {data.includes(allergy) && <Check className="h-5 w-5 text-red-600" />}
              </div>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Other allergies:</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={customAllergy}
              onChange={(e) => setCustomAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
              placeholder="Enter custom allergy"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={addCustomAllergy}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LifestyleStep({ data, onChange }: { data: IntakeData['lifestyle']; onChange: (data: IntakeData['lifestyle']) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lifestyle Information</h3>
        <p className="text-gray-600 mb-6">Tell us about your health habits:</p>
        
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Cigarette className="h-6 w-6 text-gray-700" />
              <h4 className="text-lg font-medium text-gray-900">Smoking</h4>
            </div>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!data.smoking}
                  onChange={() => onChange({ ...data, smoking: false })}
                  className="mr-2"
                />
                <span>No</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={data.smoking}
                  onChange={() => onChange({ ...data, smoking: true })}
                  className="mr-2"
                />
                <span>Yes</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Wine className="h-6 w-6 text-gray-700" />
              <h4 className="text-lg font-medium text-gray-900">Alcohol Consumption</h4>
            </div>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!data.alcohol}
                  onChange={() => onChange({ ...data, alcohol: false })}
                  className="mr-2"
                />
                <span>No</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={data.alcohol}
                  onChange={() => onChange({ ...data, alcohol: true })}
                  className="mr-2"
                />
                <span>Yes</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Dumbbell className="h-6 w-6 text-gray-700" />
              <h4 className="text-lg font-medium text-gray-900">Exercise Level</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['None', 'Light', 'Moderate', 'Heavy'].map(level => (
                <label key={level} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-white">
                  <input
                    type="radio"
                    checked={data.exercise === level}
                    onChange={() => onChange({ ...data, exercise: level })}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{level}</div>
                    <div className="text-sm text-gray-500">
                      {level === 'None' && 'No regular exercise'}
                      {level === 'Light' && '1-2 days per week'}
                      {level === 'Moderate' && '3-4 days per week'}
                      {level === 'Heavy' && '5+ days per week'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewStep({ data }: { data: IntakeData }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Information</h3>
        <p className="text-gray-600 mb-6">Please review your information before submitting:</p>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Demographics</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Date of Birth: {data.demographics.dateOfBirth}</p>
              <p>Gender: {data.demographics.gender}</p>
              <p>Address: {data.demographics.address}</p>
              <p>Emergency Contact: {data.demographics.emergencyContact}</p>
            </div>
          </div>

          {data.medicalHistory.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Medical History</h4>
              <div className="text-sm text-gray-600">
                {data.medicalHistory.join(', ')}
              </div>
            </div>
          )}

          {data.medications.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Current Medications</h4>
              <div className="text-sm text-gray-600">
                {data.medications.join(', ')}
              </div>
            </div>
          )}

          {data.allergies.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Allergies</h4>
              <div className="text-sm text-gray-600">
                {data.allergies.join(', ')}
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Lifestyle</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Smoking: {data.lifestyle.smoking ? 'Yes' : 'No'}</p>
              <p>Alcohol: {data.lifestyle.alcohol ? 'Yes' : 'No'}</p>
              <p>Exercise: {data.lifestyle.exercise}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}