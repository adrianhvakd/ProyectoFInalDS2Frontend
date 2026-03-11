import ThemeSelector from "@/components/ui/ThemeSelector";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-100 relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeSelector />
      </div>
      {children}
    </div>
  );
}
