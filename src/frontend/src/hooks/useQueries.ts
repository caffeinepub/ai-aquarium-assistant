import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FishProfile, Reminder, WaterLog } from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useSearchFish(searchTerm: string) {
  const { actor, isFetching } = useActor();
  return useQuery<FishProfile[]>({
    queryKey: ["fish", "search", searchTerm],
    queryFn: async () => {
      if (!actor || !searchTerm.trim()) return [];
      return actor.searchFishByName(searchTerm);
    },
    enabled: !!actor && !isFetching && searchTerm.trim().length > 0,
  });
}

export function useCheckCompatibility() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (fishNames: string[]) => {
      if (!actor) throw new Error("Not connected");
      return actor.checkCompatibility(fishNames);
    },
  });
}

export function useWaterLogs(principal: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<WaterLog[]>({
    queryKey: ["waterLogs", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getWaterLogs(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useAddWaterLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (log: WaterLog) => {
      if (!actor) throw new Error("Not connected");
      return actor.addWaterLog(log);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waterLogs"] });
    },
  });
}

export function useReminders(principal: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Reminder[]>({
    queryKey: ["reminders", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getReminders(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useAddReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      reminderType: string;
      title: string;
      description: string;
      frequencyDays: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addReminder(
        params.reminderType,
        params.title,
        params.description,
        params.frequencyDays,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

export { useInternetIdentity };
