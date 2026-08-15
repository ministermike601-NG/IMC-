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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      registrations: {
        Row: {
        
          auth_user_id: string | null
          additional_comments: string | null
          age_range: string | null
          agree_updates: boolean
          attendance_day: string | null
          attendance_status: string
          checked_in_at: string | null
          church_name: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          full_name: string
          gender: string | null
          heard_about_us: string | null
          id: string
          info_accurate: boolean
          is_new_member: boolean | null
          membership_status: string | null
          occupation: string | null
          pastor_name: string | null
          phone: string
          prayer_request: string | null
          state: string | null
          whatsapp: string | null
          
        }
        Insert: {
          auth_user_id?: string | null
          additional_comments?: string | null
          age_range?: string | null
          agree_updates?: boolean
          attendance_day?: string | null
          attendance_status?: string
          checked_in_at?: string | null
          church_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          full_name: string
          gender?: string | null
          heard_about_us?: string | null
          id?: string
          info_accurate?: boolean
          is_new_member?: boolean | null
          membership_status?: string | null
          occupation?: string | null
          pastor_name?: string | null
          phone: string
          prayer_request?: string | null
          state?: string | null
          whatsapp?: string | null
        }
        Update: {
          auth_user_id?: string | null
          additional_comments?: string | null
          age_range?: string | null
          agree_updates?: boolean
          attendance_day?: string | null
          attendance_status?: string
          checked_in_at?: string | null
          church_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          full_name?: string
          gender?: string | null
          heard_about_us?: string | null
          id?: string
          info_accurate?: boolean
          is_new_member?: boolean | null
          membership_status?: string | null
          occupation?: string | null
          pastor_name?: string | null
          phone?: string
          prayer_request?: string | null
          state?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      imc_tests: {
  Row: {
    id: string
    class_number: number
    title: string
    is_available: boolean
    max_score: number | null
  }
  Insert: {
    id?: string
    class_number: number
    title: string
    is_available?: boolean
    max_score?: number | null
  }
  Update: {
    id?: string
    class_number?: number
    title?: string
    is_available?: boolean
    max_score?: number | null
  }
  Relationships: []
}

imc_test_submissions: {
  Row: {
    id: string
    test_id: string
    registration_id: string
    status: string
    submitted_at: string
    marked_at: string | null
    marker_name: string | null
    total_score: number | null
    max_score: number | null
    percentage: number | null
    grade: string | null
    feedback: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    test_id: string
    registration_id: string
    status?: string
    submitted_at?: string
    marked_at?: string | null
    marker_name?: string | null
    total_score?: number | null
    max_score?: number | null
    percentage?: number | null
    grade?: string | null
    feedback?: string | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    test_id?: string
    registration_id?: string
    status?: string
    submitted_at?: string
    marked_at?: string | null
    marker_name?: string | null
    total_score?: number | null
    max_score?: number | null
    percentage?: number | null
    grade?: string | null
    feedback?: string | null
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "imc_test_submissions_registration_id_fkey"
      columns: ["registration_id"]
      isOneToOne: false
      referencedRelation: "registrations"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "imc_test_submissions_test_id_fkey"
      columns: ["test_id"]
      isOneToOne: false
      referencedRelation: "imc_tests"
      referencedColumns: ["id"]
    }
  ]
}

imc_submission_pages: {
  Row: {
    id: string
    submission_id: string
    page_number: number
    storage_path: string
    original_file_name: string
    created_at: string
  }
  Insert: {
    id?: string
    submission_id: string
    page_number: number
    storage_path: string
    original_file_name: string
    created_at?: string
  }
  Update: {
    id?: string
    submission_id?: string
    page_number?: number
    storage_path?: string
    original_file_name?: string
    created_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "imc_submission_pages_submission_id_fkey"
      columns: ["submission_id"]
      isOneToOne: false
      referencedRelation: "imc_test_submissions"
      referencedColumns: ["id"]
    }
  ]
}
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
