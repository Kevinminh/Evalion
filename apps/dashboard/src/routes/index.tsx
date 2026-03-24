import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Evalion</CardTitle>
          <CardDescription>Logg inn for å administrere dine FagPrat-økter</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-post</Label>
              <Input id="email" type="email" placeholder="navn@skole.no" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Passord</Label>
              <Input id="password" type="password" placeholder="Skriv inn passord" />
            </div>
            <Button type="submit" className="w-full">
              Logg inn
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="link" size="sm">
            Glemt passord?
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
