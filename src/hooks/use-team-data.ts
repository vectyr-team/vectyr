import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Department {
  id: string;
  name: string;
  sort_order: number;
}

export interface TeamMember {
  id: string;
  department_id: string | null;
  name: string;
  title: string;
  bio: string;
  slug: string;
  photo_url: string | null;
  sort_order: number;
}

export interface GridSettings {
  id: string;
  desktop_columns: number;
  tablet_columns: number;
  mobile_columns: number;
}

export function useTeamData() {
  const departments = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Department[];
    },
  });

  const members = useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const gridSettings = useQuery({
    queryKey: ["team_grid_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_grid_settings")
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return data as GridSettings;
    },
  });

  return { departments, members, gridSettings };
}

export function useTeamMemberBySlug(slug: string) {
  return useQuery({
    queryKey: ["team_member", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as TeamMember;
    },
    enabled: !!slug,
  });
}

/** Returns a flat ordered list of all members across departments in display order */
export function getOrderedMembers(departments: Department[], members: TeamMember[]): TeamMember[] {
  const result: TeamMember[] = [];
  // Members with departments, in department order
  for (const dept of departments) {
    const deptMembers = members
      .filter((m) => m.department_id === dept.id)
      .sort((a, b) => a.sort_order - b.sort_order);
    result.push(...deptMembers);
  }
  // Members without a department at the end
  const unassigned = members
    .filter((m) => !m.department_id)
    .sort((a, b) => a.sort_order - b.sort_order);
  result.push(...unassigned);
  return result;
}
