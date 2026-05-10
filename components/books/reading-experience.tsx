"use client";

import type { CSSProperties, ReactNode } from "react";
import { BookOpenText, Columns3, Eye, MessageSquareText, Pilcrow, Text } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";

type ReadingExperienceFrameProps = {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
};

type SanskritScale = "calm" | "large" | "manuscript";
type LineRhythm = "measured" | "open";

const STORAGE_KEY = "bhagwatsharanpriy:reading-preferences";

type ReadingPreferences = {
  focus: boolean;
  sanskritScale: SanskritScale;
  lineRhythm: LineRhythm;
  showTransliteration: boolean;
  showCommentary: boolean;
  darkParchment: boolean;
};

const defaultPreferences: ReadingPreferences = {
  focus: false,
  sanskritScale: "large",
  lineRhythm: "measured",
  showTransliteration: true,
  showCommentary: true,
  darkParchment: false,
};

export function ReadingExperienceFrame({ sidebar, children, className }: ReadingExperienceFrameProps) {
  const [preferences, setPreferences] = useState<ReadingPreferences>(defaultPreferences);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setPreferences({ ...defaultPreferences, ...(JSON.parse(saved) as Partial<ReadingPreferences>) });
      }
    } catch {
      setPreferences(defaultPreferences);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences, ready]);

  const style = useMemo(
    () =>
      ({
        "--scripture-scale":
          preferences.sanskritScale === "calm"
            ? "clamp(1.85rem, 6vw, 2.35rem)"
            : preferences.sanskritScale === "manuscript"
              ? "clamp(2.25rem, 7vw, 3rem)"
              : "clamp(2rem, 6.4vw, 2.65rem)",
        "--scripture-leading": preferences.lineRhythm === "open" ? "1.95" : "1.78",
        "--reading-copy-leading": preferences.lineRhythm === "open" ? "2" : "1.82",
      }) as CSSProperties,
    [preferences.lineRhythm, preferences.sanskritScale],
  );

  function updatePreference<K extends keyof ReadingPreferences>(key: K, value: ReadingPreferences[K]) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  return (
    <div
      className={cn(
        "reading-frame",
        preferences.focus && "reading-focus-frame",
        !preferences.showTransliteration && "reading-hide-transliteration",
        !preferences.showCommentary && "reading-hide-commentary",
        preferences.darkParchment && "reading-dark-parchment",
        className,
      )}
      style={style}
    >
      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 px-1">
          <BookOpenText className="size-4 text-primary" aria-hidden="true" />
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Reading mode</p>
            <p className="font-serif text-lg font-semibold">Resume contemplation</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PreferenceToggle
            active={preferences.focus}
            label="Focus"
            icon={<Eye className="size-4" aria-hidden="true" />}
            onClick={() => updatePreference("focus", !preferences.focus)}
          />
          <PreferenceSelect
            label="Text"
            icon={<Text className="size-4" aria-hidden="true" />}
            value={preferences.sanskritScale}
            options={[
              ["calm", "Calm"],
              ["large", "Large"],
              ["manuscript", "Manuscript"],
            ]}
            onChange={(value) => updatePreference("sanskritScale", value as SanskritScale)}
          />
          <PreferenceSelect
            label="Lines"
            icon={<Pilcrow className="size-4" aria-hidden="true" />}
            value={preferences.lineRhythm}
            options={[
              ["measured", "Measured"],
              ["open", "Open"],
            ]}
            onChange={(value) => updatePreference("lineRhythm", value as LineRhythm)}
          />
          <PreferenceToggle
            active={preferences.showTransliteration}
            label="Transliteration"
            icon={<Columns3 className="size-4" aria-hidden="true" />}
            onClick={() => updatePreference("showTransliteration", !preferences.showTransliteration)}
          />
          <PreferenceToggle
            active={preferences.showCommentary}
            label="Commentary"
            icon={<MessageSquareText className="size-4" aria-hidden="true" />}
            onClick={() => updatePreference("showCommentary", !preferences.showCommentary)}
          />
          <PreferenceToggle
            active={preferences.darkParchment}
            label="Night"
            onClick={() => updatePreference("darkParchment", !preferences.darkParchment)}
          />
        </div>
      </div>

      <div
        className={cn(
          "grid gap-8 lg:items-start",
          preferences.focus ? "lg:grid-cols-[minmax(0,760px)] lg:justify-center" : "lg:grid-cols-[280px_minmax(0,820px)]",
        )}
      >
        <aside className={cn("lg:sticky lg:top-24", preferences.focus && "hidden")}>{sidebar}</aside>
        {children}
      </div>
    </div>
  );
}

function PreferenceToggle({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "focus-ring-calm inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors",
        active
          ? "border-primary/60 bg-primary/15 text-foreground"
          : "border-border bg-background text-muted-foreground hover:border-primary/45 hover:text-foreground",
      )}
      aria-pressed={active}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function PreferenceSelect({
  label,
  icon,
  value,
  options,
  onChange,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-primary/45">
      {icon}
      <span className="sr-only">{label}</span>
      <select
        value={value}
        className="bg-transparent text-sm font-medium text-foreground outline-none"
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
