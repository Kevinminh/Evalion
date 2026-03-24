import { createFileRoute } from "@tanstack/react-router"
import { Play } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Evalion</h1>
          <p className="text-muted-foreground">Bli med i en FagPrat-økt</p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <Input
            type="text"
            placeholder="Skriv inn spillkode"
            className="h-14 text-center text-lg"
            autoFocus
          />
          <Button size="lg" className="h-14 text-lg">
            <Play data-icon="inline-start" />
            PLAY
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Spør læreren din om spillkoden
        </p>
      </div>
    </div>
  )
}
