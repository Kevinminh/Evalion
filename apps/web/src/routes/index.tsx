import { createFileRoute } from "@tanstack/react-router"
import {
  ArrowRight,
  Clock,
  Gamepad2,
  Settings,
  Swords,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

const recentMatches = [
  {
    id: 1,
    opponent: "AlphaStrike",
    result: "win" as const,
    ratingChange: 15,
    timeAgo: "2m ago",
  },
  {
    id: 2,
    opponent: "BetaForce",
    result: "loss" as const,
    ratingChange: -8,
    timeAgo: "15m ago",
  },
  {
    id: 3,
    opponent: "GammaWave",
    result: "win" as const,
    ratingChange: 12,
    timeAgo: "32m ago",
  },
  {
    id: 4,
    opponent: "DeltaPulse",
    result: "draw" as const,
    ratingChange: 0,
    timeAgo: "1h ago",
  },
  {
    id: 5,
    opponent: "EpsilonCore",
    result: "win" as const,
    ratingChange: 18,
    timeAgo: "2h ago",
  },
]

const leaderboard = [
  { rank: 1, name: "OmegaMaster", rating: 2481, initials: "OM" },
  { rank: 2, name: "ZetaHunter", rating: 2356, initials: "ZH" },
  { rank: 3, name: "ThetaRogue", rating: 2298, initials: "TR" },
  { rank: 4, name: "KappaStorm", rating: 2187, initials: "KS" },
  { rank: 5, name: "LambdaEdge", rating: 2134, initials: "LE" },
]

const onlinePlayers = [
  "AP",
  "BF",
  "GW",
  "DP",
  "EC",
  "MX",
  "NR",
  "QS",
  "VT",
  "WZ",
]

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="min-h-svh bg-background">
      <header>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="size-5" />
            <span className="text-lg font-bold">Evalion</span>
          </div>

          <Tabs defaultValue="lobby">
            <TabsList>
              <TabsTrigger value="lobby">Lobby</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>GS</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Guest</span>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Match</CardTitle>
              <CardDescription>
                Jump into a ranked evaluation match
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button>
                  <Swords className="size-4" />
                  1v1 Ranked
                </Button>
                <Button variant="secondary">
                  <Target className="size-4" />
                  Practice
                </Button>
                <Button variant="outline">
                  <Settings className="size-4" />
                  Custom
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Clock className="size-4 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Average queue time: ~15s
              </span>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Matches</CardTitle>
              <CardAction>
                <Badge variant="destructive">Live</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Opponent</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMatches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell className="font-medium">
                        {match.opponent}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            match.result === "win"
                              ? "secondary"
                              : match.result === "loss"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {match.result === "win"
                            ? "Win"
                            : match.result === "loss"
                              ? "Loss"
                              : "Draw"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 ${
                            match.ratingChange > 0
                              ? "text-emerald-500"
                              : match.ratingChange < 0
                                ? "text-red-500"
                                : "text-muted-foreground"
                          }`}
                        >
                          {match.ratingChange > 0 ? (
                            <TrendingUp className="size-3.5" />
                          ) : match.ratingChange < 0 ? (
                            <TrendingDown className="size-3.5" />
                          ) : null}
                          {match.ratingChange > 0
                            ? `+${match.ratingChange}`
                            : match.ratingChange}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {match.timeAgo}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rank</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    <Trophy className="size-4" />
                    Silver II
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Win Rate
                    </span>
                    <span className="font-semibold">64%</span>
                  </div>
                  <Progress value={64} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Matches
                  </span>
                  <span className="font-semibold">142</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                View Full Stats
                <ArrowRight className="size-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Players</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {leaderboard.map((player) => (
                    <TableRow key={player.rank}>
                      <TableCell className="w-10">
                        {player.rank <= 3 ? (
                          <Badge
                            variant={
                              player.rank === 1
                                ? "default"
                                : player.rank === 2
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {player.rank === 1
                              ? "1st"
                              : player.rank === 2
                                ? "2nd"
                                : "3rd"}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">
                            {player.rank}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar size="sm">
                            <AvatarFallback>{player.initials}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{player.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {player.rating}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Online Now</CardTitle>
              <CardDescription>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block size-2 rounded-full bg-emerald-500" />
                  1,247 players
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarGroup>
                {onlinePlayers.map((initials) => (
                  <Avatar key={initials} size="sm">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
