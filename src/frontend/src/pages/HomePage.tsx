import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  BookOpen,
  ChevronRight,
  Droplets,
  Fish,
  Sparkles,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const DAILY_TIPS = [
  "Perform a 25% water change weekly to maintain excellent water quality.",
  "Test your water parameters before adding new fish to the tank.",
  "Avoid overfeeding — uneaten food decomposes and spikes ammonia levels.",
  "Add beneficial bacteria starter to new tanks to speed up cycling.",
  "Quarantine new fish for 2 weeks before introducing them to your main tank.",
  "Live plants absorb nitrates and improve water quality naturally.",
  "Dim the lights gradually — sudden changes stress your fish.",
  "Clean your filter media in old tank water, never tap water.",
];

const QUICK_ACTIONS = [
  {
    id: "fishid",
    label: "Fish ID",
    desc: "Identify & explore species",
    icon: Fish,
    color: "from-blue-500/20 to-teal-500/20",
    iconColor: "text-primary",
  },
  {
    id: "aquarium",
    label: "My Aquarium",
    desc: "Track water parameters",
    icon: Droplets,
    color: "from-teal-500/20 to-cyan-500/20",
    iconColor: "text-accent",
  },
  {
    id: "reminders",
    label: "Reminders",
    desc: "Care schedule alerts",
    icon: Bell,
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-600",
  },
  {
    id: "learn",
    label: "Learn",
    desc: "Guides & tutorials",
    icon: BookOpen,
    color: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-600",
  },
  {
    id: "tools",
    label: "Tools",
    desc: "Problem solver & checker",
    icon: Wrench,
    color: "from-purple-500/20 to-violet-500/20",
    iconColor: "text-purple-600",
  },
];

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { identity } = useInternetIdentity();
  const todayTip = DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length];
  const userName = identity ? "Aquarist" : null;

  return (
    <div className="flex flex-col min-h-full water-bg">
      {/* Hero Banner */}
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="/assets/generated/aquarium-hero.dim_800x400.jpg"
          alt="Beautiful aquarium"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 ocean-gradient opacity-50" />
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-white/80 text-sm font-body font-medium tracking-wide uppercase mb-1">
              {userName ? `Welcome back, ${userName}` : "Welcome"}
            </p>
            <h1 className="font-display text-2xl text-white leading-tight">
              AI Aquarium
              <br />
              <span className="italic">Assistant</span>
            </h1>
          </motion.div>
        </div>
      </motion.div>

      <div className="flex-1 px-4 py-4 space-y-5">
        {/* Daily Tip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-accent/30 shadow-card bg-gradient-to-br from-accent/10 to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-full bg-accent/20">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-body font-semibold text-accent uppercase tracking-wider mb-1">
                    Daily Tip
                  </p>
                  <p className="text-sm text-foreground/80 font-body leading-relaxed">
                    {todayTip}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-display text-lg text-foreground mb-3">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index + 0.3 }}
                  className={index === 4 ? "col-span-2" : ""}
                >
                  <Card
                    className="cursor-pointer hover:shadow-card transition-all duration-200 active:scale-95 border-border/60"
                    onClick={() => onNavigate(action.id)}
                  >
                    <CardContent
                      className={`p-4 bg-gradient-to-br ${action.color} rounded-lg`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-white/60 shadow-xs">
                          <Icon className={`w-5 h-5 ${action.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-semibold text-foreground text-sm">
                            {action.label}
                          </p>
                          <p className="font-body text-xs text-muted-foreground truncate">
                            {action.desc}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Fish of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="font-display text-lg text-foreground mb-3">
            Featured Species
          </h2>
          <Card className="shadow-card border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full ocean-gradient flex items-center justify-center animate-float">
                  <Fish className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-base text-foreground">
                    Betta splendens
                  </h3>
                  <p className="text-xs text-muted-foreground font-body">
                    Siamese Fighting Fish
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Tank", value: "10+ gal" },
                  { label: "Temp", value: "76-82°F" },
                  { label: "pH", value: "6.5-7.5" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-secondary/50 rounded-lg p-2 text-center"
                  >
                    <p className="text-xs text-muted-foreground font-body">
                      {stat.label}
                    </p>
                    <p className="text-sm font-semibold text-foreground font-body">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-xs font-body">
                  Beginner Friendly
                </Badge>
                <Badge variant="secondary" className="text-xs font-body">
                  Solitary
                </Badge>
                <Badge variant="secondary" className="text-xs font-body">
                  Colorful
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-3 text-center border-t border-border/40">
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="text-accent hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
