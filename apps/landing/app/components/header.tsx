import { Play } from "lucide-react";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";

import { isAuthenticated } from "../lib/auth-server";
import { PLAY_URL } from "../lib/constants";
import { UserMenu } from "./user-menu";

export async function Header() {
  const authed = await isAuthenticated();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-[var(--color-cl-border)]">
      <nav className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          <img
            src="/assets/CO-LAB (Hoved) - uten skygge.png"
            alt="CO-LAB"
            className="h-9 w-auto"
          />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            render={<a href={PLAY_URL} />}
          >
            <Play className="size-3.5" />
            Bli med i spill
          </Button>
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
              <Button size="sm" className="rounded-full" render={<Link href="/logg-inn" />}>
                Registrer deg
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
