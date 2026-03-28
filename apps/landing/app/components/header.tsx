import { Button } from "@workspace/ui/components/button";
import { Play } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/">
          <img src="/logo.png" alt="Evalion" className="h-10" />
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" render={<a href="https://play.evalion.no" />}>
            <Play className="size-3.5" />
            Bli med i spill
          </Button>
          <Button variant="outline" size="sm" render={<a href="https://dashboard.evalion.no" />}>
            Logg inn
          </Button>
          <Button size="sm">Registrer deg</Button>
        </div>
      </nav>
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </header>
  );
}
