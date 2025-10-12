import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Copy, Check, UserPlus, LogOut } from "lucide-react";
import * as dbService from "@/lib/db-service";
import type { Household } from "@/lib/db-service";

export function HouseholdManager() {
  const [household, setHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);
  const [householdName, setHouseholdName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    loadHousehold();
  }, []);

  async function loadHousehold() {
    try {
      setLoading(true);
      const h = await dbService.getCurrentHousehold();
      setHousehold(h);
      if (h) {
        const m = await dbService.getHouseholdMembers(h.id);
        setMembers(m);
      }
    } catch (err) {
      console.error("Failed to load household:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateHousehold() {
    if (!householdName.trim()) {
      setError("Please enter a household name");
      return;
    }

    try {
      setError("");
      const newHousehold = await dbService.createHousehold(householdName);
      setHousehold(newHousehold);
      setHouseholdName("");
      // Reload to refresh all data
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Failed to create household");
    }
  }

  async function handleJoinHousehold() {
    if (!inviteCode.trim()) {
      setError("Please enter an invite code");
      return;
    }

    try {
      setError("");
      const joinedHousehold = await dbService.joinHousehold(inviteCode.toUpperCase());
      setHousehold(joinedHousehold);
      setInviteCode("");
      // Reload to refresh all data
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Failed to join household");
    }
  }

  async function handleLeaveHousehold() {
    if (!confirm("Are you sure you want to leave this household? You will lose access to all shared data.")) {
      return;
    }

    try {
      await dbService.leaveHousehold();
      setHousehold(null);
      setMembers([]);
      // Reload to refresh all data
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Failed to leave household");
    }
  }

  function copyInviteCode() {
    if (household?.invite_code) {
      navigator.clipboard.writeText(household.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Household Sharing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (household) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Household: {household.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Invite Code</Label>
            <div className="flex gap-2">
              <Input
                value={household.invite_code || ""}
                readOnly
                className="font-mono"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={copyInviteCode}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this code with your partner to give them access to your shared finances
            </p>
          </div>

          <div className="space-y-2">
            <Label>Members ({members.length})</Label>
            <div className="space-y-1">
              {members.map((member) => (
                <div key={member.user_id} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded">
                  <span className="text-sm">{member.user?.email || 'Unknown'}</span>
                  <span className="text-xs text-muted-foreground capitalize">{member.role}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/20 p-3 rounded">
              {error}
            </div>
          )}

          <Button
            variant="destructive"
            onClick={handleLeaveHousehold}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Leave Household
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Household Sharing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Create a household to share finances with your partner, or join an existing household with an invite code.
        </p>

        {/* Create Household */}
        <div className="space-y-3 pb-4 border-b">
          <h3 className="font-medium text-sm">Create New Household</h3>
          <div className="space-y-2">
            <Label>Household Name</Label>
            <Input
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              placeholder="e.g., Smith Family"
            />
          </div>
          <Button onClick={handleCreateHousehold} className="w-full">
            <Users className="h-4 w-4 mr-2" />
            Create Household
          </Button>
        </div>

        {/* Join Household */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Join Existing Household</h3>
          <div className="space-y-2">
            <Label>Invite Code</Label>
            <Input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="font-mono uppercase"
            />
          </div>
          <Button onClick={handleJoinHousehold} variant="outline" className="w-full">
            <UserPlus className="h-4 w-4 mr-2" />
            Join Household
          </Button>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/20 p-3 rounded">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
