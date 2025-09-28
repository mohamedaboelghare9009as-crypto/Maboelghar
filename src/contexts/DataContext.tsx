import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  emergencyContact: string;
  allergies: string[];
  medications: string[];
  medicalHistory: string[];
  lifestyle: {
    smoking: boolean;
    alcohol: boolean;
    exercise: string;
  };
  aiSummary?: string;
  labResults: LabResult[];
  appointments: Appointment[];
  medicationAdherence: MedicationAdherence[];
}

export interface LabResult {
  id: string;
  patientId: string;
  fileName: string;
  uploadDate: string;
  aiSummary: string;
  imageUrl?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface MedicationAdherence {
  id: string;
  patientId: string;
  medication: string;
  date: string;
  taken: boolean;
  snoozed: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  phone: string;
}

interface DataContextType {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  addLabResult: (labResult: Omit<LabResult, 'id'>) => void;
  updateMedicationAdherence: (patientId: string, medication: string, date: string, taken: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'patient@demo.com',
    phone: '+1234567890',
    dateOfBirth: '1985-06-15',
    gender: 'Male',
    address: '123 Main St, City, State 12345',
    emergencyContact: 'Jane Smith - +1234567891',
    allergies: ['Penicillin', 'Shellfish'],
    medications: ['Lisinopril 10mg', 'Metformin 500mg'],
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    lifestyle: {
      smoking: false,
      alcohol: true,
      exercise: 'Moderate'
    },
    aiSummary: 'Patient with well-controlled hypertension and diabetes. Good medication adherence. Regular exercise routine recommended.',
    labResults: [],
    appointments: [],
    medicationAdherence: []
  }
];

const mockDoctors: Doctor[] = [
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    email: 'doctor@demo.com',
    specialization: 'Internal Medicine',
    phone: '+1234567892'
  },
  {
    id: '3',
    name: 'Dr. Michael Chen',
    email: 'doctor2@demo.com',
    specialization: 'Cardiology',
    phone: '+1234567893'
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const addPatient = (patientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      labResults: [],
      appointments: [],
      medicationAdherence: []
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const addLabResult = (labResultData: Omit<LabResult, 'id'>) => {
    const newLabResult: LabResult = {
      ...labResultData,
      id: Date.now().toString()
    };
    
    setPatients(prev => prev.map(p => 
      p.id === labResultData.patientId 
        ? { ...p, labResults: [...p.labResults, newLabResult] }
        : p
    ));
  };

  const updateMedicationAdherence = (patientId: string, medication: string, date: string, taken: boolean) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const existingIndex = p.medicationAdherence.findIndex(
          m => m.medication === medication && m.date === date
        );
        
        const adherenceRecord: MedicationAdherence = {
          id: existingIndex >= 0 ? p.medicationAdherence[existingIndex].id : Date.now().toString(),
          patientId,
          medication,
          date,
          taken,
          snoozed: false
        };
        
        if (existingIndex >= 0) {
          const updatedAdherence = [...p.medicationAdherence];
          updatedAdherence[existingIndex] = adherenceRecord;
          return { ...p, medicationAdherence: updatedAdherence };
        } else {
          return { ...p, medicationAdherence: [...p.medicationAdherence, adherenceRecord] };
        }
      }
      return p;
    }));
  };

  return (
    <DataContext.Provider value={{
      patients,
      doctors,
      appointments,
      addPatient,
      updatePatient,
      addAppointment,
      updateAppointment,
      addLabResult,
      updateMedicationAdherence
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}