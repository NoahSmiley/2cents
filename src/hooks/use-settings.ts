// src/hooks/use-settings.ts
import { useSyncExternalStore } from "react"
import SettingsStore, { type Settings } from "@/lib/settings"

export function useSettings(): Settings {
  return useSyncExternalStore(
    SettingsStore.subscribe,
    SettingsStore.get,
    SettingsStore.get
  )
}
