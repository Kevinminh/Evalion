"use client"

import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import {
  Swords,
  Sparkles,
  Play,
  ArrowRight,
  Users,
  BarChart3,
  Zap,
  Shield,
  Github,
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      {/* Nav Bar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <Swords className="size-5" />
            <span>Evalion</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              Features
            </Button>
            <Button variant="ghost" size="sm">
              About
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <Badge variant="secondary">
            <Sparkles data-icon="inline-start" />
            Early Access
          </Badge>

          <div className="flex flex-col gap-4">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              The evaluation platform
              <br />
              that plays fair.
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              Compete, evaluate, and grow with a platform designed for
              transparency and precision. Built for teams who demand real
              results.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg">
              <Play data-icon="inline-start" />
              Start Playing
            </Button>
            <Button variant="outline" size="lg">
              Learn More
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="size-4" />
              <span>10K+ Players</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4" />
              <span>500+ Evaluations</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-4" />
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Why Evalion?</h2>
            <p className="mt-3 text-muted-foreground">
              Everything you need to run fair, data-driven evaluations at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shield className="size-5" />
                </div>
                <CardTitle>Fair Evaluation</CardTitle>
                <CardDescription>
                  Bias-free scoring backed by transparent algorithms. Every
                  participant gets an equal playing field, every time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Zap className="size-5" />
                </div>
                <CardTitle>Real-time Matches</CardTitle>
                <CardDescription>
                  Live head-to-head matchups with instant feedback. See results
                  as they happen, not hours later.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BarChart3 className="size-5" />
                </div>
                <CardTitle>Deep Analytics</CardTitle>
                <CardDescription>
                  Granular performance breakdowns and trend analysis. Understand
                  strengths, weaknesses, and trajectories at a glance.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Trusted by competitors
            </h2>
            <p className="mt-3 text-muted-foreground">
              Hear from the teams already using Evalion.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardContent>
                <blockquote className="text-muted-foreground">
                  &ldquo;Evalion completely changed how we benchmark our models.
                  The fairness guarantees give us confidence in every
                  result.&rdquo;
                </blockquote>
              </CardContent>
              <CardHeader>
                <CardTitle>Sarah Chen</CardTitle>
                <CardDescription>ML Lead, Arcline Labs</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardContent>
                <blockquote className="text-muted-foreground">
                  &ldquo;Real-time matchmaking is a game changer. We went from
                  weekly batch reviews to instant, continuous
                  evaluation.&rdquo;
                </blockquote>
              </CardContent>
              <CardHeader>
                <CardTitle>Marcus Webb</CardTitle>
                <CardDescription>CTO, Vectris</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardContent>
                <blockquote className="text-muted-foreground">
                  &ldquo;The analytics alone are worth it. We spotted
                  performance regressions days before they would have hit
                  production.&rdquo;
                </blockquote>
              </CardContent>
              <CardHeader>
                <CardTitle>Priya Kapoor</CardTitle>
                <CardDescription>
                  Engineering Manager, NovaBridge
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to compete?
          </h2>
          <p className="mt-3 mb-8 text-muted-foreground">
            Join the waitlist and be among the first to experience fair
            evaluation.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Input
              type="email"
              placeholder="you@example.com"
              className="max-w-xs"
            />
            <Button>Join Waitlist</Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-8">
        <div className="mx-auto max-w-6xl">
          <Separator className="mb-6" />
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; 2026 Evalion
            </p>
            <div className="flex items-center gap-1">
              <Button variant="link" size="sm">
                Privacy
              </Button>
              <Button variant="link" size="sm">
                Terms
              </Button>
              <Button variant="link" size="sm">
                <Github data-icon="inline-start" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
