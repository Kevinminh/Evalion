import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronRight, ExternalLink } from "lucide-react";
import * as React from "react";

export type ProfileLegalLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type ProfileLegalCardProps = {
  title?: string;
  description?: string;
  links: ProfileLegalLink[];
  renderLink?: (link: ProfileLegalLink, children: React.ReactNode) => React.ReactNode;
  className?: string;
};

function defaultRenderLink(link: ProfileLegalLink, children: React.ReactNode) {
  return (
    <a
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

function ProfileLegalCard({
  title = "Vilkår og personvern",
  description,
  links,
  renderLink = defaultRenderLink,
  className,
}: ProfileLegalCardProps) {
  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="px-0">
        <ul className="flex flex-col">
          {links.map((link) => {
            const inner = (
              <span className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                <span>{link.label}</span>
                {link.external ? (
                  <ExternalLink className="size-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="size-4 text-muted-foreground" />
                )}
              </span>
            );
            return (
              <li key={link.href} className="contents">
                {renderLink(link, inner)}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export { ProfileLegalCard };
