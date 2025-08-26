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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      batches: {
        Row: {
          batch_code: string
          expiry_date: string | null
          id: string
          manufacture_date: string | null
          notes: string | null
          product_id: string | null
          quantity_produced: number | null
        }
        Insert: {
          batch_code: string
          expiry_date?: string | null
          id?: string
          manufacture_date?: string | null
          notes?: string | null
          product_id?: string | null
          quantity_produced?: number | null
        }
        Update: {
          batch_code?: string
          expiry_date?: string | null
          id?: string
          manufacture_date?: string | null
          notes?: string | null
          product_id?: string | null
          quantity_produced?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_oil_blends: {
        Row: {
          base_oils: Json
          blend_name: string
          boost_ingredients: string[] | null
          bottle_size: string
          created_at: string
          custom_scent: string | null
          id: string
          is_saved: boolean | null
          scent: string | null
          total_price: number | null
          user_id: string | null
        }
        Insert: {
          base_oils: Json
          blend_name: string
          boost_ingredients?: string[] | null
          bottle_size: string
          created_at?: string
          custom_scent?: string | null
          id?: string
          is_saved?: boolean | null
          scent?: string | null
          total_price?: number | null
          user_id?: string | null
        }
        Update: {
          base_oils?: Json
          blend_name?: string
          boost_ingredients?: string[] | null
          bottle_size?: string
          created_at?: string
          custom_scent?: string | null
          id?: string
          is_saved?: boolean | null
          scent?: string | null
          total_price?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          created_at: string | null
          id: string
          movement_type: string | null
          product_id: string | null
          quantity: number
          reference: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          movement_type?: string | null
          product_id?: string | null
          quantity: number
          reference?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          movement_type?: string | null
          product_id?: string | null
          quantity?: number
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string | null
          billing_address: Json | null
          confirmed_at: string | null
          created_at: string
          currency: string | null
          customer_location: string | null
          delivered_at: string | null
          delivery_method: string | null
          delivery_notes: string | null
          email: string
          estimated_delivery: string | null
          first_name: string
          id: string
          items: Json
          last_name: string
          order_number: string
          order_type: string
          payment_method: string | null
          payment_status: string
          phone: string | null
          shipped_at: string | null
          shipping_address: Json
          shipping_cost: number | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          billing_address?: Json | null
          confirmed_at?: string | null
          created_at?: string
          currency?: string | null
          customer_location?: string | null
          delivered_at?: string | null
          delivery_method?: string | null
          delivery_notes?: string | null
          email: string
          estimated_delivery?: string | null
          first_name: string
          id?: string
          items: Json
          last_name: string
          order_number?: string
          order_type: string
          payment_method?: string | null
          payment_status?: string
          phone?: string | null
          shipped_at?: string | null
          shipping_address: Json
          shipping_cost?: number | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          billing_address?: Json | null
          confirmed_at?: string | null
          created_at?: string
          currency?: string | null
          customer_location?: string | null
          delivered_at?: string | null
          delivery_method?: string | null
          delivery_notes?: string | null
          email?: string
          estimated_delivery?: string | null
          first_name?: string
          id?: string
          items?: Json
          last_name?: string
          order_number?: string
          order_type?: string
          payment_method?: string | null
          payment_status?: string
          phone?: string | null
          shipped_at?: string | null
          shipping_address?: Json
          shipping_cost?: number | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_details: {
        Row: {
          id: string
          ingredients: string | null
          packaging_color: string | null
          packaging_material: string | null
          product_id: string | null
          scent: string | null
          shelf_life_months: number | null
          size_ml: number | null
          storage_instructions: string | null
          texture: string | null
          usage_instructions: string | null
          warnings: string | null
        }
        Insert: {
          id?: string
          ingredients?: string | null
          packaging_color?: string | null
          packaging_material?: string | null
          product_id?: string | null
          scent?: string | null
          shelf_life_months?: number | null
          size_ml?: number | null
          storage_instructions?: string | null
          texture?: string | null
          usage_instructions?: string | null
          warnings?: string | null
        }
        Update: {
          id?: string
          ingredients?: string | null
          packaging_color?: string | null
          packaging_material?: string | null
          product_id?: string | null
          scent?: string | null
          shelf_life_months?: number | null
          size_ml?: number | null
          storage_instructions?: string | null
          texture?: string | null
          usage_instructions?: string | null
          warnings?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_details_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_media: {
        Row: {
          alt_text: string | null
          id: string
          media_type: string | null
          media_url: string
          product_id: string | null
        }
        Insert: {
          alt_text?: string | null
          id?: string
          media_type?: string | null
          media_url: string
          product_id?: string | null
        }
        Update: {
          alt_text?: string | null
          id?: string
          media_type?: string | null
          media_url?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          inventory_quantity: number
          is_active: boolean | null
          name: string
          price: number | null
          skin_goals: string[] | null
          skin_types: string[] | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          inventory_quantity?: number
          is_active?: boolean | null
          name: string
          price?: number | null
          skin_goals?: string[] | null
          skin_types?: string[] | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          inventory_quantity?: number
          is_active?: boolean | null
          name?: string
          price?: number | null
          skin_goals?: string[] | null
          skin_types?: string[] | null
        }
        Relationships: []
      }
      quiz_recommendations: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          quiz_response_id: string | null
          reasoning: string | null
          step_name: string
          step_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          quiz_response_id?: string | null
          reasoning?: string | null
          step_name: string
          step_order: number
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          quiz_response_id?: string | null
          reasoning?: string | null
          step_name?: string
          step_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_recommendations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_recommendations_quiz_response_id_fkey"
            columns: ["quiz_response_id"]
            isOneToOne: false
            referencedRelation: "quiz_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_responses: {
        Row: {
          active_ingredients: string[] | null
          age_range: string | null
          allergies: string[] | null
          cleansing_feeling: string | null
          combination_areas: string | null
          created_at: string
          email: string | null
          id: string
          location: string | null
          product_preference: string | null
          routine_preference: string | null
          skin_concerns: string[] | null
          skin_type: string[] | null
          skincare_frequency: string | null
          skincare_goals: string[] | null
          sun_exposure: string | null
          user_id: string
        }
        Insert: {
          active_ingredients?: string[] | null
          age_range?: string | null
          allergies?: string[] | null
          cleansing_feeling?: string | null
          combination_areas?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          product_preference?: string | null
          routine_preference?: string | null
          skin_concerns?: string[] | null
          skin_type?: string[] | null
          skincare_frequency?: string | null
          skincare_goals?: string[] | null
          sun_exposure?: string | null
          user_id: string
        }
        Update: {
          active_ingredients?: string[] | null
          age_range?: string | null
          allergies?: string[] | null
          cleansing_feeling?: string | null
          combination_areas?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          product_preference?: string | null
          routine_preference?: string | null
          skin_concerns?: string[] | null
          skin_type?: string[] | null
          skincare_frequency?: string | null
          skincare_goals?: string[] | null
          sun_exposure?: string | null
          user_id?: string
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
