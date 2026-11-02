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
      business_info: {
        Row: {
          address_country: string
          address_locality: string
          address_region: string
          created_at: string
          description: string
          email: string
          founder_linkedin: string
          founder_name: string
          founder_url: string
          founding_date: string
          geo_latitude: number
          geo_longitude: number
          id: string
          legal_name: string
          name: string
          opening_hours: string
          postal_code: string
          rating_value: number
          review_count: number
          service_areas: string[]
          services: string[]
          social_links: string[]
          street_address: string
          telephone: string
          updated_at: string
        }
        Insert: {
          address_country?: string
          address_locality?: string
          address_region?: string
          created_at?: string
          description?: string
          email?: string
          founder_linkedin?: string
          founder_name?: string
          founder_url?: string
          founding_date?: string
          geo_latitude?: number
          geo_longitude?: number
          id?: string
          legal_name?: string
          name?: string
          opening_hours?: string
          postal_code?: string
          rating_value?: number
          review_count?: number
          service_areas?: string[]
          services?: string[]
          social_links?: string[]
          street_address?: string
          telephone?: string
          updated_at?: string
        }
        Update: {
          address_country?: string
          address_locality?: string
          address_region?: string
          created_at?: string
          description?: string
          email?: string
          founder_linkedin?: string
          founder_name?: string
          founder_url?: string
          founding_date?: string
          geo_latitude?: number
          geo_longitude?: number
          id?: string
          legal_name?: string
          name?: string
          opening_hours?: string
          postal_code?: string
          rating_value?: number
          review_count?: number
          service_areas?: string[]
          services?: string[]
          social_links?: string[]
          street_address?: string
          telephone?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_knowledge: {
        Row: {
          content: string
          id: string
          updated_at: string
        }
        Insert: {
          content?: string
          id?: string
          updated_at?: string
        }
        Update: {
          content?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_knowledge_items: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          category: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_settings: {
        Row: {
          id: string
          instructions: string
          updated_at: string
        }
        Insert: {
          id: string
          instructions?: string
          updated_at?: string
        }
        Update: {
          id?: string
          instructions?: string
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      glossary_terms: {
        Row: {
          created_at: string
          definition: string
          id: string
          sort_order: number
          term: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          definition: string
          id?: string
          sort_order?: number
          term: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          definition?: string
          id?: string
          sort_order?: number
          term?: string
          updated_at?: string
        }
        Relationships: []
      }
      home_hero: {
        Row: {
          created_at: string
          headline_accent: string
          headline_lead: string
          headline_line1: string | null
          headline_line2: string | null
          id: string
          primary_button_label: string
          primary_button_link: string
          secondary_button_label: string
          secondary_button_link: string
          subtitle: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          headline_accent?: string
          headline_lead?: string
          headline_line1?: string | null
          headline_line2?: string | null
          id?: string
          primary_button_label?: string
          primary_button_link?: string
          secondary_button_label?: string
          secondary_button_link?: string
          subtitle?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          headline_accent?: string
          headline_lead?: string
          headline_line1?: string | null
          headline_line2?: string | null
          id?: string
          primary_button_label?: string
          primary_button_link?: string
          secondary_button_label?: string
          secondary_button_link?: string
          subtitle?: string
          updated_at?: string
        }
        Relationships: []
      }
      home_services: {
        Row: {
          created_at: string
          cta_link: string
          icon: string
          id: string
          image_url: string
          modal_description: string
          modal_title: string
          sort_order: number
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_link?: string
          icon?: string
          id?: string
          image_url?: string
          modal_description?: string
          modal_title?: string
          sort_order?: number
          summary?: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_link?: string
          icon?: string
          id?: string
          image_url?: string
          modal_description?: string
          modal_title?: string
          sort_order?: number
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      legal_pages: {
        Row: {
          content: string
          created_at: string
          id: string
          page_slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          page_slug: string
          title?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          page_slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_meta: {
        Row: {
          created_at: string
          description: string
          id: string
          og_image: string | null
          page_slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          og_image?: string | null
          page_slug: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          og_image?: string | null
          page_slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_settings: {
        Row: {
          created_at: string
          form_embed_code: string | null
          form_script_url: string | null
          id: string
          page_name: string
          page_slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          form_embed_code?: string | null
          form_script_url?: string | null
          id?: string
          page_name: string
          page_slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          form_embed_code?: string | null
          form_script_url?: string | null
          id?: string
          page_name?: string
          page_slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_widgets: {
        Row: {
          chat_widget_code: string
          created_at: string
          enabled: boolean
          id: string
          updated_at: string
        }
        Insert: {
          chat_widget_code?: string
          created_at?: string
          enabled?: boolean
          id?: string
          updated_at?: string
        }
        Update: {
          chat_widget_code?: string
          created_at?: string
          enabled?: boolean
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          href: string
          icon: string
          id: string
          label: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          href: string
          icon: string
          id?: string
          label: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          href?: string
          icon?: string
          id?: string
          label?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      team_grid_settings: {
        Row: {
          created_at: string
          desktop_columns: number
          id: string
          mobile_columns: number
          tablet_columns: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          desktop_columns?: number
          id?: string
          mobile_columns?: number
          tablet_columns?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          desktop_columns?: number
          id?: string
          mobile_columns?: number
          tablet_columns?: number
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string
          created_at: string
          department_id: string | null
          id: string
          name: string
          photo_url: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          bio?: string
          created_at?: string
          department_id?: string | null
          id?: string
          name: string
          photo_url?: string | null
          slug: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          department_id?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          created_at: string
          headline: string | null
          id: string
          name: string
          quote: string
          rating: number
          sort_order: number
          title: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          headline?: string | null
          id?: string
          name: string
          quote: string
          rating?: number
          sort_order?: number
          title?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          headline?: string | null
          id?: string
          name?: string
          quote?: string
          rating?: number
          sort_order?: number
          title?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin"],
    },
  },
} as const
