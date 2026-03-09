import ThemeToggleButton from "@/components/ui/ThemeToggleButton";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-100 relative">
      <ThemeToggleButton />
      {children}
    </div>
  );
}
