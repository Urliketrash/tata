"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import defaultConfig from "@/data/config-default.json";

export type ConfigType = typeof defaultConfig;

interface ConfigContextProps {
  config: ConfigType;
  isLoading: boolean;
  refreshConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextProps | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ConfigType>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConfig = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await fetch("/api/config");
      if (response.ok) {
        const data = await response.json();
        // Simple comparison to prevent unnecessary state triggers
        if (JSON.stringify(data) !== JSON.stringify(config)) {
          setConfig(data);
        }
      }
    } catch (e) {
      console.error("Failed to load dynamic config, utilizing static local fallback", e);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchConfig();

    // Hot-reload synchronization polling: check for configuration updates every 5 seconds
    const interval = setInterval(() => {
      fetchConfig(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [config]);

  const refreshConfig = async () => {
    await fetchConfig(false);
  };

  return (
    <ConfigContext.Provider value={{ config, isLoading, refreshConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
