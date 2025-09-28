import { createClient } from '@supabase/supabase-js';

// Basic types
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email?: string;
  phone?: string;
  bio?: string;
  is_available?: boolean;
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
  created_at?: string;
  updated_at?: string;
  doctor?: Doctor;
}

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database service functions
export const appointmentService = {
  async getPatientAppointments(patientId: string) {
    if (!supabase) {
      console.warn('Supabase not available, using mock data');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctor:doctors(*)
        `)
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  },

  async createAppointment(appointment: {
    patient_id: string;
    doctor_id: string;
    appointment_date: string;
    appointment_time: string;
    reason?: string;
  }) {
    if (!supabase) {
      throw new Error('Database not available');
    }

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

  async updateAppointment(id: string, updates: Partial<Appointment>) {
    if (!supabase) {
      throw new Error('Database not available');
    }

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
  }
};

export const doctorService = {
  async getAllDoctors() {
    if (!supabase) {
      console.warn('Supabase not available, using mock data');
      return [
        {
          id: 'doc1',
          name: 'Dr. John Smith',
          specialization: 'General Practice',
          email: 'john.smith@hospital.com'
        },
        {
          id: 'doc2',
          name: 'Dr. Sarah Johnson',
          specialization: 'Cardiology',
          email: 'sarah.johnson@hospital.com'
        }
      ];
    }

    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_available', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Return mock data if database fails
      return [
        {
          id: 'doc1',
          name: 'Dr. John Smith',
          specialization: 'General Practice',
          email: 'john.smith@hospital.com'
        }
      ];
    }
  }
};