import { MobileNav, Sidebar } from "./sidebar";

/** Moldura branca arredondada sobre fundo escuro, com a barra de ícones. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh bg-[#2b2b2b] lg:p-6">
      <div className="flex h-full flex-col overflow-hidden bg-white shadow-2xl lg:flex-row lg:rounded-[32px]">
        <Sidebar />
        <main className="min-h-0 flex-1 p-2 lg:py-3 lg:pr-3 lg:pl-0">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}

/** Superfície com rolagem para as telas que não são o mapa. */
export function PageSurface({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto rounded-[24px] bg-zinc-100 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">{children}</div>
    </div>
  );
}
