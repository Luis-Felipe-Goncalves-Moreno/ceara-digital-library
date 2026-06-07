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
      autores: {
        Row: {
          cpf: string | null
          created_at: string
          data_nascimento: string | null
          email: string | null
          id: string
          nacionalidade: string | null
          nome: string
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          id?: string
          nacionalidade?: string | null
          nome: string
        }
        Update: {
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          id?: string
          nacionalidade?: string | null
          nome?: string
        }
        Relationships: []
      }
      editoras: {
        Row: {
          cidade: string | null
          cnpj: string | null
          created_at: string
          id: string
          nome: string
          pais: string | null
        }
        Insert: {
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          id?: string
          nome: string
          pais?: string | null
        }
        Update: {
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          id?: string
          nome?: string
          pais?: string | null
        }
        Relationships: []
      }
      emprestimos: {
        Row: {
          created_at: string
          data_devolucao: string | null
          data_emprestimo: string
          data_estimada: string
          id: string
          livro_id: string
          observacoes: string | null
          status: Database["public"]["Enums"]["status_emprestimo"]
          updated_at: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          data_devolucao?: string | null
          data_emprestimo?: string
          data_estimada?: string
          id?: string
          livro_id: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_emprestimo"]
          updated_at?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          data_devolucao?: string | null
          data_emprestimo?: string
          data_estimada?: string
          id?: string
          livro_id?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_emprestimo"]
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emprestimos_livro_id_fkey"
            columns: ["livro_id"]
            isOneToOne: false
            referencedRelation: "livros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emprestimos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      livros: {
        Row: {
          ano: number | null
          capa_url: string | null
          categoria: string | null
          created_at: string
          editora_id: string | null
          id: string
          isbn: string
          nome: string
          paginas: number | null
          quantidade_disponivel: number
          quantidade_total: number
          sinopse: string | null
          subtitulo: string | null
          updated_at: string
        }
        Insert: {
          ano?: number | null
          capa_url?: string | null
          categoria?: string | null
          created_at?: string
          editora_id?: string | null
          id?: string
          isbn: string
          nome: string
          paginas?: number | null
          quantidade_disponivel?: number
          quantidade_total?: number
          sinopse?: string | null
          subtitulo?: string | null
          updated_at?: string
        }
        Update: {
          ano?: number | null
          capa_url?: string | null
          categoria?: string | null
          created_at?: string
          editora_id?: string | null
          id?: string
          isbn?: string
          nome?: string
          paginas?: number | null
          quantidade_disponivel?: number
          quantidade_total?: number
          sinopse?: string | null
          subtitulo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "livros_editora_id_fkey"
            columns: ["editora_id"]
            isOneToOne: false
            referencedRelation: "editoras"
            referencedColumns: ["id"]
          },
        ]
      }
      livros_autores: {
        Row: {
          autor_id: string
          livro_id: string
        }
        Insert: {
          autor_id: string
          livro_id: string
        }
        Update: {
          autor_id?: string
          livro_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "livros_autores_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "autores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "livros_autores_livro_id_fkey"
            columns: ["livro_id"]
            isOneToOne: false
            referencedRelation: "livros"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          matricula: string | null
          nome: string
          turma: Database["public"]["Enums"]["turma"] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          matricula?: string | null
          nome: string
          turma?: Database["public"]["Enums"]["turma"] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          matricula?: string | null
          nome?: string
          turma?: Database["public"]["Enums"]["turma"] | null
          updated_at?: string
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
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "bibliotecario" | "professor" | "estudante"
      status_emprestimo: "em_dia" | "atrasado" | "devolvido" | "renovado"
      turma:
        | "1 Informática"
        | "2 Informática"
        | "3 Informática"
        | "1 Administração"
        | "3 Administração"
        | "2 Finanças"
        | "1 Meio-Ambiente"
        | "2 Meio-Ambiente"
        | "3 Meio-Ambiente"
        | "1 Edificações"
        | "3 Edificações"
        | "2 Redes"
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
      app_role: ["admin", "bibliotecario", "professor", "estudante"],
      status_emprestimo: ["em_dia", "atrasado", "devolvido", "renovado"],
      turma: [
        "1 Informática",
        "2 Informática",
        "3 Informática",
        "1 Administração",
        "3 Administração",
        "2 Finanças",
        "1 Meio-Ambiente",
        "2 Meio-Ambiente",
        "3 Meio-Ambiente",
        "1 Edificações",
        "3 Edificações",
        "2 Redes",
      ],
    },
  },
} as const
