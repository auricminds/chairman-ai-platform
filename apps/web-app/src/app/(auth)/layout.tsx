export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center px-4">
      {children}
    </div>
  );
}
