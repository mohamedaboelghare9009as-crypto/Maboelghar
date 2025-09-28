import { createClient } from '@supabase/supabase-js';

// Database types
export interface Patient {
  id: string;
  email: string;
  name: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  email: string;
  name: string;
  specialization: string;
  phone?: string;
  license_number?: string;
  years_experience?: number;
  bio?: string;
  avatar_url?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  doctor?: Doctor;
  patient?: Patient;
}

export interface Database {
  public: {
    Tables: {
      patients: {
        Row: Patient;
        Insert: Omit<Patient, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Patient, 'id' | 'created_at' | 'updated_at'>>;
      };
      doctors: {
        Row: Doctor;
        Insert: Omit<Doctor, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Doctor, 'id' | 'created_at' | 'updated_at'>>;
      };
      appointments: {
        Row: Appointment;
        Insert: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Appointment, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations
export const appointmentService = {
  // Get appointments for a patient
  async getPatientAppointments(patientId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:doctors(*)
      `)
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create new appointment
  async createAppointment(appointment: {
    patient_id: string;
    doctor_id: string;
    appointment_date: string;
    appointment_time: string;
    reason?: string;
  }) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select(`
        *,
        doctor:doctors(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Update appointment
  async updateAppointment(id: string, updates: Partial<Appointment>) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        doctor:doctors(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Delete appointment
  async deleteAppointment(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const doctorService = {
  // Get all available doctors
  async getAllDoctors() {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('is_available', true)
      .order('name');

    if (error) throw error;
    return data;
  },

  // Get doctor by ID
  async getDoctorById(id: string) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
};

export const patientService = {
  // Get patient by ID
  async getPatientById(id: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update patient
  async updatePatient(id: string, updates: Partial<Patient>) {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }
};