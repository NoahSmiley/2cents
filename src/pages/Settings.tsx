// src/pages/Settings.tsx
import { useState } from "react";
import { useSettings } from "@/hooks/use-settings";
import { SettingsStore, type Category } from "@/lib/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";
import Page from "./Page";

export default function SettingsPage() {
  const settings = useSettings();
  const [drafts, setDrafts] = useState<Record<string, {name: string; limit: string}>>({});

  const onEdit = (c: Category, patch: Partial<{name: string; limit: string}>) => {
    setDrafts(d => ({ 
      ...d, 
      [c.id]: { 
        name: patch.name ?? d[c.id]?.name ?? c.name, 
        limit: patch.limit ?? d[c.id]?.limit ?? String(c.limit) 
      } 
    }));
  };

  const commit = (c: Category) => {
    const d = drafts[c.id];
    if (!d) return;
    SettingsStore.upsertCategory({
      id: c.id,
      name: d.name,
      limit: Number(d.limit || 0),
    });
    setDrafts(prev => { const cp = {...prev}; delete cp[c.id]; return cp; });
  };

  const remove = (id: string) => SettingsStore.removeCategory(id);

  const add = () => {
    SettingsStore.upsertCategory({ name: "New Category", limit: 0 });
  };

  return (
    <Page max={false} center={false} padding="lg">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Budget Categories</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {settings.categories.map(c => {
              const d = drafts[c.id];
              return (
                <div key={c.id} className="flex items-center gap-2">
                  <Input
                    className="max-w-48"
                    value={d?.name ?? c.name}
                    onChange={(e) => onEdit(c, { name: e.target.value })}
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">{settings.currency}</span>
                    <Input
                      type="number"
                      className="w-28"
                      value={d?.limit ?? String(c.limit)}
                      onChange={(e) => onEdit(c, { limit: e.target.value })}
                    />
                  </div>
                  <Button size="sm" onClick={() => commit(c)}>Save</Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(c.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
            <Button onClick={add} className="mt-2">
              <Plus className="h-4 w-4 mr-1" /> Add Category
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2">
              <label className="text-sm w-28">Currency</label>
              <Input
                className="w-24"
                value={settings.currency}
                onChange={(e) => SettingsStore.setCurrency(e.target.value || "$")}
              />
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div>
                <h3 className="text-sm font-medium mb-1">UI Mode</h3>
                <p className="text-xs text-muted-foreground">Choose your preferred interface style</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ui-mode" className="text-sm font-normal">
                    {settings.uiMode === "professional" ? "Professional" : "Minimalist"}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {settings.uiMode === "professional" 
                      ? "Rich visuals, animations, and detailed UI" 
                      : "Clean, simple, and distraction-free"}
                  </p>
                </div>
                <Switch
                  id="ui-mode"
                  checked={settings.uiMode === "minimalist"}
                  onCheckedChange={(checked) => 
                    SettingsStore.setUIMode(checked ? "minimalist" : "professional")
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
