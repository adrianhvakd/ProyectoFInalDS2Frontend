"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Palette, Check } from "lucide-react";

const COLORS = [
  { id: "morado", name: "Morado", primary: "#7e0ef3" },
  { id: "salmon", name: "Salmón", primary: "#f36164" },
  { id: "azul", name: "Azul", primary: "#0097bd" },
  { id: "verde", name: "Verde", primary: "#009b59" },
];

export default function ThemeSelector() {
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [color, setColor] = useState<string>("morado");
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedMode = localStorage.getItem("theme-mode") as "dark" | "light" || "dark";
    const storedColor = localStorage.getItem("theme-color") || "morado";
    setMode(storedMode);
    setColor(storedColor);
    applyTheme(storedColor, storedMode);
  }, []);

  const applyTheme = (colorName: string, themeMode: "dark" | "light") => {
    const themeName = `mining-${themeMode}-${colorName}`;
    document.documentElement.setAttribute("data-theme", themeName);
  };

  const handleModeChange = (newMode: "dark" | "light") => {
    setMode(newMode);
    localStorage.setItem("theme-mode", newMode);
    applyTheme(color, newMode);
  };

  const handleColorChange = (colorName: string) => {
    setColor(colorName);
    localStorage.setItem("theme-color", colorName);
    applyTheme(colorName, mode);
    setOpen(false);
  };

  if (!mounted) {
    return <div className="w-9 h-9"></div>;
  }

  const currentColor = COLORS.find(c => c.id === color);

  return (
    <div className="dropdown dropdown-end">
      <button
        onClick={() => setOpen(!open)}
        className="btn btn-ghost btn-sm btn-circle cursor-pointer"
        title="Cambiar tema"
      >
        <Palette className="w-5 h-5 text-primary" />
      </button>
      
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="dropdown-content z-50 mt-2 p-4 shadow-xl rounded-lg bg-base-200 border border-base-300 w-64">
            <div className="mb-4">
              <p className="text-xs text-base-content/60 mb-2 uppercase tracking-wider">Modo</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleModeChange("dark")}
                  className={`flex-1 btn btn-sm ${mode === "dark" ? "btn-primary" : "btn-ghost"}`}
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </button>
                <button
                  onClick={() => handleModeChange("light")}
                  className={`flex-1 btn btn-sm ${mode === "light" ? "btn-primary" : "btn-ghost"}`}
                >
                  <Sun className="w-4 h-4" />
                  Light
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-base-content/60 mb-2 uppercase tracking-wider">Color</p>
              <div className="grid grid-cols-2 gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleColorChange(c.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                      color === c.id 
                        ? "border-primary bg-primary/10" 
                        : "border-base-300 hover:border-primary/50"
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: c.primary }}
                    />
                    <span className="text-sm">{c.name}</span>
                    {color === c.id && <Check className="w-4 h-4 ml-auto text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
