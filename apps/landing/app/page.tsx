import { Button } from "@workspace/ui/components/button"

export default function Home() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">Welcome to Landing</h1>
        <Button>Get Started</Button>
      </div>
    </div>
  )
}
