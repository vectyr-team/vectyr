import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BusinessInfo {
  id: string;
  name: string;
  legal_name: string;
  description: string;
  telephone: string;
  email: string;
  street_address: string;
  address_locality: string;
  address_region: string;
  postal_code: string;
  address_country: string;
  geo_latitude: number;
  geo_longitude: number;
  service_areas: string[];
  services: string[];
  opening_hours: string;
  founding_date: string;
  founder_name: string;
  founder_url: string;
  founder_linkedin: string;
  rating_value: number;
  review_count: number;
  social_links: string[];
}

interface BusinessInfoEditorProps {
  onSaved?: () => void;
}

const BusinessInfoEditor = ({ onSaved }: BusinessInfoEditorProps) => {
  const [info, setInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchBusinessInfo = async () => {
    const { data } = await supabase
      .from("business_info")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    setInfo((data as BusinessInfo | null) ?? null);
    setLoading(false);
  };

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const update = (field: keyof BusinessInfo, value: any) => {
    if (!info) return;
    setInfo({ ...info, [field]: value });
  };

  const updateArray = (field: keyof BusinessInfo, value: string) => {
    update(field, value.split("\n").map((s) => s.trim()).filter(Boolean));
  };

  const save = async () => {
    if (!info) return;
    setSaving(true);
    const { id, ...rest } = info;
    const { error } = await supabase.from("business_info").update(rest as any).eq("id", id);

    if (error) {
      toast.error("Failed to save");
      setSaving(false);
      return;
    }

    await fetchBusinessInfo();
    onSaved?.();
    toast.success("Business info saved");
    setSaving(false);
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;
  if (!info) return <p className="text-muted-foreground text-sm">No business info found.</p>;

  const Field = ({ label, field, type = "text" }: { label: string; field: keyof BusinessInfo; type?: string }) => (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">{label}</label>
      <Input
        type={type}
        value={String(info[field])}
        onChange={(e) => update(field, type === "number" ? Number(e.target.value) : e.target.value)}
        className="font-body text-sm"
      />
    </div>
  );

  const ArrayField = ({ label, field }: { label: string; field: keyof BusinessInfo }) => (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">{label} (one per line)</label>
      <Textarea
        value={(info[field] as string[]).join("\n")}
        onChange={(e) => updateArray(field, e.target.value)}
        rows={4}
        className="font-body text-sm"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="font-body text-lg text-foreground font-medium">General</h2>
        <Field label="Business Name" field="name" />
        <Field label="Legal Name" field="legal_name" />
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">Description</label>
          <Textarea value={info.description} onChange={(e) => update("description", e.target.value)} rows={3} className="font-body text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone" field="telephone" />
          <Field label="Email" field="email" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-body text-lg text-foreground font-medium">Address</h2>
        <Field label="Street" field="street_address" />
        <div className="grid grid-cols-3 gap-4">
          <Field label="City" field="address_locality" />
          <Field label="State" field="address_region" />
          <Field label="ZIP" field="postal_code" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Country" field="address_country" />
          <Field label="Latitude" field="geo_latitude" type="number" />
          <Field label="Longitude" field="geo_longitude" type="number" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-body text-lg text-foreground font-medium">Services & Hours</h2>
        <ArrayField label="Service Areas" field="service_areas" />
        <ArrayField label="Services Offered" field="services" />
        <Field label="Opening Hours (schema format)" field="opening_hours" />
      </div>

      <div className="space-y-4">
        <h2 className="font-body text-lg text-foreground font-medium">Founder</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" field="founder_name" />
          <Field label="Website" field="founder_url" />
        </div>
        <Field label="LinkedIn" field="founder_linkedin" />
        <Field label="Founding Date" field="founding_date" />
      </div>

      <div className="space-y-4">
        <h2 className="font-body text-lg text-foreground font-medium">Rating & Social</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Rating Value" field="rating_value" type="number" />
          <Field label="Review Count" field="review_count" type="number" />
        </div>
        <ArrayField label="Social Links" field="social_links" />
      </div>

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save Business Info"}
      </Button>
    </div>
  );
};

export default BusinessInfoEditor;
