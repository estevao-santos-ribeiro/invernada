"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CloudSun,
  Info,
  Leaf,
  List,
  LogOut,
  Map as MapIcon,
  Settings,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

const MAIN_ITEMS: NavItem[] = [
  { label: "Mapa", icon: MapIcon, href: "/" },
  { label: "Operações", icon: List, href: "/operacoes" },
  { label: "Clima", icon: CloudSun, href: "/clima" },
  { label: "Simulador", icon: SlidersHorizontal, href: "/simulador" },
  { label: "Sobre", icon: Info, href: "/sobre" },
];

/** Itens do rodapé da barra lateral (só no desktop). */
const FOOTER_ITEMS: NavItem[] = [
  { label: "Configurações", icon: Settings, href: "/configuracoes" },
  { label: "Sair", icon: LogOut, href: "/sair" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavButton({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      title={item.label}
      className={cn(
        "grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors",
        active
          ? "border-zinc-950 bg-zinc-950 text-white"
          : "border-zinc-200 text-zinc-800 hover:bg-zinc-100"
      )}
    >
      <Icon className="h-[18px] w-[18px]" />
    </Link>
  );
}

/** Barra lateral de ícones (desktop). */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[84px] shrink-0 flex-col items-center py-5 lg:flex">
      <Link
        href="/"
        aria-label="Campora, início"
        className="grid h-11 w-11 place-items-center rounded-full bg-zinc-950 text-white"
      >
        <Leaf className="h-5 w-5" fill="currentColor" />
      </Link>

      <nav aria-label="Navegação principal" className="flex flex-1 flex-col justify-center gap-3">
        {MAIN_ITEMS.map((item) => (
          <NavButton key={item.label} item={item} active={isActive(pathname, item.href)} />
        ))}
      </nav>

      <div className="flex flex-col gap-3">
        {FOOTER_ITEMS.map((item) => (
          <NavButton key={item.label} item={item} active={isActive(pathname, item.href)} />
        ))}
      </div>
    </aside>
  );
}

/** Barra inferior de ícones (celular). */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="flex h-16 shrink-0 items-center justify-around border-t border-zinc-200 px-2 lg:hidden"
    >
      {MAIN_ITEMS.map((item) => (
        <NavButton key={item.label} item={item} active={isActive(pathname, item.href)} />
      ))}
    </nav>
  );
}
