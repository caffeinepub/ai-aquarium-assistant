import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Bug, Droplets, Leaf, Recycle } from "lucide-react";
import { motion } from "motion/react";

const LEARN_TOPICS = [
  {
    id: "cycling",
    icon: Recycle,
    color: "text-blue-500",
    bg: "bg-blue-50",
    title: "Aquarium Cycling",
    badge: "Essential",
    badgeColor: "bg-blue-100 text-blue-700",
    content: [
      {
        heading: "What is the Nitrogen Cycle?",
        text: "The nitrogen cycle is the biological process that converts harmful fish waste (ammonia) into less toxic substances. Fish produce ammonia through respiration and waste. Beneficial bacteria convert ammonia to nitrite, then other bacteria convert nitrite to nitrate.",
      },
      {
        heading: "New Tank Syndrome",
        text: "New tanks lack beneficial bacteria colonies. Adding fish too soon leads to toxic ammonia and nitrite spikes that can kill fish within days. This is the #1 cause of fish death for beginners.",
      },
      {
        heading: "How to Cycle Your Tank",
        text: "Add ammonia source (fish food, pure ammonia, or a few hardy fish). Test water every 2-3 days. Wait for ammonia to spike, then decline. Nitrites will spike next, then decline. When both read 0 ppm with nitrates present, cycling is complete (typically 4-8 weeks).",
      },
      {
        heading: "Speed Up Cycling",
        text: "Use a bacterial starter product (e.g., Seachem Stability, Dr. Tim's). Add filter media or substrate from an established tank. Keep water at 80-82°F to accelerate bacterial growth. Maintain pH above 7.0 — acidic water slows nitrification.",
      },
    ],
  },
  {
    id: "diseases",
    icon: Bug,
    color: "text-red-500",
    bg: "bg-red-50",
    title: "Common Fish Diseases",
    badge: "Health",
    badgeColor: "bg-red-100 text-red-700",
    content: [
      {
        heading: "Ich (White Spot Disease)",
        text: "Symptoms: Salt-like white spots on fins/body, fish rubbing against surfaces, lethargy. Cause: Ichthyophthirius multifiliis parasite. Treatment: Raise temp to 86°F, add aquarium salt, use ich medication (Ich-X or Kordon Rid-Ich+). Remove carbon from filter during treatment.",
      },
      {
        heading: "Fin Rot",
        text: "Symptoms: Frayed, ragged, or discolored fin edges, milky appearance. Cause: Bacterial infection (often from poor water quality). Treatment: Improve water quality immediately (30% water change), add aquarium salt, use antibiotic like Kanaplex or Fin & Body Cure.",
      },
      {
        heading: "Velvet Disease",
        text: "Symptoms: Gold or rust-colored dust-like coating, scratching, rapid gill movement. Cause: Oodinium parasites. Treatment: Darken the tank (parasites need light), add copper-based medication. Very contagious — quarantine affected fish immediately.",
      },
      {
        heading: "Swim Bladder Disorder",
        text: "Symptoms: Fish swims sideways, upside-down, or struggles to maintain depth. Cause: Overfeeding, constipation, infection. Treatment: Fast the fish for 2-3 days, then feed cooked deshelled peas. For infections, use Epsom salt baths (1 tsp/gallon for 15 min).",
      },
      {
        heading: "Columnaris (Cotton Mouth)",
        text: "Symptoms: White or gray fuzzy patches on mouth, fins, or body. Cause: Bacterial infection. Treatment: Salt baths, antibiotic treatment with Kanaplex or Furan-2. Highly contagious — treat entire tank.",
      },
    ],
  },
  {
    id: "maintenance",
    icon: Droplets,
    color: "text-teal-500",
    bg: "bg-teal-50",
    title: "Tank Maintenance Guide",
    badge: "Care",
    badgeColor: "bg-teal-100 text-teal-700",
    content: [
      {
        heading: "Weekly Tasks",
        text: "Perform a 25-30% water change. Vacuum substrate with a gravel siphon. Clean glass algae with magnetic scraper. Check all equipment (heater, filter, lights). Trim fast-growing plants. Test water parameters (pH, ammonia, nitrite, nitrate).",
      },
      {
        heading: "Monthly Tasks",
        text: "Clean filter media in old tank water (never tap water — chlorine kills beneficial bacteria). Prune and replant aquatic plants. Deep clean substrate in planted sections. Check heater calibration with a separate thermometer. Inspect all equipment for wear.",
      },
      {
        heading: "Water Change Protocol",
        text: "Always dechlorinate new water with a quality conditioner (Seachem Prime or API Stress Coat). Match new water temperature to tank temperature within 2°F. Siphon from substrate to remove waste. Never change more than 50% at once — it disrupts bacterial colonies and chemistry.",
      },
      {
        heading: "Gravel Vacuuming",
        text: "Push the vacuum tube into substrate 1-2 inches while siphoning. Work in a grid pattern to cover the whole tank over several sessions. For planted tanks, vacuum only open areas — don't disturb root zones. Use a turkey baster for tight spots.",
      },
    ],
  },
  {
    id: "aquascaping",
    icon: Leaf,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    title: "Aquascaping Tips",
    badge: "Design",
    badgeColor: "bg-emerald-100 text-emerald-700",
    content: [
      {
        heading: "The Rule of Thirds",
        text: "Divide your tank into a 3x3 grid (like photography). Place focal points at intersections, not the center. The main hardscape (rock or driftwood) should occupy one-third. Leave empty space for fish to swim — negative space is as important as planted areas.",
      },
      {
        heading: "Foreground Plants",
        text: "Use low-growing plants (under 5 cm) in the front: Dwarf Hairgrass, Monte Carlo, Glossostigma, Java Moss carpets. These create depth and a natural 'floor.' Good lighting and CO2 supplementation help carpet plants spread.",
      },
      {
        heading: "Midground & Background",
        text: "Midground (5-20 cm): Anubias, Cryptocoryne, Amazon Sword. Background (20+ cm): Vallisneria, Cabomba, Hornwort. Tall background plants hide equipment and create a lush backdrop. Plant in odd-numbered groups (3, 5, 7) for a natural look.",
      },
      {
        heading: "Hardscape — Rocks & Driftwood",
        text: "Use odd numbers of rocks for natural composition. Test rocks with vinegar — bubbling means calcium carbonate, which raises pH. Driftwood leaches tannins (blackens water, lowers pH) — soak for 1-2 weeks before use or boil for 30 minutes. Mopani wood leeches for longer.",
      },
      {
        heading: "Dutch Style vs Iwagumi",
        text: "Dutch: Dense, colorful plant streets with strict height rules — impressive but complex. Iwagumi: Minimalist with rocks, carpet plants, and negative space — zen and geometric. Nature Aquarium (Takashi Amano's style): naturalistic scenes mimicking landscapes. Choose one and commit to its rules.",
      },
    ],
  },
];

export default function LearnPage() {
  return (
    <div className="flex flex-col h-full water-bg">
      <div className="ocean-gradient px-4 pt-10 pb-5">
        <h1 className="font-display text-2xl text-white mb-1">Learn</h1>
        <p className="text-white/70 text-sm font-body">
          Guides for healthy, beautiful aquariums
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <Accordion type="single" collapsible className="space-y-3">
          {LEARN_TOPICS.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem
                  value={topic.id}
                  className="bg-card rounded-xl border border-border/60 shadow-card px-0 overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-4 hover:no-underline [&[data-state=open]]:bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${topic.bg}`}>
                        <Icon className={`w-5 h-5 ${topic.color}`} />
                      </div>
                      <div className="text-left">
                        <p className="font-body font-semibold text-foreground text-sm">
                          {topic.title}
                        </p>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-body font-semibold mt-0.5 ${topic.badgeColor}`}
                        >
                          {topic.badge}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4 pt-2">
                      {topic.content.map((section) => (
                        <div key={section.heading}>
                          <h4 className="font-body font-semibold text-foreground text-sm mb-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                            {section.heading}
                          </h4>
                          <p className="text-sm text-foreground/75 font-body leading-relaxed">
                            {section.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            );
          })}
        </Accordion>

        <div className="h-4" />
      </div>
    </div>
  );
}
