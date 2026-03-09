"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggleButton() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setIsDark(currentTheme === "mining-dark");
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "mining-dark" ? "mining-light" : "mining-dark";
    const themeName = newTheme === "mining-dark" ? "dark" : "light";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", themeName);
    setIsDark(newTheme === "mining-dark");
  };

  if (!mounted) {
    return <div className="w-8 h-8 absolute top-4 right-4" />; 
  }

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-sm btn-circle cursor-pointer absolute top-4 right-4"
      title={isDark ? "Modo claro" : "Modo oscuro"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-primary" />
      ) : (
        <Moon className="w-5 h-5 text-primary" />
      )}
    </button>
  );
}