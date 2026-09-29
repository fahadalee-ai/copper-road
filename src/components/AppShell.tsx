import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center bg-[#071525]">
      <div className="relative min-h-dvh w-full max-w-[390px] overflow-hidden bg-[#E1EFF9] shadow-[0_0_80px_rgba(0,0,0,0.45)]">
        {children}
      </div>
    </div>
  );
}
