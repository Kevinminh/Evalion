import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { Mail } from "lucide-react";

export type ProfileContactCardProps = {
  email?: string;
  title?: string;
  description?: string;
  className?: string;
};

function ProfileContactCard({
  email = "kontakt@co-lab.no",
  title = "Kontakt oss",
  description = "Har du spørsmål eller tilbakemeldinger? Vi hører gjerne fra deg.",
  className,
}: ProfileContactCardProps) {
  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Button variant="outline" size="sm" render={<a href={`mailto:${email}`} />}>
          <Mail />
          {email}
        </Button>
      </CardContent>
    </Card>
  );
}

export { ProfileContactCard };
