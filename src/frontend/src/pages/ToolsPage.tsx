import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  CheckCircle,
  Fish,
  Loader2,
  Plus,
  Wrench,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { checkFishCompatibility } from "../data/fishData";

// Problem solver keyword map
interface Diagnosis {
  condition: string;
  causes: string[];
  solutions: string[];
  urgency: "high" | "medium" | "low";
}

const PROBLEM_MAP: Array<{ keywords: string[]; diagnosis: Diagnosis }> = [
  {
    keywords: ["cloudy", "milky", "murky", "foggy"],
    diagnosis: {
      condition: "Bacterial Bloom / Cloudy Water",
      causes: [
        "New tank cycling (bacterial bloom)",
        "Overfeeding causing decomposition",
        "Overstocking",
        "Insufficient filtration",
      ],
      solutions: [
        "Perform a 30% water change immediately",
        "Reduce feeding to once daily, remove uneaten food after 5 minutes",
        "Check filter is working and clean media",
        "Add activated carbon to filter",
        "Do not add fish during a bloom",
      ],
      urgency: "medium",
    },
  },
  {
    keywords: ["not eating", "won't eat", "refusing food", "lost appetite"],
    diagnosis: {
      condition: "Loss of Appetite",
      causes: [
        "Stress from new environment or tank mates",
        "Incorrect water temperature or parameters",
        "Disease or internal parasites",
        "Wrong food type for species",
        "Overfeeding leading to satiation",
      ],
      solutions: [
        "Check water temperature and parameters immediately",
        "Try different food types (live, frozen, pellets)",
        "Fast the fish for 1-2 days, then offer favorite foods",
        "Check for signs of disease or bullying tank mates",
        "Ensure stable water conditions",
      ],
      urgency: "medium",
    },
  },
  {
    keywords: [
      "swimming sideways",
      "swimming upside",
      "floating",
      "sinking",
      "swim bladder",
      "balance",
    ],
    diagnosis: {
      condition: "Swim Bladder Disorder",
      causes: [
        "Overfeeding or constipation",
        "Bacterial infection of swim bladder",
        "Physical injury",
        "Parasites",
      ],
      solutions: [
        "Fast the fish for 2-3 days",
        "Feed cooked, deshelled peas (acts as laxative)",
        "Try Epsom salt bath (1 tsp per gallon, 10-15 minutes)",
        "If infection suspected, use antibiotic treatment",
        "Ensure varied diet going forward",
      ],
      urgency: "medium",
    },
  },
  {
    keywords: ["white spots", "white dots", "ich", "ick", "salt", "spots"],
    diagnosis: {
      condition: "Ich (Ichthyophthirius multifiliis)",
      causes: [
        "Parasitic infection from Ich parasite",
        "Introduced via new fish without quarantine",
        "Stress weakening immune system",
      ],
      solutions: [
        "Raise temperature to 86°F (30°C) for 10 days — kills parasite lifecycle",
        "Add aquarium salt (1 tsp/gallon)",
        "Use Ich-X or Kordon Rid-Ich+ medication",
        "Remove carbon from filter during treatment",
        "Quarantine affected fish",
        "Treat entire tank",
      ],
      urgency: "high",
    },
  },
  {
    keywords: [
      "fin rot",
      "ragged fins",
      "torn fins",
      "frayed",
      "fins disappearing",
    ],
    diagnosis: {
      condition: "Fin Rot (Bacterial)",
      causes: [
        "Poor water quality (high ammonia/nitrate)",
        "Bacterial infection",
        "Injury from fin-nipping tank mates",
      ],
      solutions: [
        "Perform immediate 30-40% water change",
        "Test all water parameters and correct issues",
        "Use antibiotic like Kanaplex or API Fin & Body Cure",
        "Add aquarium salt (1-3 tsp/gallon)",
        "Remove aggressive tank mates",
        "Treat for 5-7 days",
      ],
      urgency: "high",
    },
  },
  {
    keywords: ["gasping", "surface", "breathing fast", "rapid gill", "oxygen"],
    diagnosis: {
      condition: "Low Oxygen / Ammonia Poisoning",
      causes: [
        "Low dissolved oxygen (insufficient surface agitation)",
        "Ammonia spike from overfeeding or new tank",
        "Gill flukes or disease",
        "High nitrite levels",
      ],
      solutions: [
        "Increase surface agitation immediately (add airstone or adjust filter output)",
        "Test ammonia and nitrite levels",
        "Perform emergency 50% water change if ammonia > 0.5 ppm",
        "Add Seachem Prime to detoxify ammonia",
        "Reduce fish load or feeding",
      ],
      urgency: "high",
    },
  },
  {
    keywords: [
      "lethargic",
      "sluggish",
      "slow",
      "inactive",
      "hiding",
      "listless",
    ],
    diagnosis: {
      condition: "General Lethargy / Stress",
      causes: [
        "Poor water quality",
        "Temperature shock or wrong temperature",
        "Disease (early stage)",
        "Bully tank mates causing stress",
        "Insufficient hiding spots",
      ],
      solutions: [
        "Test all water parameters immediately",
        "Check temperature and adjust to species needs",
        "Observe for other symptoms (white spots, fin rot, bloating)",
        "Ensure adequate hiding spots",
        "Check for aggressive tank mates",
      ],
      urgency: "medium",
    },
  },
  {
    keywords: [
      "bloated",
      "swollen",
      "dropsy",
      "pinecone",
      "scales sticking out",
    ],
    diagnosis: {
      condition: "Dropsy / Bloating",
      causes: [
        "Bacterial kidney infection (dropsy is a symptom, not disease)",
        "Constipation from overfeeding",
        "Tumor (rare)",
        "Poor water quality weakening immune system",
      ],
      solutions: [
        "Isolate fish in quarantine tank immediately",
        "Treat with Kanaplex (Kanamycin antibiotic)",
        "Add Epsom salt (1 tsp/gallon) to quarantine tank to reduce swelling",
        "Fast constipated fish for 3 days, then offer peas",
        "Note: dropsy is often fatal if scales are raised",
      ],
      urgency: "high",
    },
  },
  {
    keywords: ["aggressive", "fighting", "chasing", "biting", "bullying"],
    diagnosis: {
      condition: "Aggression & Territorial Conflict",
      causes: [
        "Overcrowding or too-small tank",
        "Territorial species competition",
        "Incompatible species combination",
        "Males competing for mates",
        "Insufficient hiding spaces",
      ],
      solutions: [
        "Rearrange decorations to break up territories",
        "Add more hiding spots, plants, and visual barriers",
        "Consider separating incompatible species",
        "Ensure tank is large enough for all fish",
        "Use the compatibility checker to verify species compatibility",
      ],
      urgency: "medium",
    },
  },
  {
    keywords: ["algae", "green water", "green glass", "slime"],
    diagnosis: {
      condition: "Algae Overgrowth",
      causes: [
        "Excess light duration (>10 hours/day)",
        "High nitrate and phosphate levels",
        "Insufficient plant competition",
        "Direct sunlight on tank",
      ],
      solutions: [
        "Reduce lighting to 6-8 hours/day",
        "Perform water change to reduce nutrients",
        "Add algae eaters (Otocinclus, Nerite snails, Siamese Algae Eater)",
        "Add fast-growing plants to compete with algae",
        "Clean glass with magnetic scraper",
      ],
      urgency: "low",
    },
  },
];

const URGENCY_STYLES = {
  high: {
    bg: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
  medium: {
    bg: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
  low: {
    bg: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

function analyzeProblem(description: string): Diagnosis | null {
  const lower = description.toLowerCase();
  for (const { keywords, diagnosis } of PROBLEM_MAP) {
    if (keywords.some((k) => lower.includes(k))) {
      return diagnosis;
    }
  }
  return null;
}

function ProblemSolver() {
  const [problem, setProblem] = useState("");
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null | "none">(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!problem.trim()) {
      toast.error("Please describe your problem");
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeProblem(problem);
      setDiagnosis(result ?? "none");
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="font-body text-sm font-semibold">
          Describe your problem
        </Label>
        <Textarea
          data-ocid="tools.problem.textarea"
          placeholder="e.g. My betta has white spots and is rubbing against the decorations..."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="font-body resize-none min-h-[100px]"
          rows={4}
        />
        <p className="text-xs text-muted-foreground font-body">
          Describe symptoms: fish behavior, water appearance, signs of
          disease...
        </p>
      </div>

      <Button
        data-ocid="tools.problem.submit_button"
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        className="w-full ocean-gradient text-white font-body font-semibold"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
          </>
        ) : (
          <>
            <Brain className="w-4 h-4 mr-2" /> Analyze Problem
          </>
        )}
      </Button>

      <AnimatePresence>
        {diagnosis && diagnosis !== "none" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className={`border ${URGENCY_STYLES[diagnosis.urgency].bg}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${URGENCY_STYLES[diagnosis.urgency].dot}`}
                  />
                  <h3 className="font-body font-bold text-foreground">
                    {diagnosis.condition}
                  </h3>
                  <span
                    className={`ml-auto px-2 py-0.5 rounded-full text-xs font-body font-semibold ${URGENCY_STYLES[diagnosis.urgency].badge}`}
                  >
                    {diagnosis.urgency === "high"
                      ? "Urgent"
                      : diagnosis.urgency === "medium"
                        ? "Monitor"
                        : "Low Priority"}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Possible Causes
                  </p>
                  <ul className="space-y-1">
                    {diagnosis.causes.map((c) => (
                      <li
                        key={c}
                        className="text-sm font-body text-foreground/80 flex gap-2"
                      >
                        <span className="text-muted-foreground mt-0.5">•</span>{" "}
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Recommended Actions
                  </p>
                  <ul className="space-y-1.5">
                    {diagnosis.solutions.map((s, idx) => (
                      <li
                        key={s}
                        className="text-sm font-body text-foreground/80 flex gap-2"
                      >
                        <span className="text-accent font-bold shrink-0">
                          {idx + 1}.
                        </span>{" "}
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {diagnosis === "none" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-border/60">
              <CardContent className="p-4 text-center">
                <Brain className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="font-body text-muted-foreground text-sm">
                  No specific diagnosis found. Try describing symptoms more
                  specifically, or consult a veterinarian.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompatibilityChecker() {
  const [fishInput, setFishInput] = useState("");
  const [fishList, setFishList] = useState<string[]>([]);
  const [result, setResult] = useState<{
    compatible: boolean;
    conflicts: Array<[string, string]>;
  } | null>(null);

  const addFish = () => {
    const name = fishInput.trim();
    if (!name) return;
    if (fishList.includes(name)) {
      toast.error("Fish already added");
      return;
    }
    setFishList((p) => [...p, name]);
    setFishInput("");
    setResult(null);
  };

  const removeFish = (name: string) => {
    setFishList((p) => p.filter((f) => f !== name));
    setResult(null);
  };

  const handleCheck = () => {
    if (fishList.length < 2) {
      toast.error("Add at least 2 fish to check compatibility");
      return;
    }
    const res = checkFishCompatibility(fishList);
    setResult(res);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="font-body text-sm font-semibold">
          Add Fish Species
        </Label>
        <div className="flex gap-2">
          <Input
            data-ocid="tools.compat.input"
            placeholder="e.g. Neon Tetra"
            value={fishInput}
            onChange={(e) => setFishInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addFish()}
            className="font-body flex-1"
          />
          <Button
            data-ocid="tools.compat.add_button"
            onClick={addFish}
            variant="outline"
            className="shrink-0 font-body"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {fishList.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {fishList.map((fish) => (
            <Badge
              key={fish}
              variant="secondary"
              className="font-body text-sm px-3 py-1.5 gap-1.5 cursor-pointer hover:bg-destructive/10"
              onClick={() => removeFish(fish)}
            >
              <Fish className="w-3 h-3" />
              {fish}
              <X className="w-3 h-3 ml-0.5" />
            </Badge>
          ))}
        </div>
      )}

      {fishList.length === 0 && (
        <div
          className="py-8 text-center border-2 border-dashed border-border/60 rounded-xl"
          data-ocid="tools.compat.empty_state"
        >
          <Fish className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm font-body text-muted-foreground">
            Add fish to check compatibility
          </p>
        </div>
      )}

      <Button
        data-ocid="tools.compat.check_button"
        onClick={handleCheck}
        disabled={fishList.length < 2}
        className="w-full ocean-gradient text-white font-body font-semibold disabled:opacity-50"
      >
        "Check Compatibility"
      </Button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card
              className={`border ${
                result.compatible
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  {result.compatible ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <h3 className="font-body font-bold text-foreground">
                    {result.compatible ? "Compatible! ✓" : "Conflicts Found"}
                  </h3>
                </div>

                {result.compatible ? (
                  <p className="text-sm font-body text-emerald-700">
                    These fish can live together peacefully. Ensure adequate
                    tank size and hiding spots.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-body text-red-700 mb-3">
                      The following conflicts were detected:
                    </p>
                    {result.conflicts.map(([a, b]) => (
                      <div
                        key={`${a}-${b}`}
                        className="flex items-center gap-2 bg-red-100 rounded-lg p-2"
                      >
                        <span className="text-sm font-body font-semibold text-red-800">
                          {a}
                        </span>
                        <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="text-sm font-body font-semibold text-red-800">
                          {b}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <div className="flex flex-col h-full water-bg">
      <div className="ocean-gradient px-4 pt-10 pb-5">
        <h1 className="font-display text-2xl text-white mb-1">Tools</h1>
        <p className="text-white/70 text-sm font-body">
          Problem solver & compatibility checker
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="problem" className="h-full">
          <TabsList className="w-full rounded-none border-b border-border/60 bg-card h-12 px-4 gap-2">
            <TabsTrigger
              value="problem"
              className="flex-1 font-body text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg"
            >
              AI Problem Solver
            </TabsTrigger>
            <TabsTrigger
              value="compat"
              className="flex-1 font-body text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg"
            >
              Compatibility
            </TabsTrigger>
          </TabsList>
          <TabsContent value="problem" className="p-4 mt-0">
            <ProblemSolver />
          </TabsContent>
          <TabsContent value="compat" className="p-4 mt-0">
            <CompatibilityChecker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
