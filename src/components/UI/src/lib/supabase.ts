import { createClient } from '@supabase/supabase-js';

// Types
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  doctor?: Doctor;
}

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Supabase Key:', supabaseAnonKey ? 'Found' : 'Missing');

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Services
export const appointmentService = {
  async getPatientAppointments(patientId: string) {
    if (!supabase) {
      console.log('No supabase client, returning empty array');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, doctors(*)')
        .eq('patient_id', patientId);

      if (error) {
        console.error('Error fetching appointments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching appointments:', error);
      return [];
    }
  },

  async createAppointment(appointment: any) {
    if (!supabase) {
      throw new Error('Database not available');
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select('*, doctors(*)')
      .single();

    if (error) {
      console.error('Insert error:', error);
      throw error;
    }

    return data;
  },

  async updateAppointment(id: string, updates: any) {
    if (!supabase) {
      throw new Error('Database not available');
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select('*, doctors(*)')
      .single();

    if (error) {
      console.error('Update error:', error);
      throw error;
    }

    return data;
  }
};

export const doctorService = {
  async getAllDoctors() {
    if (!supabase) {
      console.log('No supabase client, returning mock doctors');
      return [
        {
          id: 'doc1',
          name: 'Dr. Sarah Johnson',
          specialization: 'Internal Medicine',
          email: 'sarah@hospital.com',
          is_available: true
        },
        {
          id: 'doc2',
          name: 'Dr. Michael Chen',
          specialization: 'Cardiology',
          email: 'michael@hospital.com',
          is_available: true
        }
      ];
    }

    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_available', true);

      if (error) {
        console.error('Error fetching doctors:', error);
        return [];
      }

      console.log('Doctors fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Exception fetching doctors:', error);
      return [];
    }
  }
};