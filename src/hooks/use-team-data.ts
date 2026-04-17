import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { withTimeout } from "@/lib/supabase-guards";

const QUERY_TIMEOUT_MS = 8000;

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
    retry: false,
    queryFn: async () => {
      const { data, error } = await withTimeout(
        supabase.from("departments").select("*").order("sort_order"),
        QUERY_TIMEOUT_MS,
        "Timed out loading departments"
      );
      if (error) throw error;
      return data as Department[];
    },
  });

  const members = useQuery({
    queryKey: ["team_members"],
    retry: false,
    queryFn: async () => {
      const { data, error } = await withTimeout(
        supabase.from("team_members").select("*").order("sort_order"),
        QUERY_TIMEOUT_MS,
        "Timed out loading team members"
      );
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const gridSettings = useQuery({
    queryKey: ["team_grid_settings"],
    retry: false,
    queryFn: async () => {
      const { data, error } = await withTimeout(
        supabase.from("team_grid_settings").select("*").limit(1).maybeSingle(),
        QUERY_TIMEOUT_MS,
        "Timed out loading team grid settings"
      );
      if (error) throw error;
      return (data ?? null) as GridSettings | null;
    },
  });

  return { departments, members, gridSettings };
}

export function useTeamMemberBySlug(slug: string) {
  return useQuery({
    queryKey: ["team_member", slug],
    enabled: !!slug,
    retry: false,
    queryFn: async () => {
      const { data, error } = await withTimeout(
        supabase.from("team_members").select("*").eq("slug", slug).single(),
        QUERY_TIMEOUT_MS,
        "Timed out loading team member"
      );
      if (error) throw error;
      return data as TeamMember;
    },
  });
}

/** Returns a flat ordered list of all members across departments in display order */
export function getOrderedMembers(departments: Department[], members: TeamMember[]): TeamMember[] {
  const result: TeamMember[] = [];
  for (const dept of departments) {
    const deptMembers = members
      .filter((m) => m.department_id === dept.id)
      .sort((a, b) => a.sort_order - b.sort_order);
    result.push(...deptMembers);
  }

  const unassigned = members
    .filter((m) => !m.department_id)
    .sort((a, b) => a.sort_order - b.sort_order);
  result.push(...unassigned);

  return result;
}
