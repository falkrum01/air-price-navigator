export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          created_at: string
          user_id: string
          origin: string
          destination: string
          departure_date: string
          return_date: string | null
          airline: string
          flight_number: string
          price: number
          payment_method: string
          transaction_id: string
          booking_status: string
          cabin_class: string | null
          passenger_count: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          origin: string
          destination: string
          departure_date: string
          return_date?: string | null
          airline: string
          flight_number: string
          price: number
          payment_method: string
          transaction_id: string
          booking_status?: string
          cabin_class?: string | null
          passenger_count?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          origin?: string
          destination?: string
          departure_date?: string
          return_date?: string | null
          airline?: string
          flight_number?: string
          price?: number
          payment_method?: string
          transaction_id?: string
          booking_status?: string
          cabin_class?: string | null
          passenger_count?: number | null
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}