"use client";

import { Settings } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type FontKey, fontOptions } from "@/lib/fonts/registry";
import type { ContentLayout, NavbarStyle, SidebarCollapsible, SidebarVariant } from "@/lib/preferences/layout";
import { THEME_PRESET_OPTIONS, type ThemeMode, type ThemePreset } from "@/lib/preferences/theme";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export function LayoutControls() {
  const { values, resolvedThemeMode, setPreference, resetPreferences } = usePreferencesStore(
    useShallow((state) => ({
      values: state.values,
      resolvedThemeMode: state.resolvedThemeMode,
      setPreference: state.setPreference,
      resetPreferences: state.resetPreferences,
    })),
  );

  const {
    theme_mode: themeMode,
    theme_preset: themePreset,
    content_layout: contentLayout,
    navbar_style: navbarStyle,
    sidebar_variant: variant,
    sidebar_collapsible: collapsible,
    font,
  } = values;

  const onThemePresetChange = (preset: ThemePreset) => {
    setPreference("theme_preset", preset);
  };

  const onFontChange = (value: FontKey | "") => {
    if (!value) return;
    setPreference("font", value);
  };

  return (
    <PopoverTrigger>
      <Button size="icon" aria-label="Open preferences">
        <Settings />
      </Button>
      <Popover placement="bottom end">
        <div className="flex flex-col gap-5">
          <PopoverHeader>
            <PopoverTitle>Preferences</PopoverTitle>
            <PopoverDescription className="text-xs">Customize your dashboard layout preferences.</PopoverDescription>
          </PopoverHeader>
          <div className="space-y-3 **:data-[slot=toggle-group]:w-full **:data-[slot=toggle-group-item]:flex-1 **:data-[slot=toggle-group-item]:text-xs">
            <div className="space-y-1">
              <Label className="font-medium text-xs">Theme Preset</Label>
              <Select
                aria-label="Theme Preset"
                placeholder="Preset"
                value={themePreset}
                onChange={(key) => {
                  if (key == null) return;
                  onThemePresetChange(key as ThemePreset);
                }}
              >
                <SelectTrigger size="sm" className="w-full text-xs">
                  <SelectValue className="items-center" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {THEME_PRESET_OPTIONS.map((preset) => (
                      <SelectItem key={preset.value} id={preset.value} textValue={preset.label} className="text-xs">
                        <span className="flex items-center gap-2">
                          <span
                            className="size-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                resolvedThemeMode === "dark" ? preset.primary.dark : preset.primary.light,
                            }}
                          />
                          {preset.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="font-medium text-xs">Fonts</Label>
              <Select
                aria-label="Fonts"
                placeholder="Select font"
                value={font}
                onChange={(key) => {
                  if (key == null) return;
                  onFontChange(key as FontKey);
                }}
              >
                <SelectTrigger size="sm" className="w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.key} id={font.key} className="text-xs">
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="font-medium text-xs">Theme Mode</Label>
              <ToggleGroup
                aria-label="Theme Mode"
                selectionMode="single"
                disallowEmptySelection
                size="sm"
                spacing={0}
                variant="outline"
                selectedKeys={[themeMode]}
                onSelectionChange={([mode]) => {
                  if (!mode) return;
                  setPreference("theme_mode", mode as ThemeMode);
                }}
              >
                <ToggleGroupItem id="light" aria-label="Toggle light">
                  Light
                </ToggleGroupItem>
                <ToggleGroupItem id="dark" aria-label="Toggle dark">
                  Dark
                </ToggleGroupItem>
                <ToggleGroupItem id="system" aria-label="Toggle system">
                  System
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="font-medium text-xs">Page Layout</Label>
              <ToggleGroup
                aria-label="Page Layout"
                selectionMode="single"
                disallowEmptySelection
                size="sm"
                spacing={0}
                variant="outline"
                selectedKeys={[contentLayout]}
                onSelectionChange={([layout]) => {
                  if (!layout) return;
                  setPreference("content_layout", layout as ContentLayout);
                }}
              >
                <ToggleGroupItem id="centered" aria-label="Toggle centered">
                  Centered
                </ToggleGroupItem>
                <ToggleGroupItem id="full-width" aria-label="Toggle full-width">
                  Full Width
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="font-medium text-xs">Navbar Behavior</Label>
              <ToggleGroup
                aria-label="Navbar Behavior"
                selectionMode="single"
                disallowEmptySelection
                size="sm"
                spacing={0}
                variant="outline"
                selectedKeys={[navbarStyle]}
                onSelectionChange={([style]) => {
                  if (!style) return;
                  setPreference("navbar_style", style as NavbarStyle);
                }}
              >
                <ToggleGroupItem id="sticky" aria-label="Toggle sticky">
                  Sticky
                </ToggleGroupItem>
                <ToggleGroupItem id="scroll" aria-label="Toggle scroll">
                  Scroll
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="font-medium text-xs">Sidebar Style</Label>
              <ToggleGroup
                aria-label="Sidebar Style"
                selectionMode="single"
                disallowEmptySelection
                size="sm"
                spacing={0}
                variant="outline"
                selectedKeys={[variant]}
                onSelectionChange={([nextVariant]) => {
                  if (!nextVariant) return;
                  setPreference("sidebar_variant", nextVariant as SidebarVariant);
                }}
              >
                <ToggleGroupItem id="inset" aria-label="Toggle inset">
                  Inset
                </ToggleGroupItem>
                <ToggleGroupItem id="sidebar" aria-label="Toggle sidebar">
                  Sidebar
                </ToggleGroupItem>
                <ToggleGroupItem id="floating" aria-label="Toggle floating">
                  Floating
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="font-medium text-xs">Sidebar Collapse Mode</Label>
              <ToggleGroup
                aria-label="Sidebar Collapse Mode"
                selectionMode="single"
                disallowEmptySelection
                size="sm"
                spacing={0}
                variant="outline"
                selectedKeys={[collapsible]}
                onSelectionChange={([nextCollapsible]) => {
                  if (!nextCollapsible) return;
                  setPreference("sidebar_collapsible", nextCollapsible as SidebarCollapsible);
                }}
              >
                <ToggleGroupItem id="icon" aria-label="Toggle icon">
                  Icon
                </ToggleGroupItem>
                <ToggleGroupItem id="offcanvas" aria-label="Toggle offcanvas">
                  OffCanvas
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <Button type="button" size="sm" variant="outline" className="w-full text-xs" onPress={resetPreferences}>
              Restore Defaults
            </Button>
          </div>
        </div>
      </Popover>
    </PopoverTrigger>
  );
}
