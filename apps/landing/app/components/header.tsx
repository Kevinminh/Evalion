import Link from "next/link";

import { Button } from "@workspace/ui/components/button";

import { isAuthenticated } from "../lib/auth-server";
import { MobileMenu } from "./mobile-menu";
import { UserMenu } from "./user-menu";

export async function Header() {
  const authed = await isAuthenticated();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-cl-border">
      <nav className="relative mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center">
          <img
            src="/assets/CO-LAB (Hoved) - uten skygge.png"
            alt="CO-LAB"
            className="h-8 w-auto sm:h-9"
          />
        </Link>
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
          <a
            href="/#om-co-lab"
            className="text-sm font-medium text-ink-secondary transition hover:text-ink"
          >
            Om CO-LAB
          </a>
          <a
            href="/#slik-fungerer"
            className="text-sm font-medium text-ink-secondary transition hover:text-ink"
          >
            Slik fungerer FagPrat
          </a>
          <a
            href="/#generator"
            className="text-sm font-medium text-ink-secondary transition hover:text-ink"
          >
            Vår påstandsgenerator
          </a>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 sm:flex sm:gap-3">
            {/* Hidden temporarily — restore by uncommenting
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              render={<a href={PLAY_URL} />}
            >
              <Play className="size-3.5" />
              Bli med i spill
            </Button>
            */}
            {authed ? (
              <UserMenu />
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  render={<Link href="/logg-inn" />}
                >
                  Logg inn
                </Button>
                <Button size="sm" className="rounded-full" render={<Link href="/registrer-deg" />}>
                  Registrer deg
                </Button>
              </>
            )}
          </div>
          {authed && <div className="sm:hidden"><UserMenu /></div>}
          <MobileMenu authed={authed} />
        </div>
      </nav>
    </header>
  );
}
