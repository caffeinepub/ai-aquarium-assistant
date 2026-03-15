import { Toaster } from "@/components/ui/sonner";
import {
  Bell,
  BookOpen,
  Droplets,
  Fish,
  Home,
  UserCircle,
  Users,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { FishProfile } from "./backend.d";
import AquariumPage from "./pages/AquariumPage";
import CommunityPage from "./pages/CommunityPage";
import FishIDPage from "./pages/FishIDPage";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import ProfilePage from "./pages/ProfilePage";
import RemindersPage from "./pages/RemindersPage";
import ToolsPage from "./pages/ToolsPage";

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "fishid", label: "Fish ID", icon: Fish },
  { id: "aquarium", label: "Aquarium", icon: Droplets },
  { id: "reminders", label: "Reminders", icon: Bell },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "community", label: "Community", icon: Users },
  { id: "profile", label: "Profile", icon: UserCircle },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [_setupFish, _setSetupFish] = useState<FishProfile | null>(null);

  const handleSetupGuide = (fish: FishProfile) => {
    _setSetupFish(fish);
    setActiveTab("aquarium");
  };

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage onNavigate={(tab) => setActiveTab(tab as TabId)} />;
      case "fishid":
        return <FishIDPage onSetupGuide={handleSetupGuide} />;
      case "aquarium":
        return <AquariumPage />;
      case "reminders":
        return <RemindersPage />;
      case "learn":
        return <LearnPage />;
      case "tools":
        return <ToolsPage />;
      case "community":
        return <CommunityPage />;
      case "profile":
        return <ProfilePage />;
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-black">
      <div
        className="relative flex flex-col w-full max-w-[430px] min-h-screen bg-background shadow-2xl overflow-hidden"
        style={{ height: "100dvh" }}
      >
        {/* Page Content */}
        <main className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-y-auto">{renderPage()}</div>
        </main>

        {/* Bottom Navigation */}
        <nav className="shrink-0 bg-card border-t border-border/60 shadow-[0_-2px_12px_rgba(0,0,0,0.3)] safe-area-bottom">
          <div className="flex items-stretch">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  data-ocid={`nav.${tab.id}.link`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center flex-1 py-2 px-0.5 min-h-[56px] gap-0.5 transition-all duration-150 relative ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                  <Icon
                    className={`w-4 h-4 transition-transform duration-150 ${
                      isActive ? "scale-110" : ""
                    }`}
                  />
                  <span
                    className={`text-[9px] font-body font-medium leading-none ${
                      isActive ? "font-semibold" : ""
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <Toaster position="top-center" richColors />
      </div>
    </div>
  );
}
