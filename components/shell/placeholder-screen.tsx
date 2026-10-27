import { PageSurface } from "./app-shell";

/** Tela provisória: só o título centralizado, até a funcionalidade ser construída. */
export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <PageSurface>
      <div className="grid min-h-[calc(100dvh-10rem)] place-items-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">{title}</h1>
      </div>
    </PageSurface>
  );
}
