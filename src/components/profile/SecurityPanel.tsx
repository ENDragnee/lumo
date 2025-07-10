"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";
import type { UserSettingsData } from "@/types/settings"; // Import the shared type

interface SecurityPanelProps {
  user: UserSettingsData['profile'];
}

export function SecurityPanel({ user }: SecurityPanelProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- FIX: Updated logic to handle the "default" provider case ---
  // If the provider is explicitly 'credentials' OR if it's not set (falsy: undefined, null, ''),
  // we assume it's a default account that can change its password.
  const canChangePassword = user.provider === 'credentials' || !user.provider;

  // NEW: A helper to display the provider name gracefully
  const providerName = user.provider 
      ? user.provider.charAt(0).toUpperCase() + user.provider.slice(1) 
      : 'an external service';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/settings/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "An unknown error occurred.");
      }
      
      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-apple-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-responsive-h3">
          <Shield className="w-5 h-5 text-pacific" />
          Password & Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {canChangePassword ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold text-shadow">Change Password</h3>
            
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <Button type="button" variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" onClick={() => setShowCurrent(!showCurrent)} aria-label="Toggle current password visibility">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <Button type="button" variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" onClick={() => setShowNew(!showNew)} aria-label="Toggle new password visibility">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-graphite">Must be at least 8 characters long.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type={showNew ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            {success && <Alert className="border-green-300 text-green-800"><AlertDescription>{success}</AlertDescription></Alert>}

            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <KeyRound className="h-4 w-4 mr-2" />}
              Update Password
            </Button>
          </form>
        ) : (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Signed in with {providerName}</AlertTitle>
            <AlertDescription>
              You signed in using your {providerName} account. Your password must be changed through your identity provider.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
