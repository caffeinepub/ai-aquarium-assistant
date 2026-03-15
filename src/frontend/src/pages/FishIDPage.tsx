import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Droplets,
  Fish,
  FlaskConical,
  Leaf,
  Ruler,
  Search,
  Thermometer,
  X,
} from "lucide-react";
import { useState } from "react";
import type { FishProfile } from "../backend.d";
import { fishDatabase, getFishPhoto, toFishProfile } from "../data/fishData";
import { useSearchFish } from "../hooks/useQueries";

const ALL_FISH: FishProfile[] = fishDatabase.map(toFishProfile);

interface FishDetailSheetProps {
  fish: FishProfile | null;
  onClose: () => void;
  onSetupGuide: (fish: FishProfile) => void;
}

function FishDetailSheet({
  fish,
  onClose,
  onSetupGuide,
}: FishDetailSheetProps) {
  if (!fish) return null;
  const photo = getFishPhoto(fish.name);
  return (
    <Sheet
      open={!!fish}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="bottom"
        className="h-[90dvh] rounded-t-2xl p-0"
        data-ocid="fishid.detail.sheet"
      >
        {photo && (
          <div className="w-full h-40 overflow-hidden">
            <img
              src={photo}
              alt={fish.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
        {!photo && (
          <div className="w-full h-24 ocean-gradient flex items-center justify-center">
            <Fish className="w-12 h-12 text-white/60" />
          </div>
        )}
        <SheetHeader className="p-5 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="font-display text-xl text-foreground">
                {fish.name}
              </SheetTitle>
              <p className="text-sm italic text-muted-foreground font-body">
                {fish.scientificName}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full -mt-1 -mr-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>
        <ScrollArea className="h-full px-5 pb-6">
          <div className="space-y-5 mt-4">
            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-primary/15 rounded-xl p-3 text-center">
                <Ruler className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground font-body">Tank</p>
                <p className="text-sm font-semibold font-body">
                  {fish.minTankSize.toString()}–{fish.maxTankSize.toString()}{" "}
                  gal
                </p>
              </div>
              <div className="bg-accent/15 rounded-xl p-3 text-center">
                <Thermometer className="w-4 h-4 text-accent mx-auto mb-1" />
                <p className="text-xs text-muted-foreground font-body">Temp</p>
                <p className="text-sm font-semibold font-body">
                  {fish.minTemp.toString()}–{fish.maxTemp.toString()}°F
                </p>
              </div>
              <div className="bg-secondary rounded-xl p-3 text-center">
                <Droplets className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground font-body">pH</p>
                <p className="text-sm font-semibold font-body">
                  {fish.minPH}–{fish.maxPH}
                </p>
              </div>
            </div>

            {/* Habitat */}
            <Section
              icon={<Fish className="w-4 h-4" />}
              title="Natural Habitat"
            >
              <p className="text-sm text-foreground/80 font-body leading-relaxed">
                {fish.habitat}
              </p>
            </Section>

            {/* Diet */}
            <Section icon={<FlaskConical className="w-4 h-4" />} title="Diet">
              <p className="text-sm text-foreground/80 font-body leading-relaxed">
                {fish.diet}
              </p>
            </Section>

            {/* Compatible */}
            {fish.compatibleWith.length > 0 && (
              <Section
                icon={<span className="text-base">✅</span>}
                title="Compatible Tank Mates"
              >
                <div className="flex flex-wrap gap-1.5">
                  {fish.compatibleWith.map((f) => (
                    <Badge
                      key={f}
                      className="bg-emerald-500/20 text-emerald-400 border-emerald-700 font-body text-xs"
                    >
                      {f}
                    </Badge>
                  ))}
                </div>
              </Section>
            )}

            {/* Incompatible */}
            {fish.incompatibleWith.length > 0 && (
              <Section
                icon={<span className="text-base">❌</span>}
                title="Avoid With"
              >
                <div className="flex flex-wrap gap-1.5">
                  {fish.incompatibleWith.map((f) => (
                    <Badge
                      key={f}
                      className="bg-red-500/20 text-red-400 border-red-700 font-body text-xs"
                    >
                      {f}
                    </Badge>
                  ))}
                </div>
              </Section>
            )}

            {/* Aquascape */}
            <Section icon={<Leaf className="w-4 h-4" />} title="Aquascape">
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground font-body uppercase tracking-wide mb-1">
                    Plants
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {fish.plants.map((p) => (
                      <Badge
                        key={p}
                        variant="secondary"
                        className="text-xs font-body"
                      >
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-foreground/80 font-body">
                  <span className="font-semibold">Substrate:</span>{" "}
                  {fish.substrate}
                </p>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground font-body uppercase tracking-wide mb-1">
                    Decorations
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {fish.decorations.map((d) => (
                      <Badge
                        key={d}
                        variant="outline"
                        className="text-xs font-body"
                      >
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* Setup */}
            <Section
              icon={<span className="text-base">⚙️</span>}
              title="Tank Setup"
            >
              <div className="space-y-2">
                <p className="text-sm font-body">
                  <span className="font-semibold">Filtration:</span>{" "}
                  {fish.filtration}
                </p>
                <p className="text-sm font-body">
                  <span className="font-semibold">Lighting:</span>{" "}
                  {fish.lighting}
                </p>
              </div>
            </Section>

            <Button
              className="w-full ocean-gradient text-white font-body font-semibold"
              onClick={() => {
                onSetupGuide(fish);
                onClose();
              }}
            >
              View Full Setup Guide
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function Section({
  icon,
  title,
  children,
}: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-primary">{icon}</span>
        <h3 className="font-body font-semibold text-foreground text-sm uppercase tracking-wide">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

interface FishIDPageProps {
  onSetupGuide?: (fish: FishProfile) => void;
}

export default function FishIDPage({ onSetupGuide }: FishIDPageProps) {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [selectedFish, setSelectedFish] = useState<FishProfile | null>(null);

  const { data: searchResults, isFetching } = useSearchFish(submitted);

  // For display: if searching, show backend results; if empty search, show all local fish
  const localResults = submitted
    ? ALL_FISH.filter(
        (f) =>
          f.name.toLowerCase().includes(submitted.toLowerCase()) ||
          f.scientificName.toLowerCase().includes(submitted.toLowerCase()),
      )
    : ALL_FISH;

  const results = submitted
    ? (searchResults ?? []).length > 0
      ? searchResults!
      : localResults
    : ALL_FISH;

  const showingDefault = !submitted;

  const handleSearch = () => {
    setSubmitted(query.trim());
  };

  return (
    <div className="flex flex-col h-full water-bg">
      {/* Header */}
      <div className="ocean-gradient px-4 pt-10 pb-5">
        <h1 className="font-display text-2xl text-white mb-1">
          Fish Identifier
        </h1>
        <p className="text-white/70 text-sm font-body">
          {ALL_FISH.length}+ species — search by common or scientific name
        </p>
      </div>

      {/* Search */}
      <div className="px-4 py-3 bg-card border-b border-border/60 sticky top-0 z-10">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="fishid.search_input"
              placeholder="Search by common or scientific name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 font-body bg-background"
            />
          </div>
          <Button
            data-ocid="fishid.search.submit_button"
            onClick={handleSearch}
            className="ocean-gradient text-white shrink-0"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {showingDefault && (
          <p className="text-xs text-muted-foreground font-body uppercase tracking-wide font-semibold">
            All Species ({ALL_FISH.length})
          </p>
        )}
        {isFetching && (
          <div className="space-y-3" data-ocid="fishid.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        )}
        {!isFetching && results.length === 0 && submitted && (
          <div className="text-center py-16" data-ocid="fishid.empty_state">
            <Fish className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-body text-muted-foreground">
              No fish found for "{submitted}"
            </p>
            <p className="font-body text-sm text-muted-foreground/60 mt-1">
              Try a different name or common name
            </p>
          </div>
        )}
        {!isFetching &&
          results.map((fish, index) => {
            const photo = getFishPhoto(fish.name);
            return (
              <div
                key={fish.id.toString()}
                data-ocid={`fishid.fish.item.${index + 1}`}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] border-border/60"
                  onClick={() => setSelectedFish(fish)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {photo ? (
                        <img
                          src={photo}
                          alt={fish.name}
                          className="w-11 h-11 rounded-xl object-cover shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = document.createElement("div");
                              fallback.className =
                                "w-11 h-11 rounded-xl ocean-gradient flex items-center justify-center shrink-0";
                              fallback.innerHTML =
                                '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 12c.94-3.46 4.94-6 10.5-6-3.5 1-6 5-6 6 0 1 2.5 5 6 6-5.56 0-9.56-2.54-10.5-6z"/><path d="M18 12h.01"/></svg>';
                              parent.insertBefore(fallback, target);
                            }
                          }}
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl ocean-gradient flex items-center justify-center shrink-0">
                          <Fish className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-body font-semibold text-foreground">
                          {fish.name}
                        </h3>
                        <p className="text-xs italic text-muted-foreground font-body truncate">
                          {fish.scientificName}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground font-body">
                          {fish.minTemp.toString()}–{fish.maxTemp.toString()}°F
                        </p>
                        <p className="text-xs text-muted-foreground font-body">
                          pH {fish.minPH}–{fish.maxPH}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2.5">
                      <Badge variant="secondary" className="text-xs font-body">
                        {fish.minTankSize.toString()}+ gal
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs font-body truncate max-w-[180px]"
                      >
                        {fish.diet.split("—")[0].trim()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
      </div>

      <FishDetailSheet
        fish={selectedFish}
        onClose={() => setSelectedFish(null)}
        onSetupGuide={(fish) => onSetupGuide?.(fish)}
      />
    </div>
  );
}
