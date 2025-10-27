export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          id: string
          is_resolved: boolean | null
          message: string
          request_id: string
          resolved_at: string | null
        }
        Insert: {
          alert_type?: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          message: string
          request_id: string
          resolved_at?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          message?: string
          request_id?: string
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "transport_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string | null
          current_location_lat: number | null
          current_location_lng: number | null
          driver_license: string
          id: string
          is_available: boolean | null
          rating: number | null
          total_trips: number | null
          updated_at: string | null
          user_id: string
          vehicle_color: string | null
          vehicle_model: string
          vehicle_plate: string
          vehicle_type: string
        }
        Insert: {
          created_at?: string | null
          current_location_lat?: number | null
          current_location_lng?: number | null
          driver_license: string
          id?: string
          is_available?: boolean | null
          rating?: number | null
          total_trips?: number | null
          updated_at?: string | null
          user_id: string
          vehicle_color?: string | null
          vehicle_model: string
          vehicle_plate: string
          vehicle_type: string
        }
        Update: {
          created_at?: string | null
          current_location_lat?: number | null
          current_location_lng?: number | null
          driver_license?: string
          id?: string
          is_available?: boolean | null
          rating?: number | null
          total_trips?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_color?: string | null
          vehicle_model?: string
          vehicle_plate?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string | null
          user_type: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
      transport_requests: {
        Row: {
          accepted_at: string | null
          alert_sent_at: string | null
          company_id: string
          completed_at: string | null
          created_at: string | null
          destinations: Json
          distance_km: number | null
          driver_id: string | null
          estimated_duration_minutes: number | null
          id: string
          notes: string | null
          num_passengers: number
          origin_address: string
          origin_lat: number
          origin_lng: number
          scheduled_time: string | null
          started_at: string | null
          status: string
          updated_at: string | null
          vehicle_type: string
        }
        Insert: {
          accepted_at?: string | null
          alert_sent_at?: string | null
          company_id: string
          completed_at?: string | null
          created_at?: string | null
          destinations: Json
          distance_km?: number | null
          driver_id?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          notes?: string | null
          num_passengers: number
          origin_address: string
          origin_lat: number
          origin_lng: number
          scheduled_time?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          vehicle_type: string
        }
        Update: {
          accepted_at?: string | null
          alert_sent_at?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string | null
          destinations?: Json
          distance_km?: number | null
          driver_id?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          notes?: string | null
          num_passengers?: number
          origin_address?: string
          origin_lat?: number
          origin_lng?: number
          scheduled_time?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          vehicle_type?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
