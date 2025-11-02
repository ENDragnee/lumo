"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreditCard, Trash2, Loader2 } from "lucide-react";
import type { UserSettingsData } from "@/types/settings"; // Assuming the type is exported from the page

interface SubscriptionPanelProps {
  subscriptions: UserSettingsData['subscriptions'];
  onUnsubscribe: (creatorId: string) => void;
}

export function SubscriptionPanel({ subscriptions, onUnsubscribe }: SubscriptionPanelProps) {
  const [unsubscribingId, setUnsubscribingId] = useState<string | null>(null);

  const handleUnsubscribe = async (creatorId: string) => {
    setUnsubscribingId(creatorId);
    try {
      const response = await fetch(`/api/subscriptions/${creatorId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Failed to unsubscribe.");
      }
      // Notify parent to update the UI
      onUnsubscribe(creatorId);
    } catch (error) {
      console.error(error);
      // Add user-facing error toast
    } finally {
      setUnsubscribingId(null);
    }
  };

  return (
    <Card className="shadow-apple-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-responsive-h3">
          <CreditCard className="w-5 h-5 text-pacific" />
          Your Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {subscriptions.length === 0 ? (
          <div className="p-12 text-center text-graphite">
            <p>You are not subscribed to any creators yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div key={sub._id} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-cloud">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={sub.creatorId.profileImage} />
                    <AvatarFallback>{sub.creatorId.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-shadow">{sub.creatorId.name}</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleUnsubscribe(sub.creatorId._id)}
                  disabled={unsubscribingId === sub.creatorId._id}
                >
                  {unsubscribingId === sub.creatorId._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Unsubscribe
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
