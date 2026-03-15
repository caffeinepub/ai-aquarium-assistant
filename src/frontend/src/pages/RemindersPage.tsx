import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Bell,
  Droplets,
  Filter,
  Fish,
  FlaskConical,
  Plus,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Reminder } from "../backend.d";
import CatEatsFishAnimation from "../components/CatEatsFishAnimation";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddReminder, useReminders } from "../hooks/useQueries";

const REMINDER_TYPES = [
  { value: "feeding", label: "Feeding", icon: Fish, color: "text-orange-500" },
  {
    value: "water-change",
    label: "Water Change",
    icon: Droplets,
    color: "text-blue-500",
  },
  {
    value: "cleaning",
    label: "Tank Cleaning",
    icon: Sparkles,
    color: "text-purple-500",
  },
  {
    value: "filter-maintenance",
    label: "Filter Maintenance",
    icon: Filter,
    color: "text-teal-500",
  },
  {
    value: "water-testing",
    label: "Water Testing",
    icon: FlaskConical,
    color: "text-emerald-500",
  },
];

const SAMPLE_REMINDERS: Reminder[] = [
  {
    id: BigInt(1),
    reminderType: "feeding",
    title: "Morning Feeding",
    description: "Feed betta pellets — 3-4 pellets per feeding",
    frequencyDays: BigInt(1),
    lastDone: BigInt(Date.now() - 86400000),
    nextDue: BigInt(Date.now() + 43200000),
    enabled: true,
  },
  {
    id: BigInt(2),
    reminderType: "water-change",
    title: "Weekly Water Change",
    description: "25% water change + vacuum gravel",
    frequencyDays: BigInt(7),
    lastDone: BigInt(Date.now() - 86400000 * 5),
    nextDue: BigInt(Date.now() + 86400000 * 2),
    enabled: true,
  },
  {
    id: BigInt(3),
    reminderType: "filter-maintenance",
    title: "Filter Rinse",
    description: "Rinse filter media in old tank water",
    frequencyDays: BigInt(30),
    lastDone: BigInt(Date.now() - 86400000 * 20),
    nextDue: BigInt(Date.now() + 86400000 * 10),
    enabled: false,
  },
];

function getReminderIcon(type: string) {
  const found = REMINDER_TYPES.find((t) => t.value === type);
  const Icon = found?.icon ?? Bell;
  const color = found?.color ?? "text-primary";
  return <Icon className={`w-5 h-5 ${color}`} />;
}

function getDaysUntilDue(nextDue: bigint): string {
  const ms = Number(nextDue) - Date.now();
  const days = Math.ceil(ms / 86400000);
  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

function getDueBadgeStyle(nextDue: bigint): string {
  const ms = Number(nextDue) - Date.now();
  const days = Math.ceil(ms / 86400000);
  if (days < 0) return "bg-red-100 text-red-700";
  if (days <= 1) return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export default function RemindersPage() {
  const { identity, login } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { data: reminders, isLoading } = useReminders(principal);
  const addReminder = useAddReminder();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    reminderType: "",
    title: "",
    description: "",
    frequencyDays: "7",
  });
  const [localToggles, setLocalToggles] = useState<Record<string, boolean>>({});
  const [showCatAnimation, setShowCatAnimation] = useState(false);

  const displayReminders = reminders?.length
    ? reminders
    : principal
      ? []
      : SAMPLE_REMINDERS;

  const handleReminderResponse = (answer: "yes" | "no", title: string) => {
    setShowCatAnimation(true);
    toast.info(
      answer === "yes"
        ? `✅ Great job completing "${title}"!`
        : `❌ Reminder for "${title}" snoozed.`,
    );
  };

  const handleSubmit = async () => {
    if (!identity) {
      toast.error("Please log in to create reminders");
      return;
    }
    if (!form.reminderType || !form.title) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      await addReminder.mutateAsync({
        reminderType: form.reminderType,
        title: form.title,
        description: form.description,
        frequencyDays: BigInt(Number.parseInt(form.frequencyDays) || 7),
      });
      toast.success("Reminder added!");
      setForm({
        reminderType: "",
        title: "",
        description: "",
        frequencyDays: "7",
      });
      setShowForm(false);
    } catch {
      toast.error("Failed to add reminder");
    }
  };

  return (
    <div className="flex flex-col h-full water-bg">
      <CatEatsFishAnimation
        isVisible={showCatAnimation}
        onDone={() => setShowCatAnimation(false)}
      />

      <div className="ocean-gradient px-4 pt-10 pb-5">
        <h1 className="font-display text-2xl text-white mb-1">
          Care Reminders
        </h1>
        <p className="text-white/70 text-sm font-body">
          Never miss aquarium maintenance
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!identity && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-body font-semibold text-foreground">
                    Log in to save reminders
                  </p>
                  <p className="text-xs font-body text-muted-foreground">
                    Showing sample data
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={login}
                  className="ocean-gradient text-white font-body shrink-0"
                >
                  Log In
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          data-ocid="reminders.add.button"
          className="w-full ocean-gradient text-white font-body font-semibold"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reminder
        </Button>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="shadow-card border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-lg">
                    New Reminder
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">Reminder Type *</Label>
                    <Select
                      value={form.reminderType}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, reminderType: v }))
                      }
                    >
                      <SelectTrigger
                        data-ocid="reminders.type.select"
                        className="font-body"
                      >
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {REMINDER_TYPES.map((t) => (
                          <SelectItem
                            key={t.value}
                            value={t.value}
                            className="font-body"
                          >
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">Title *</Label>
                    <Input
                      data-ocid="reminders.title.input"
                      placeholder="e.g. Morning Feeding"
                      value={form.title}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, title: e.target.value }))
                      }
                      className="font-body"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">Description</Label>
                    <Textarea
                      data-ocid="reminders.description.textarea"
                      placeholder="Optional details..."
                      value={form.description}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, description: e.target.value }))
                      }
                      className="font-body resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">Every (days)</Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="7"
                      value={form.frequencyDays}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          frequencyDays: e.target.value,
                        }))
                      }
                      className="font-body"
                    />
                  </div>
                  <Button
                    data-ocid="reminders.add.submit_button"
                    onClick={handleSubmit}
                    disabled={addReminder.isPending}
                    className="w-full ocean-gradient text-white font-body font-semibold"
                  >
                    {addReminder.isPending ? "Saving..." : "Save Reminder"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reminders List */}
        <div>
          <h2 className="font-display text-lg text-foreground mb-3">
            Your Schedule
          </h2>
          {isLoading ? (
            <div className="space-y-3" data-ocid="reminders.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : displayReminders.length === 0 ? (
            <div
              className="text-center py-12"
              data-ocid="reminders.empty_state"
            >
              <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-body text-muted-foreground">
                No reminders yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayReminders.map((reminder, index) => {
                const isEnabled =
                  localToggles[reminder.id.toString()] ?? reminder.enabled;
                return (
                  <motion.div
                    key={reminder.id.toString()}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    data-ocid={`reminders.item.${index + 1}`}
                  >
                    <Card
                      className={`shadow-card border-border/60 transition-opacity ${
                        isEnabled ? "" : "opacity-60"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-2.5 rounded-xl bg-secondary">
                            {getReminderIcon(reminder.reminderType)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-body font-semibold text-foreground text-sm truncate">
                                {reminder.title}
                              </h3>
                              <Switch
                                data-ocid={`reminders.toggle.${index + 1}`}
                                checked={isEnabled}
                                onCheckedChange={(checked) =>
                                  setLocalToggles((p) => ({
                                    ...p,
                                    [reminder.id.toString()]: checked,
                                  }))
                                }
                              />
                            </div>
                            {reminder.description && (
                              <p className="text-xs text-muted-foreground font-body mt-0.5 line-clamp-1">
                                {reminder.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${getDueBadgeStyle(
                                  reminder.nextDue,
                                )}`}
                              >
                                {getDaysUntilDue(reminder.nextDue)}
                              </span>
                              <span className="text-xs text-muted-foreground font-body">
                                Every {reminder.frequencyDays.toString()} day
                                {reminder.frequencyDays > BigInt(1) ? "s" : ""}
                              </span>
                            </div>
                            {/* Done today? buttons */}
                            <div className="flex gap-2 mt-3">
                              <button
                                type="button"
                                data-ocid={`reminders.confirm_button.${index + 1}`}
                                onClick={() =>
                                  handleReminderResponse("yes", reminder.title)
                                }
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-body font-semibold transition-colors border border-emerald-200"
                              >
                                ✅ Done!
                              </button>
                              <button
                                type="button"
                                data-ocid={`reminders.cancel_button.${index + 1}`}
                                onClick={() =>
                                  handleReminderResponse("no", reminder.title)
                                }
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-body font-semibold transition-colors border border-red-200"
                              >
                                ❌ Skip
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
