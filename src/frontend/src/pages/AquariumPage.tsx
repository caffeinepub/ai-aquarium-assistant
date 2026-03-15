import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle,
  Droplets,
  Plus,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { WaterLog } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddWaterLog, useWaterLogs } from "../hooks/useQueries";

type ParamStatus = "good" | "warning" | "danger";

function getPhStatus(ph: number): ParamStatus {
  if (ph >= 6.5 && ph <= 7.8) return "good";
  if (ph >= 6.0 && ph <= 8.2) return "warning";
  return "danger";
}

function getTempStatus(temp: number): ParamStatus {
  if (temp >= 72 && temp <= 80) return "good";
  if (temp >= 65 && temp <= 85) return "warning";
  return "danger";
}

function getAmmoniaStatus(ammonia: number): ParamStatus {
  if (ammonia <= 0.25) return "good";
  if (ammonia <= 0.5) return "warning";
  return "danger";
}

function getNitrateStatus(nitrate: number): ParamStatus {
  if (nitrate <= 20) return "good";
  if (nitrate <= 40) return "warning";
  return "danger";
}

const STATUS_STYLES: Record<
  ParamStatus,
  { bg: string; text: string; icon: typeof CheckCircle }
> = {
  good: {
    bg: "bg-emerald-100 text-emerald-700",
    text: "text-emerald-600",
    icon: CheckCircle,
  },
  warning: {
    bg: "bg-amber-100 text-amber-700",
    text: "text-amber-600",
    icon: AlertTriangle,
  },
  danger: {
    bg: "bg-red-100 text-red-700",
    text: "text-red-600",
    icon: XCircle,
  },
};

const SAMPLE_LOGS: WaterLog[] = [
  {
    id: BigInt(1),
    timestamp: BigInt(Date.now() - 86400000),
    temperature: 77.5,
    ph: 7.0,
    ammonia: 0.1,
    nitrate: 15,
    notes: "Everything looks good after water change",
  },
  {
    id: BigInt(2),
    timestamp: BigInt(Date.now() - 86400000 * 3),
    temperature: 76.0,
    ph: 6.8,
    ammonia: 0.25,
    nitrate: 22,
    notes: "Slight ammonia spike, added Prime",
  },
];

function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AquariumPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { data: logs, isLoading } = useWaterLogs(principal);
  const addLog = useAddWaterLog();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    temperature: "",
    ph: "",
    ammonia: "",
    nitrate: "",
    notes: "",
  });

  const displayLogs = logs?.length ? logs : principal ? [] : SAMPLE_LOGS;

  const handleSubmit = async () => {
    if (!identity) {
      toast.error("Please log in to save water logs");
      return;
    }
    const log: WaterLog = {
      id: BigInt(Date.now()),
      timestamp: BigInt(Date.now()),
      temperature: Number.parseFloat(form.temperature) || 0,
      ph: Number.parseFloat(form.ph) || 0,
      ammonia: Number.parseFloat(form.ammonia) || 0,
      nitrate: Number.parseFloat(form.nitrate) || 0,
      notes: form.notes,
    };
    try {
      await addLog.mutateAsync(log);
      toast.success("Water log saved!");
      setForm({ temperature: "", ph: "", ammonia: "", nitrate: "", notes: "" });
      setShowForm(false);
    } catch {
      toast.error("Failed to save log");
    }
  };

  return (
    <div className="flex flex-col h-full water-bg">
      <div className="ocean-gradient px-4 pt-10 pb-5">
        <h1 className="font-display text-2xl text-white mb-1">My Aquarium</h1>
        <p className="text-white/70 text-sm font-body">
          Track water parameters & health
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!identity && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-body text-amber-800">
                Log in to save your aquarium data
              </p>
              <p className="text-xs font-body text-amber-600 mt-1">
                Showing sample data
              </p>
            </CardContent>
          </Card>
        )}

        {/* Log Form Toggle */}
        <Button
          className="w-full ocean-gradient text-white font-body font-semibold"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Water Parameters
        </Button>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="shadow-card border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-lg">
                    New Water Log
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="font-body text-sm">
                        Temperature (°F)
                      </Label>
                      <Input
                        data-ocid="aquarium.temp.input"
                        type="number"
                        placeholder="78"
                        value={form.temperature}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            temperature: e.target.value,
                          }))
                        }
                        className="font-body"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-body text-sm">pH Level</Label>
                      <Input
                        data-ocid="aquarium.ph.input"
                        type="number"
                        step="0.1"
                        placeholder="7.0"
                        value={form.ph}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, ph: e.target.value }))
                        }
                        className="font-body"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-body text-sm">Ammonia (ppm)</Label>
                      <Input
                        data-ocid="aquarium.ammonia.input"
                        type="number"
                        step="0.01"
                        placeholder="0.0"
                        value={form.ammonia}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, ammonia: e.target.value }))
                        }
                        className="font-body"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-body text-sm">Nitrate (ppm)</Label>
                      <Input
                        data-ocid="aquarium.nitrate.input"
                        type="number"
                        placeholder="20"
                        value={form.nitrate}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, nitrate: e.target.value }))
                        }
                        className="font-body"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">Notes</Label>
                    <Textarea
                      placeholder="Any observations..."
                      value={form.notes}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, notes: e.target.value }))
                      }
                      className="font-body resize-none"
                      rows={2}
                    />
                  </div>
                  <Button
                    data-ocid="aquarium.log.submit_button"
                    onClick={handleSubmit}
                    disabled={addLog.isPending}
                    className="w-full ocean-gradient text-white font-body font-semibold"
                  >
                    {addLog.isPending ? "Saving..." : "Save Log"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logs History */}
        <div>
          <h2 className="font-display text-lg text-foreground mb-3">
            Parameter History
          </h2>
          {isLoading ? (
            <div className="space-y-3" data-ocid="aquarium.loading_state">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : displayLogs.length === 0 ? (
            <div className="text-center py-12" data-ocid="aquarium.empty_state">
              <Droplets className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-body text-muted-foreground">
                No water logs yet
              </p>
              <p className="font-body text-sm text-muted-foreground/60 mt-1">
                Add your first log above
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayLogs.map((log, index) => (
                <motion.div
                  key={log.id.toString()}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="shadow-card border-border/60">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-muted-foreground font-body font-medium">
                          {formatDate(log.timestamp)}
                        </p>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <ParamCard
                          label="Temp"
                          value={`${log.temperature}°`}
                          status={getTempStatus(log.temperature)}
                        />
                        <ParamCard
                          label="pH"
                          value={log.ph.toString()}
                          status={getPhStatus(log.ph)}
                        />
                        <ParamCard
                          label="NH₃"
                          value={`${log.ammonia}`}
                          status={getAmmoniaStatus(log.ammonia)}
                        />
                        <ParamCard
                          label="NO₃"
                          value={`${log.nitrate}`}
                          status={getNitrateStatus(log.nitrate)}
                        />
                      </div>
                      {log.notes && (
                        <p className="text-xs text-muted-foreground font-body italic">
                          {log.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ParamCard({
  label,
  value,
  status,
}: { label: string; value: string; status: ParamStatus }) {
  const { bg } = STATUS_STYLES[status];
  return (
    <div
      className={`rounded-lg p-2 text-center ${bg.split(" ")[0]} bg-opacity-20`}
    >
      <p className="text-xs text-muted-foreground font-body">{label}</p>
      <p className="text-sm font-semibold font-body">{value}</p>
    </div>
  );
}
