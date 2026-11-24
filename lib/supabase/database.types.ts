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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      candidate_custom_skills: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          name: string
          proficiency: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          name: string
          proficiency: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          name?: string
          proficiency?: string
          updated_at?: string
        }
        Relationships: []
      }
      candidate_job_interactions: {
        Row: {
          candidate_id: string
          created_at: string
          decision: string
          id: string
          job_id: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          decision: string
          id?: string
          job_id: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          decision?: string
          id?: string
          job_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_job_interactions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_languages: {
        Row: {
          candidate_id: string
          created_at: string
          language_id: string
          proficiency: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          language_id: string
          proficiency: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          language_id?: string
          proficiency?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_languages_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "candidate_languages_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_profiles: {
        Row: {
          accepts_fully_remote: boolean | null
          created_at: string
          desired_homeoffice_days: number | null
          desired_work_latitude: number | null
          desired_work_location: string | null
          desired_work_longitude: number | null
          desired_workload_max: number | null
          desired_workload_min: number | null
          earliest_start_date: string | null
          education_status: string | null
          has_work_authorization: boolean | null
          higher_education_status: string | null
          homeoffice_preference: string | null
          nationality: string | null
          onboarding_completed: boolean
          onboarding_step: number
          preferred_homeoffice_schedule: string | null
          preferred_work_model: string | null
          region: string | null
          region_latitude: number | null
          region_longitude: number | null
          salary_max: number | null
          salary_min: number | null
          updated_at: string
          user_id: string
          willing_to_commute: boolean | null
          willing_to_relocate: boolean | null
          work_authorization_details: string | null
          work_experience_status: string | null
          work_radius_km: number | null
        }
        Insert: {
          accepts_fully_remote?: boolean | null
          created_at?: string
          desired_homeoffice_days?: number | null
          desired_work_latitude?: number | null
          desired_work_location?: string | null
          desired_work_longitude?: number | null
          desired_workload_max?: number | null
          desired_workload_min?: number | null
          earliest_start_date?: string | null
          education_status?: string | null
          has_work_authorization?: boolean | null
          higher_education_status?: string | null
          homeoffice_preference?: string | null
          nationality?: string | null
          onboarding_completed?: boolean
          onboarding_step?: number
          preferred_homeoffice_schedule?: string | null
          preferred_work_model?: string | null
          region?: string | null
          region_latitude?: number | null
          region_longitude?: number | null
          salary_max?: number | null
          salary_min?: number | null
          updated_at?: string
          user_id: string
          willing_to_commute?: boolean | null
          willing_to_relocate?: boolean | null
          work_authorization_details?: string | null
          work_experience_status?: string | null
          work_radius_km?: number | null
        }
        Update: {
          accepts_fully_remote?: boolean | null
          created_at?: string
          desired_homeoffice_days?: number | null
          desired_work_latitude?: number | null
          desired_work_location?: string | null
          desired_work_longitude?: number | null
          desired_workload_max?: number | null
          desired_workload_min?: number | null
          earliest_start_date?: string | null
          education_status?: string | null
          has_work_authorization?: boolean | null
          higher_education_status?: string | null
          homeoffice_preference?: string | null
          nationality?: string | null
          onboarding_completed?: boolean
          onboarding_step?: number
          preferred_homeoffice_schedule?: string | null
          preferred_work_model?: string | null
          region?: string | null
          region_latitude?: number | null
          region_longitude?: number | null
          salary_max?: number | null
          salary_min?: number | null
          updated_at?: string
          user_id?: string
          willing_to_commute?: boolean | null
          willing_to_relocate?: boolean | null
          work_authorization_details?: string | null
          work_experience_status?: string | null
          work_radius_km?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_skill_categories: {
        Row: {
          candidate_id: string
          category_id: string
          created_at: string
        }
        Insert: {
          candidate_id: string
          category_id: string
          created_at?: string
        }
        Update: {
          candidate_id?: string
          category_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_skill_categories_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "candidate_skill_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_skills: {
        Row: {
          candidate_id: string
          created_at: string
          proficiency: string
          skill_id: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          proficiency: string
          skill_id: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          proficiency?: string
          skill_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_skills_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "candidate_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address_city: string | null
          address_house_number: string | null
          address_postal_code: string | null
          address_street: string | null
          company_size: string | null
          contact_email: string | null
          contact_first_name: string | null
          contact_last_name: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          header_image_path: string | null
          id: string
          industry: string | null
          legal_form: string | null
          location: string | null
          location_latitude: number | null
          location_longitude: number | null
          logo_path: string | null
          name: string
          onboarding_completed: boolean
          updated_at: string
          website: string | null
        }
        Insert: {
          address_city?: string | null
          address_house_number?: string | null
          address_postal_code?: string | null
          address_street?: string | null
          company_size?: string | null
          contact_email?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          header_image_path?: string | null
          id?: string
          industry?: string | null
          legal_form?: string | null
          location?: string | null
          location_latitude?: number | null
          location_longitude?: number | null
          logo_path?: string | null
          name: string
          onboarding_completed?: boolean
          updated_at?: string
          website?: string | null
        }
        Update: {
          address_city?: string | null
          address_house_number?: string | null
          address_postal_code?: string | null
          address_street?: string | null
          company_size?: string | null
          contact_email?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          header_image_path?: string | null
          id?: string
          industry?: string | null
          legal_form?: string | null
          location?: string | null
          location_latitude?: number | null
          location_longitude?: number | null
          logo_path?: string | null
          name?: string
          onboarding_completed?: boolean
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      company_contacts: {
        Row: {
          company_id: string
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          portrait_path: string | null
          position: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          portrait_path?: string | null
          position?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          portrait_path?: string | null
          position?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_memberships: {
        Row: {
          company_id: string
          created_at: string
          id: string
          role: string
          updated_at: string
          user_id: string
          verification_status: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id: string
          verification_status?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_memberships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      education_degree_fields: {
        Row: {
          education_field_id: string
          education_type_degree_id: string
        }
        Insert: {
          education_field_id: string
          education_type_degree_id: string
        }
        Update: {
          education_field_id?: string
          education_type_degree_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_degree_fields_education_field_id_fkey"
            columns: ["education_field_id"]
            isOneToOne: false
            referencedRelation: "education_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_degree_fields_education_type_degree_id_fkey"
            columns: ["education_type_degree_id"]
            isOneToOne: false
            referencedRelation: "education_type_degrees"
            referencedColumns: ["id"]
          },
        ]
      }
      education_fields: {
        Row: {
          code: string
          country_code: string | null
          created_at: string
          field_kind: string | null
          id: string
          name_de: string
          parent_id: string | null
          source_name: string | null
          source_url: string | null
          validation_status: string | null
        }
        Insert: {
          code: string
          country_code?: string | null
          created_at?: string
          field_kind?: string | null
          id?: string
          name_de: string
          parent_id?: string | null
          source_name?: string | null
          source_url?: string | null
          validation_status?: string | null
        }
        Update: {
          code?: string
          country_code?: string | null
          created_at?: string
          field_kind?: string | null
          id?: string
          name_de?: string
          parent_id?: string | null
          source_name?: string | null
          source_url?: string | null
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_fields_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "education_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      education_institution_types: {
        Row: {
          countries: string[]
          created_at: string
          id: string
          name_de: string
          note: string | null
          sort_order: number
          typical_education_type: string | null
        }
        Insert: {
          countries?: string[]
          created_at?: string
          id?: string
          name_de: string
          note?: string | null
          sort_order?: number
          typical_education_type?: string | null
        }
        Update: {
          countries?: string[]
          created_at?: string
          id?: string
          name_de?: string
          note?: string | null
          sort_order?: number
          typical_education_type?: string | null
        }
        Relationships: []
      }
      education_institutions: {
        Row: {
          country_code: string
          created_at: string
          id: string
          institution_type_id: string
          name: string
          source_url: string | null
          validation_status: string
        }
        Insert: {
          country_code?: string
          created_at?: string
          id?: string
          institution_type_id: string
          name: string
          source_url?: string | null
          validation_status?: string
        }
        Update: {
          country_code?: string
          created_at?: string
          id?: string
          institution_type_id?: string
          name?: string
          source_url?: string | null
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_institutions_institution_type_id_fkey"
            columns: ["institution_type_id"]
            isOneToOne: false
            referencedRelation: "education_institution_types"
            referencedColumns: ["id"]
          },
        ]
      }
      education_levels: {
        Row: {
          code: string
          created_at: string
          id: string
          isced_level: string | null
          name_de: string
          source: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          isced_level?: string | null
          name_de: string
          source: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          isced_level?: string | null
          name_de?: string
          source?: string
        }
        Relationships: []
      }
      education_qualification_options: {
        Row: {
          created_at: string
          education_field_id: string | null
          education_type_degree_id: string
          id: string
          institution_id: string | null
          qualification_id: string
        }
        Insert: {
          created_at?: string
          education_field_id?: string | null
          education_type_degree_id: string
          id?: string
          institution_id?: string | null
          qualification_id: string
        }
        Update: {
          created_at?: string
          education_field_id?: string | null
          education_type_degree_id?: string
          id?: string
          institution_id?: string | null
          qualification_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_qualification_options_education_field_id_fkey"
            columns: ["education_field_id"]
            isOneToOne: false
            referencedRelation: "education_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_qualification_options_education_type_degree_id_fkey"
            columns: ["education_type_degree_id"]
            isOneToOne: false
            referencedRelation: "education_type_degrees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_qualification_options_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "education_institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_qualification_options_qualification_id_fkey"
            columns: ["qualification_id"]
            isOneToOne: false
            referencedRelation: "education_qualifications"
            referencedColumns: ["id"]
          },
        ]
      }
      education_qualifications: {
        Row: {
          created_at: string
          education_level: string
          id: string
          is_active: boolean
          name: string
          source: string | null
          source_code: string | null
          source_url: string | null
        }
        Insert: {
          created_at?: string
          education_level: string
          id?: string
          is_active?: boolean
          name: string
          source?: string | null
          source_code?: string | null
          source_url?: string | null
        }
        Update: {
          created_at?: string
          education_level?: string
          id?: string
          is_active?: boolean
          name?: string
          source?: string | null
          source_code?: string | null
          source_url?: string | null
        }
        Relationships: []
      }
      education_type_degrees: {
        Row: {
          created_at: string
          education_type_id: string
          id: string
          name_de: string
          note: string | null
          sort_order: number
        }
        Insert: {
          created_at?: string
          education_type_id: string
          id?: string
          name_de: string
          note?: string | null
          sort_order: number
        }
        Update: {
          created_at?: string
          education_type_id?: string
          id?: string
          name_de?: string
          note?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "education_type_degrees_education_type_id_fkey"
            columns: ["education_type_id"]
            isOneToOne: false
            referencedRelation: "education_types"
            referencedColumns: ["id"]
          },
        ]
      }
      education_types: {
        Row: {
          code: string
          countries: string[]
          created_at: string
          id: string
          internal_group: string | null
          name_de: string
          sort_order: number
        }
        Insert: {
          code: string
          countries?: string[]
          created_at?: string
          id?: string
          internal_group?: string | null
          name_de: string
          sort_order: number
        }
        Update: {
          code?: string
          countries?: string[]
          created_at?: string
          id?: string
          internal_group?: string | null
          name_de?: string
          sort_order?: number
        }
        Relationships: []
      }
      educations: {
        Row: {
          candidate_id: string
          completion_status: string | null
          created_at: string
          degree: string
          description: string | null
          education_field_id: string | null
          education_level: string | null
          education_level_id: string | null
          education_type_degree_id: string | null
          education_type_id: string | null
          end_date: string | null
          field_of_study: string | null
          id: string
          institution_id: string | null
          institution_name: string
          institution_type_id: string | null
          is_current: boolean
          qualification_id: string | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          candidate_id: string
          completion_status?: string | null
          created_at?: string
          degree: string
          description?: string | null
          education_field_id?: string | null
          education_level?: string | null
          education_level_id?: string | null
          education_type_degree_id?: string | null
          education_type_id?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution_id?: string | null
          institution_name: string
          institution_type_id?: string | null
          is_current?: boolean
          qualification_id?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          completion_status?: string | null
          created_at?: string
          degree?: string
          description?: string | null
          education_field_id?: string | null
          education_level?: string | null
          education_level_id?: string | null
          education_type_degree_id?: string | null
          education_type_id?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string
          institution_type_id?: string | null
          is_current?: boolean
          qualification_id?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "educations_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "educations_education_field_id_fkey"
            columns: ["education_field_id"]
            isOneToOne: false
            referencedRelation: "education_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "educations_education_level_id_fkey"
            columns: ["education_level_id"]
            isOneToOne: false
            referencedRelation: "education_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "educations_education_type_degree_id_fkey"
            columns: ["education_type_degree_id"]
            isOneToOne: false
            referencedRelation: "education_type_degrees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "educations_education_type_id_fkey"
            columns: ["education_type_id"]
            isOneToOne: false
            referencedRelation: "education_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "educations_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "education_institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "educations_institution_type_id_fkey"
            columns: ["institution_type_id"]
            isOneToOne: false
            referencedRelation: "education_institution_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "educations_qualification_id_fkey"
            columns: ["qualification_id"]
            isOneToOne: false
            referencedRelation: "education_qualifications"
            referencedColumns: ["id"]
          },
        ]
      }
      employer_job_interactions: {
        Row: {
          candidate_id: string
          created_at: string
          decision: string
          id: string
          job_id: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          decision: string
          id?: string
          job_id: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          decision?: string
          id?: string
          job_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employer_job_interactions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_slots: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          match_id: string
          starts_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          match_id: string
          starts_at: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          match_id?: string
          starts_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_slots_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          confirmed_at: string
          created_at: string
          id: string
          interview_slot_id: string
          match_id: string
          updated_at: string
        }
        Insert: {
          confirmed_at?: string
          created_at?: string
          id?: string
          interview_slot_id: string
          match_id: string
          updated_at?: string
        }
        Update: {
          confirmed_at?: string
          created_at?: string
          id?: string
          interview_slot_id?: string
          match_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_interview_slot_id_fkey"
            columns: ["interview_slot_id"]
            isOneToOne: true
            referencedRelation: "interview_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      job_education_requirements: {
        Row: {
          created_at: string
          degree: string
          education_field_id: string | null
          education_level_id: string | null
          field_of_study: string | null
          id: string
          job_id: string
          requirement_type: string
        }
        Insert: {
          created_at?: string
          degree: string
          education_field_id?: string | null
          education_level_id?: string | null
          field_of_study?: string | null
          id?: string
          job_id: string
          requirement_type: string
        }
        Update: {
          created_at?: string
          degree?: string
          education_field_id?: string | null
          education_level_id?: string | null
          field_of_study?: string | null
          id?: string
          job_id?: string
          requirement_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_education_requirements_education_field_id_fkey"
            columns: ["education_field_id"]
            isOneToOne: false
            referencedRelation: "education_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_education_requirements_education_level_id_fkey"
            columns: ["education_level_id"]
            isOneToOne: false
            referencedRelation: "education_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_education_requirements_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_languages: {
        Row: {
          created_at: string
          job_id: string
          language_id: string
          minimum_proficiency: string
          requirement_type: string
        }
        Insert: {
          created_at?: string
          job_id: string
          language_id: string
          minimum_proficiency: string
          requirement_type: string
        }
        Update: {
          created_at?: string
          job_id?: string
          language_id?: string
          minimum_proficiency?: string
          requirement_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_languages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_languages_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      job_skills: {
        Row: {
          created_at: string
          job_id: string
          minimum_proficiency: string
          requirement_type: string
          skill_id: string
        }
        Insert: {
          created_at?: string
          job_id: string
          minimum_proficiency: string
          requirement_type: string
          skill_id: string
        }
        Update: {
          created_at?: string
          job_id?: string
          minimum_proficiency?: string
          requirement_type?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_skills_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          activity_area: string | null
          company_id: string
          created_at: string
          description: string
          earliest_start_date: string | null
          fully_remote_available: boolean
          homeoffice_available: boolean
          homeoffice_days: number | null
          homeoffice_requirement_type: string
          homeoffice_schedule: string | null
          id: string
          is_active: boolean
          latitude: number | null
          location: string
          longitude: number | null
          occupation_id: string | null
          required_work_experience_years: number | null
          requires_work_authorization: boolean
          responsible_contact_id: string | null
          salary_max: number | null
          salary_min: number | null
          title: string
          updated_at: string
          work_authorization_requirement_type: string
          work_experience_requirement_type: string
          work_model: string
          work_model_requirement_type: string
          workload_max: number
          workload_min: number
        }
        Insert: {
          activity_area?: string | null
          company_id: string
          created_at?: string
          description: string
          earliest_start_date?: string | null
          fully_remote_available?: boolean
          homeoffice_available?: boolean
          homeoffice_days?: number | null
          homeoffice_requirement_type?: string
          homeoffice_schedule?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          location: string
          longitude?: number | null
          occupation_id?: string | null
          required_work_experience_years?: number | null
          requires_work_authorization?: boolean
          responsible_contact_id?: string | null
          salary_max?: number | null
          salary_min?: number | null
          title: string
          updated_at?: string
          work_authorization_requirement_type?: string
          work_experience_requirement_type?: string
          work_model: string
          work_model_requirement_type?: string
          workload_max: number
          workload_min: number
        }
        Update: {
          activity_area?: string | null
          company_id?: string
          created_at?: string
          description?: string
          earliest_start_date?: string | null
          fully_remote_available?: boolean
          homeoffice_available?: boolean
          homeoffice_days?: number | null
          homeoffice_requirement_type?: string
          homeoffice_schedule?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          location?: string
          longitude?: number | null
          occupation_id?: string | null
          required_work_experience_years?: number | null
          requires_work_authorization?: boolean
          responsible_contact_id?: string | null
          salary_max?: number | null
          salary_min?: number | null
          title?: string
          updated_at?: string
          work_authorization_requirement_type?: string
          work_experience_requirement_type?: string
          work_model?: string
          work_model_requirement_type?: string
          workload_max?: number
          workload_min?: number
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_occupation_id_fkey"
            columns: ["occupation_id"]
            isOneToOne: false
            referencedRelation: "occupations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_responsible_contact_company_fk"
            columns: ["responsible_contact_id", "company_id"]
            isOneToOne: false
            referencedRelation: "company_contacts"
            referencedColumns: ["id", "company_id"]
          },
        ]
      }
      languages: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      matches: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          job_id: string
          matched_at: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          job_id: string
          matched_at?: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          job_id?: string
          matched_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      occupation_categories: {
        Row: {
          code: string
          created_at: string
          id: string
          level: number
          name_de: string
          parent_id: string | null
          source: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          level: number
          name_de: string
          parent_id?: string | null
          source: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          level?: number
          name_de?: string
          parent_id?: string | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "occupation_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "occupation_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      occupation_mappings: {
        Row: {
          created_at: string
          id: string
          mapping_type: string
          source_occupation_id: string
          target_occupation_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mapping_type: string
          source_occupation_id: string
          target_occupation_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mapping_type?: string
          source_occupation_id?: string
          target_occupation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "occupation_mappings_source_occupation_id_fkey"
            columns: ["source_occupation_id"]
            isOneToOne: false
            referencedRelation: "occupations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "occupation_mappings_target_occupation_id_fkey"
            columns: ["target_occupation_id"]
            isOneToOne: false
            referencedRelation: "occupations"
            referencedColumns: ["id"]
          },
        ]
      }
      occupation_skills: {
        Row: {
          created_at: string
          occupation_id: string
          relation_type: string
          skill_id: string
        }
        Insert: {
          created_at?: string
          occupation_id: string
          relation_type: string
          skill_id: string
        }
        Update: {
          created_at?: string
          occupation_id?: string
          relation_type?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "occupation_skills_occupation_id_fkey"
            columns: ["occupation_id"]
            isOneToOne: false
            referencedRelation: "occupations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "occupation_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      occupations: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          is_active: boolean
          isco_08_code: string | null
          name_de: string
          source: string
          source_code: string
          source_uri: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          isco_08_code?: string | null
          name_de: string
          source: string
          source_code: string
          source_uri?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          isco_08_code?: string | null
          name_de?: string
          source?: string
          source_code?: string
          source_uri?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "occupations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "occupation_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_role: string
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          account_role?: string
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          account_role?: string
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      skill_categories: {
        Row: {
          app_behavior: string | null
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          app_behavior?: string | null
          created_at?: string
          id?: string
          name: string
          sort_order: number
        }
        Update: {
          app_behavior?: string | null
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      skill_categories_import: {
        Row: {
          "Anzahl Skills": number | null
          "App-Verhalten": string | null
          "Berufsgruppe / Kategorie": string | null
          Reihenfolge: number | null
        }
        Insert: {
          "Anzahl Skills"?: number | null
          "App-Verhalten"?: string | null
          "Berufsgruppe / Kategorie"?: string | null
          Reihenfolge?: number | null
        }
        Update: {
          "Anzahl Skills"?: number | null
          "App-Verhalten"?: string | null
          "Berufsgruppe / Kategorie"?: string | null
          Reihenfolge?: number | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          category_id: string | null
          created_at: string
          cv_selectable: boolean | null
          esco_uri: string | null
          id: string
          name: string
          origin: string | null
          proficiency_levels: string | null
          search_alias: string | null
          skill_code: string | null
          skill_type: string | null
        }
        Insert: {
          category: string
          category_id?: string | null
          created_at?: string
          cv_selectable?: boolean | null
          esco_uri?: string | null
          id?: string
          name: string
          origin?: string | null
          proficiency_levels?: string | null
          search_alias?: string | null
          skill_code?: string | null
          skill_type?: string | null
        }
        Update: {
          category?: string
          category_id?: string | null
          created_at?: string
          cv_selectable?: boolean | null
          esco_uri?: string | null
          id?: string
          name?: string
          origin?: string | null
          proficiency_levels?: string | null
          search_alias?: string | null
          skill_code?: string | null
          skill_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      skills_import: {
        Row: {
          "CV auswählbar": string | null
          "Kategorie / Berufsgruppe": string
          Niveau: string | null
          Skill: string
          "Skill-ID": string
          Suchalias: string | null
          Typ: string | null
          Ursprung: string | null
        }
        Insert: {
          "CV auswählbar"?: string | null
          "Kategorie / Berufsgruppe": string
          Niveau?: string | null
          Skill: string
          "Skill-ID": string
          Suchalias?: string | null
          Typ?: string | null
          Ursprung?: string | null
        }
        Update: {
          "CV auswählbar"?: string | null
          "Kategorie / Berufsgruppe"?: string
          Niveau?: string | null
          Skill?: string
          "Skill-ID"?: string
          Suchalias?: string | null
          Typ?: string | null
          Ursprung?: string | null
        }
        Relationships: []
      }
      skills_import_staging: {
        Row: {
          id: number
          imported_at: string
          raw_data: Json
        }
        Insert: {
          id?: never
          imported_at?: string
          raw_data: Json
        }
        Update: {
          id?: never
          imported_at?: string
          raw_data?: Json
        }
        Relationships: []
      }
      work_experiences: {
        Row: {
          candidate_id: string
          created_at: string
          description: string | null
          employer_name: string
          end_date: string | null
          id: string
          is_current: boolean
          job_title: string
          location: string | null
          start_date: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          description?: string | null
          employer_name: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          job_title: string
          location?: string | null
          start_date: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          description?: string | null
          employer_name?: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          job_title?: string
          location?: string | null
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_experiences_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_employer_company: {
        Args: {
          p_address_city?: string
          p_address_house_number?: string
          p_address_postal_code?: string
          p_address_street?: string
          p_company_size?: string
          p_contact_email?: string
          p_contact_first_name?: string
          p_contact_last_name?: string
          p_contact_phone?: string
          p_description?: string
          p_industry?: string
          p_legal_form?: string
          p_location?: string
          p_location_latitude?: number
          p_location_longitude?: number
          p_name: string
          p_website?: string
        }
        Returns: string
      }
      create_employer_interview_slot: {
        Args: { p_ends_at: string; p_match_id: string; p_starts_at: string }
        Returns: string
      }
      create_mutual_match_if_eligible: {
        Args: { p_job_id: string }
        Returns: string
      }
      create_mutual_match_internal: {
        Args: { p_candidate_id: string; p_job_id: string }
        Returns: string
      }
      delete_own_matches_for_poc: { Args: never; Returns: undefined }
      get_confirmed_candidate_contact: {
        Args: { p_match_id: string }
        Returns: {
          first_name: string
          last_name: string
          phone_number: string
        }[]
      }
      get_employer_candidate_educations: {
        Args: { p_job_id: string }
        Returns: {
          candidate_id: string
          degree: string
          description: string
          end_date: string
          field_of_study: string
          id: string
          institution_name: string
          is_current: boolean
          start_date: string
        }[]
      }
      get_employer_candidate_languages: {
        Args: { p_job_id: string }
        Returns: {
          candidate_id: string
          language_id: string
          proficiency: string
        }[]
      }
      get_employer_candidate_skills: {
        Args: { p_job_id: string }
        Returns: {
          candidate_id: string
          proficiency: string
          skill_id: string
        }[]
      }
      get_employer_candidate_work_experiences: {
        Args: { p_job_id: string }
        Returns: {
          candidate_id: string
          description: string
          employer_name: string
          end_date: string
          id: string
          is_current: boolean
          job_title: string
          location: string
          start_date: string
        }[]
      }
      get_employer_interview: {
        Args: { p_match_id: string }
        Returns: {
          confirmed_at: string
          created_at: string
          id: string
          interview_slot_id: string
          match_id: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "interviews"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_employer_interview_slots: {
        Args: { p_match_id: string }
        Returns: {
          created_at: string
          ends_at: string
          id: string
          match_id: string
          starts_at: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "interview_slots"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_employer_matched_candidate: {
        Args: { p_match_id: string }
        Returns: {
          accepts_fully_remote: boolean
          desired_homeoffice_days: number
          desired_work_latitude: number
          desired_work_longitude: number
          desired_workload_max: number
          desired_workload_min: number
          has_work_authorization: boolean
          homeoffice_preference: string
          preferred_homeoffice_schedule: string
          preferred_work_model: string
          salary_max: number
          salary_min: number
          user_id: string
          willing_to_commute: boolean
          willing_to_relocate: boolean
          work_radius_km: number
        }[]
      }
      get_employer_matches: {
        Args: never
        Returns: {
          candidate_id: string
          created_at: string
          id: string
          job_id: string
          matched_at: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "matches"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_employer_matching_candidates: {
        Args: { p_job_id: string }
        Returns: {
          accepts_fully_remote: boolean
          desired_homeoffice_days: number
          desired_work_latitude: number
          desired_work_longitude: number
          desired_workload_max: number
          desired_workload_min: number
          has_work_authorization: boolean
          homeoffice_preference: string
          preferred_homeoffice_schedule: string
          preferred_work_model: string
          salary_max: number
          salary_min: number
          user_id: string
          willing_to_commute: boolean
          willing_to_relocate: boolean
          work_radius_km: number
        }[]
      }
      is_own_company_job: { Args: { p_job_id: string }; Returns: boolean }
      reset_employer_for_poc: { Args: never; Returns: undefined }
      reset_my_candidate_onboarding: { Args: never; Returns: undefined }
      save_candidate_skill_categories: {
        Args: { p_category_ids: string[] }
        Returns: undefined
      }
      save_employer_candidate_decision: {
        Args: { p_candidate_id: string; p_decision: string; p_job_id: string }
        Returns: string
      }
      search_occupations: {
        Args: { result_limit?: number; search_term: string }
        Returns: {
          id: string
          name_de: string
          source: string
          source_code: string
        }[]
      }
      seed_employer_jobs_for_poc: { Args: never; Returns: number }
      select_interview_slot: {
        Args: { p_interview_slot_id: string; p_match_id: string }
        Returns: string
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
    Enums: {},
  },
} as const
