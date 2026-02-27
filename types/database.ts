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
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          project_type: string | null
          province: string | null
          year: number | null
          client_id: string | null
          latitude: number
          longitude: number
          images: string[] | null
          documents: string[] | null
          overlay_image: string | null
          overlay_bounds: Json | null
          status: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          project_type?: string | null
          province?: string | null
          year?: number | null
          client_id?: string | null
          latitude: number
          longitude: number
          images?: string[] | null
          documents?: string[] | null
          overlay_image?: string | null
          overlay_bounds?: Json | null
          status?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          project_type?: string | null
          province?: string | null
          year?: number | null
          client_id?: string | null
          latitude?: number
          longitude?: number
          images?: string[] | null
          documents?: string[] | null
          overlay_image?: string | null
          overlay_bounds?: Json | null
          status?: string | null
          tags?: string[] | null
        }
      }
      clients: {
        Row: {
          id: string
          created_at: string
          name: string
          logo: string | null
          description: string | null
          website: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          logo?: string | null
          description?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          logo?: string | null
          description?: string | null
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
  }
}

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']
export type Client = Database['public']['Tables']['clients']['Row']
export type ClientInsert = Database['public']['Tables']['clients']['Insert']

export interface OverlayBounds {
  topLeft: [number, number]
  topRight: [number, number]
  bottomRight: [number, number]
  bottomLeft: [number, number]
}

export interface FilterState {
  projectType: string
  province: string
  year: string
  clientId: string
  search: string
}
