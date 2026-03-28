import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" })
    }
  },
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  )
}
