export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      banners: {
        Row: {
          avg_reward: string | null
          claim_link: string | null
          created_at: string | null
          id: string
          image: string | null
          project_ids: string[] | null
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          avg_reward?: string | null
          claim_link?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          project_ids?: string[] | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          avg_reward?: string | null
          claim_link?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          project_ids?: string[] | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string | null
          id: string
          joined_at: string
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          id?: string
          joined_at?: string
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          id?: string
          joined_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_anonymous: boolean | null
          name: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_anonymous?: boolean | null
          name?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_anonymous?: boolean | null
          name?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_projects: {
        Row: {
          created_at: string
          description: string | null
          funding: string | null
          id: string
          join_url: string | null
          logo: string | null
          name: string
          order_index: number | null
          reward: string | null
          tags: string[] | null
          tge: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          funding?: string | null
          id?: string
          join_url?: string | null
          logo?: string | null
          name: string
          order_index?: number | null
          reward?: string | null
          tags?: string[] | null
          tge?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          funding?: string | null
          id?: string
          join_url?: string | null
          logo?: string | null
          name?: string
          order_index?: number | null
          reward?: string | null
          tags?: string[] | null
          tge?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          is_anonymous: boolean | null
          message_type: string | null
          project_data: Json | null
          user_id: string | null
          username: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          message_type?: string | null
          project_data?: Json | null
          user_id?: string | null
          username: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          message_type?: string | null
          project_data?: Json | null
          user_id?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          description: string | null
          expected_return: number | null
          id: string
          is_profile_public: boolean | null
          level: number | null
          name: string | null
          password_hash: string
          profile_picture: string | null
          role: string | null
          show_earnings: boolean | null
          show_investments: boolean | null
          social_discord: string | null
          social_telegram: string | null
          social_x: string | null
          total_earnings: number | null
          total_investment: number | null
          updated_at: string
          username: string
          xp: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          expected_return?: number | null
          id?: string
          is_profile_public?: boolean | null
          level?: number | null
          name?: string | null
          password_hash: string
          profile_picture?: string | null
          role?: string | null
          show_earnings?: boolean | null
          show_investments?: boolean | null
          social_discord?: string | null
          social_telegram?: string | null
          social_x?: string | null
          total_earnings?: number | null
          total_investment?: number | null
          updated_at?: string
          username: string
          xp?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          expected_return?: number | null
          id?: string
          is_profile_public?: boolean | null
          level?: number | null
          name?: string | null
          password_hash?: string
          profile_picture?: string | null
          role?: string | null
          show_earnings?: boolean | null
          show_investments?: boolean | null
          social_discord?: string | null
          social_telegram?: string | null
          social_x?: string | null
          total_earnings?: number | null
          total_investment?: number | null
          updated_at?: string
          username?: string
          xp?: number | null
        }
        Relationships: []
      }
      updates: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          image: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_data: {
        Row: {
          created_at: string
          explore_data: Json | null
          id: string
          projects_data: Json | null
          todos_data: Json | null
          transactions_data: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          explore_data?: Json | null
          id?: string
          projects_data?: Json | null
          todos_data?: Json | null
          transactions_data?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          explore_data?: Json | null
          id?: string
          projects_data?: Json | null
          todos_data?: Json | null
          transactions_data?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_project_shares: {
        Row: {
          id: string
          share_count: number | null
          shared_date: string
          user_id: string | null
        }
        Insert: {
          id?: string
          share_count?: number | null
          shared_date?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          share_count?: number | null
          shared_date?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_project_shares_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_projects: {
        Row: {
          created_at: string
          earned_amount: number | null
          expected_amount: number | null
          id: string
          invested_amount: number | null
          is_testnet: boolean | null
          logo: string | null
          name: string
          note: string | null
          points: number | null
          type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          earned_amount?: number | null
          expected_amount?: number | null
          id?: string
          invested_amount?: number | null
          is_testnet?: boolean | null
          logo?: string | null
          name: string
          note?: string | null
          points?: number | null
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          earned_amount?: number | null
          expected_amount?: number | null
          id?: string
          invested_amount?: number | null
          is_testnet?: boolean | null
          logo?: string | null
          name?: string
          note?: string | null
          points?: number | null
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_todos: {
        Row: {
          completed: boolean | null
          created_at: string
          id: string
          project_id: string | null
          text: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          id?: string
          project_id?: string | null
          text: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          id?: string
          project_id?: string | null
          text?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_todos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_todos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          project_id: string | null
          project_logo: string | null
          project_name: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          project_id?: string | null
          project_logo?: string | null
          project_name: string
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          project_id?: string | null
          project_logo?: string | null
          project_name?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_level: {
        Args: { total_xp: number }
        Returns: number
      }
      sync_user_totals: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      update_user_xp: {
        Args: { p_user_id: string; p_xp_gain: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
