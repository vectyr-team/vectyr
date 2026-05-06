import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface HomeHero {
  id: string;
  headline_lead: string;
  headline_accent: string;
  subtitle: string;
  primary_button_label: string;
  primary_button_link: string;
  secondary_button_label: string;
  secondary_button_link: string;
}

const HomeHeroEditor = () => {
  const [hero, setHero] = useState<HomeHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHero = async () => {
      const { data } = await supabase
        .from("home_hero")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) setHero(data as HomeHero);
      setLoading(false);
    };
    fetchHero();
  }, []);

  const update = (field: keyof HomeHero, value: string) => {
    setHero((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const save = async () => {
    if (!hero) return;
    setSaving(true);
    const { error } = await supabase
      .from("home_hero")
      .update({
        headline_lead: hero.headline_lead,
        headline_accent: hero.headline_accent,
        subtitle: hero.subtitle,
        primary_button_label: hero.primary_button_label,
        primary_button_link: hero.primary_button_link,
        secondary_button_label: hero.secondary_button_label,
        secondary_button_link: hero.secondary_button_link,
      })
      .eq("id", hero.id);
    if (error) toast.error("Failed to save: " + error.message);
    else toast.success("Hero content saved");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-4 border border-border rounded-lg p-5 bg-black02">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!hero) return <p className="text-muted-foreground text-sm font-body">No hero data found.</p>;

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
      {children}
    </label>
  );

  return (
    <div className="space-y-5 border border-border rounded-lg p-5 bg-black02">
      <div>
        <Label>Headline (lead)</Label>
        <Input
          value={hero.headline_lead}
          onChange={(e) => update("headline_lead", e.target.value)}
          className="font-body text-sm"
        />
      </div>

      <div>
        <Label>Headline (accent / orange)</Label>
        <Input
          value={hero.headline_accent}
          onChange={(e) => update("headline_accent", e.target.value)}
          className="font-body text-sm"
        />
      </div>

      <div>
        <Label>Subtitle</Label>
        <Textarea
          value={hero.subtitle}
          onChange={(e) => update("subtitle", e.target.value)}
          rows={3}
          className="font-body text-sm"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
        <div>
          <Label>Primary button label</Label>
          <Input
            value={hero.primary_button_label}
            onChange={(e) => update("primary_button_label", e.target.value)}
            className="font-body text-sm"
          />
        </div>
        <div>
          <Label>Primary button link</Label>
          <Input
            value={hero.primary_button_link}
            onChange={(e) => update("primary_button_link", e.target.value)}
            placeholder="/demo or https://..."
            className="font-body text-sm"
          />
        </div>
        <div>
          <Label>Secondary button label</Label>
          <Input
            value={hero.secondary_button_label}
            onChange={(e) => update("secondary_button_label", e.target.value)}
            className="font-body text-sm"
          />
        </div>
        <div>
          <Label>Secondary button link</Label>
          <Input
            value={hero.secondary_button_link}
            onChange={(e) => update("secondary_button_link", e.target.value)}
            placeholder="/faqs or https://..."
            className="font-body text-sm"
          />
        </div>
      </div>

      <Button size="sm" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default HomeHeroEditor;
