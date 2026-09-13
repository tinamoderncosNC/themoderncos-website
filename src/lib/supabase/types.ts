// Hand-written, scoped to the columns actually queried so far (public
// catalog reads only) — not the full output of `supabase gen types`. Shape
// matches what that command would produce so it's a drop-in replacement
// once the CLI can be linked. Extend as more tables are queried.
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          summary: string | null;
          status: "draft" | "active" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          summary?: string | null;
          status?: "draft" | "active" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          summary?: string | null;
          status?: "draft" | "active" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_versions: {
        Row: {
          id: string;
          product_id: string;
          version_label: string;
          is_current: boolean;
          changelog: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          version_label: string;
          is_current?: boolean;
          changelog?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          version_label?: string;
          is_current?: boolean;
          changelog?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      waitlist_signups: {
        Row: {
          id: string;
          email: string;
          tier_name: string;
          tier_price: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          tier_name: string;
          tier_price: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          tier_name?: string;
          tier_price?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
