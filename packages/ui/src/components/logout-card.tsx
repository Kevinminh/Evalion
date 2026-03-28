import * as React from "react"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

interface LogoutCardProps {
  className?: string
  logo?: React.ReactNode
  title?: string
  description?: string
  onLogout?: () => void
  onCancel?: () => void
}

function LogoutCard({
  className,
  logo,
  title = "Logg ut",
  description = "Er du sikker på at du vil logge ut?",
  onLogout,
  onCancel,
}: LogoutCardProps) {
  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardHeader>
        {logo}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Button className="w-full" variant="destructive" onClick={onLogout}>
            Logg ut
          </Button>
          <Button className="w-full" variant="outline" onClick={onCancel}>
            Avbryt
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { LogoutCard }
