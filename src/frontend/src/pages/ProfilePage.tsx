import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { LogIn, LogOut, Save, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function ProfilePage() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { actor } = useActor();
  const [displayName, setDisplayName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedingReminders, setFeedingReminders] = useState(true);
  const [waterReminders, setWaterReminders] = useState(true);

  useEffect(() => {
    if (!actor || !identity) return;
    setIsLoadingProfile(true);
    actor
      .getCallerUserProfile()
      .then((profile) => {
        if (profile) {
          setDisplayName(profile.name);
          setSavedName(profile.name);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingProfile(false));
  }, [actor, identity]);

  const handleSave = async () => {
    if (!actor) return;
    setIsSaving(true);
    try {
      await actor.saveCallerUserProfile({ name: displayName });
      setSavedName(displayName);
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 8)}...${principal.slice(-5)}`
    : null;

  if (!identity) {
    return (
      <div className="flex flex-col h-full water-bg">
        <div className="ocean-gradient px-4 pt-10 pb-5">
          <h1 className="font-display text-2xl text-white mb-1">Profile</h1>
          <p className="text-white/70 text-sm font-body">
            Your account & settings
          </p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="w-24 h-24 rounded-full ocean-gradient flex items-center justify-center shadow-xl">
              <User className="w-12 h-12 text-white/80" />
            </div>
            <div>
              <h2 className="font-display text-xl text-foreground">
                Sign in to your account
              </h2>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Save reminders, track your aquarium, and connect with the
                community.
              </p>
            </div>
            <Button
              data-ocid="profile.login.primary_button"
              onClick={login}
              disabled={loginStatus === "logging-in"}
              className="w-full ocean-gradient text-white font-body font-semibold"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {loginStatus === "logging-in" ? "Signing in..." : "Sign In"}
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full water-bg">
      <div className="ocean-gradient px-4 pt-10 pb-5">
        <h1 className="font-display text-2xl text-white mb-1">Profile</h1>
        <p className="text-white/70 text-sm font-body">
          Your account & settings
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Avatar + identity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 py-4"
        >
          <div className="w-20 h-20 rounded-full ocean-gradient flex items-center justify-center shadow-xl">
            <span className="font-display text-3xl text-white">
              {savedName ? savedName[0].toUpperCase() : "A"}
            </span>
          </div>
          <div className="text-center">
            <h2 className="font-display text-lg text-foreground">
              {savedName || "Aquarist"}
            </h2>
            <p className="font-body text-xs text-muted-foreground">
              {shortPrincipal}
            </p>
          </div>
        </motion.div>

        {/* Edit display name */}
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">
              Edit Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingProfile ? (
              <Skeleton
                className="h-9 w-full"
                data-ocid="profile.loading_state"
              />
            ) : (
              <div className="space-y-1.5">
                <Label className="font-body text-sm">Display Name</Label>
                <Input
                  data-ocid="profile.name.input"
                  placeholder="e.g. Marina Torres"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="font-body"
                />
              </div>
            )}
            <Button
              data-ocid="profile.save.primary_button"
              onClick={handleSave}
              disabled={isSaving || displayName === savedName}
              className="w-full ocean-gradient text-white font-body font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        {/* Notification settings */}
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm font-medium text-foreground">
                  Feeding Reminders
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  Daily feeding alerts
                </p>
              </div>
              <Switch
                data-ocid="profile.feeding.switch"
                checked={feedingReminders}
                onCheckedChange={setFeedingReminders}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm font-medium text-foreground">
                  Water Change Reminders
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  Weekly maintenance alerts
                </p>
              </div>
              <Switch
                data-ocid="profile.water.switch"
                checked={waterReminders}
                onCheckedChange={setWaterReminders}
              />
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-body text-sm text-muted-foreground">
                Version
              </span>
              <span className="font-body text-sm text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="font-body text-sm text-muted-foreground">
                Built with
              </span>
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                className="font-body text-sm text-accent hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                caffeine.ai
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Sign out */}
        <Button
          data-ocid="profile.logout.button"
          variant="outline"
          onClick={clear}
          className="w-full font-body font-semibold text-destructive border-destructive/30 hover:bg-destructive/5"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
