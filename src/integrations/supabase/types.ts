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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          avg_heart_rate: number | null
          calories: number | null
          created_at: string
          distance_km: number | null
          duration_minutes: number
          ended_at: string | null
          external_id: string | null
          id: string
          metadata: Json
          notes: string | null
          source: Database["public"]["Enums"]["activity_source"]
          started_at: string
          steps: number | null
          type: Database["public"]["Enums"]["activity_type"]
          updated_at: string
          user_id: string
          verified: boolean
        }
        Insert: {
          avg_heart_rate?: number | null
          calories?: number | null
          created_at?: string
          distance_km?: number | null
          duration_minutes?: number
          ended_at?: string | null
          external_id?: string | null
          id?: string
          metadata?: Json
          notes?: string | null
          source: Database["public"]["Enums"]["activity_source"]
          started_at: string
          steps?: number | null
          type: Database["public"]["Enums"]["activity_type"]
          updated_at?: string
          user_id: string
          verified?: boolean
        }
        Update: {
          avg_heart_rate?: number | null
          calories?: number | null
          created_at?: string
          distance_km?: number | null
          duration_minutes?: number
          ended_at?: string | null
          external_id?: string | null
          id?: string
          metadata?: Json
          notes?: string | null
          source?: Database["public"]["Enums"]["activity_source"]
          started_at?: string
          steps?: number | null
          type?: Database["public"]["Enums"]["activity_type"]
          updated_at?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_conversations: {
        Row: {
          current_page: string | null
          ended_at: string | null
          escalated: boolean | null
          id: string
          message_count: number | null
          metadata: Json | null
          session_id: string
          started_at: string | null
          user_id: string | null
        }
        Insert: {
          current_page?: string | null
          ended_at?: string | null
          escalated?: boolean | null
          id?: string
          message_count?: number | null
          metadata?: Json | null
          session_id: string
          started_at?: string | null
          user_id?: string | null
        }
        Update: {
          current_page?: string | null
          ended_at?: string | null
          escalated?: boolean | null
          id?: string
          message_count?: number | null
          metadata?: Json | null
          session_id?: string
          started_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chatbot_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          feedback: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chatbot_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      gym_checkins: {
        Row: {
          checked_in_at: string
          checked_out_at: string | null
          club_id: string | null
          created_at: string
          distance_meters: number | null
          id: string
          latitude: number | null
          longitude: number | null
          user_id: string
          verified_location: boolean
        }
        Insert: {
          checked_in_at?: string
          checked_out_at?: string | null
          club_id?: string | null
          created_at?: string
          distance_meters?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          user_id: string
          verified_location?: boolean
        }
        Update: {
          checked_in_at?: string
          checked_out_at?: string | null
          club_id?: string | null
          created_at?: string
          distance_meters?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          user_id?: string
          verified_location?: boolean
        }
        Relationships: []
      }
      order_items: {
        Row: {
          currency: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          currency?: string
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Update: {
          currency?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          phone: string | null
          shipping_address: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          tx_hash: string | null
          updated_at: string
          user_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          phone?: string | null
          shipping_address?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount: number
          tx_hash?: string | null
          updated_at?: string
          user_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          phone?: string | null
          shipping_address?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          tx_hash?: string | null
          updated_at?: string
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors_public"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean
          name: string
          price_avax: number | null
          price_kes: number | null
          price_usdc: number | null
          stock: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          name: string
          price_avax?: number | null
          price_kes?: number | null
          price_usdc?: number | null
          stock?: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          name?: string
          price_avax?: number | null
          price_kes?: number | null
          price_usdc?: number | null
          stock?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors_public"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          fitness_goals: string[] | null
          full_name: string | null
          id: string
          is_trainer: boolean
          latitude: number | null
          longitude: number | null
          phone: string | null
          timezone: string
          trainer_experience: string | null
          trainer_rate_usdc: number | null
          trainer_specialties: string[] | null
          updated_at: string
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          fitness_goals?: string[] | null
          full_name?: string | null
          id: string
          is_trainer?: boolean
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          timezone?: string
          trainer_experience?: string | null
          trainer_rate_usdc?: number | null
          trainer_specialties?: string[] | null
          updated_at?: string
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          fitness_goals?: string[] | null
          full_name?: string | null
          id?: string
          is_trainer?: boolean
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          timezone?: string
          trainer_experience?: string | null
          trainer_rate_usdc?: number | null
          trainer_specialties?: string[] | null
          updated_at?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      streak_stats: {
        Row: {
          current_streak: number
          last_qualifying_date: string | null
          longest_streak: number
          total_sessions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          last_qualifying_date?: string | null
          longest_streak?: number
          total_sessions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          last_qualifying_date?: string | null
          longest_streak?: number
          total_sessions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          business_name: string
          certification_hash: string | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          location: string | null
          logo_url: string | null
          longitude: number | null
          onchain_verified: boolean
          phone: string | null
          status: Database["public"]["Enums"]["vendor_status"]
          updated_at: string
          user_id: string
          verified_at: string | null
          wallet_address: string | null
        }
        Insert: {
          business_name: string
          certification_hash?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          logo_url?: string | null
          longitude?: number | null
          onchain_verified?: boolean
          phone?: string | null
          status?: Database["public"]["Enums"]["vendor_status"]
          updated_at?: string
          user_id: string
          verified_at?: string | null
          wallet_address?: string | null
        }
        Update: {
          business_name?: string
          certification_hash?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          logo_url?: string | null
          longitude?: number | null
          onchain_verified?: boolean
          phone?: string | null
          status?: Database["public"]["Enums"]["vendor_status"]
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      profiles_public: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string | null
          fitness_goals: string[] | null
          full_name: string | null
          id: string | null
          is_trainer: boolean | null
          trainer_experience: string | null
          trainer_rate_usdc: number | null
          trainer_specialties: string[] | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          fitness_goals?: string[] | null
          full_name?: string | null
          id?: string | null
          is_trainer?: boolean | null
          trainer_experience?: string | null
          trainer_rate_usdc?: number | null
          trainer_specialties?: string[] | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          fitness_goals?: string[] | null
          full_name?: string | null
          id?: string | null
          is_trainer?: boolean | null
          trainer_experience?: string | null
          trainer_rate_usdc?: number | null
          trainer_specialties?: string[] | null
        }
        Relationships: []
      }
      vendors_public: {
        Row: {
          business_name: string | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string | null
          latitude: number | null
          location: string | null
          logo_url: string | null
          longitude: number | null
          onchain_verified: boolean | null
          status: Database["public"]["Enums"]["vendor_status"] | null
          verified_at: string | null
        }
        Insert: {
          business_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          latitude?: number | null
          location?: string | null
          logo_url?: string | null
          longitude?: number | null
          onchain_verified?: boolean | null
          status?: Database["public"]["Enums"]["vendor_status"] | null
          verified_at?: string | null
        }
        Update: {
          business_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          latitude?: number | null
          location?: string | null
          logo_url?: string | null
          longitude?: number | null
          onchain_verified?: boolean | null
          status?: Database["public"]["Enums"]["vendor_status"] | null
          verified_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      reset_lapsed_streaks: { Args: never; Returns: undefined }
    }
    Enums: {
      activity_source:
        | "healthkit"
        | "health_connect"
        | "manual"
        | "sensor"
        | "geofence"
      activity_type:
        | "steps"
        | "run"
        | "cycle"
        | "workout"
        | "yoga"
        | "swim"
        | "hike"
        | "strength"
        | "hiit"
        | "other"
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded"
      payment_method: "avax" | "usdc" | "mpesa"
      product_category: "gym_wear" | "equipment" | "supplements" | "accessories"
      vendor_status: "pending" | "verified" | "rejected" | "suspended"
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
      activity_source: [
        "healthkit",
        "health_connect",
        "manual",
        "sensor",
        "geofence",
      ],
      activity_type: [
        "steps",
        "run",
        "cycle",
        "workout",
        "yoga",
        "swim",
        "hike",
        "strength",
        "hiit",
        "other",
      ],
      order_status: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      payment_method: ["avax", "usdc", "mpesa"],
      product_category: ["gym_wear", "equipment", "supplements", "accessories"],
      vendor_status: ["pending", "verified", "rejected", "suspended"],
    },
  },
} as const
