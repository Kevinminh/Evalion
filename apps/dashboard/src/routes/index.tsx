import { createFileRoute } from "@tanstack/react-router"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { Separator } from "@workspace/ui/components/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Download,
  Eye,
  FileText,
  Image,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
  Settings,
  TrendingDown,
  TrendingUp,
  Upload,
  UserPlus,
  Users,
} from "lucide-react"

const stats = [
  {
    label: "Total Posts",
    value: "1,284",
    change: "+12%",
    trend: "up" as const,
    icon: FileText,
  },
  {
    label: "Page Views",
    value: "45.2K",
    change: "+8.1%",
    trend: "up" as const,
    icon: Eye,
  },
  {
    label: "Active Users",
    value: "2,847",
    change: "+23%",
    trend: "up" as const,
    icon: Users,
  },
  {
    label: "Comments",
    value: "892",
    change: "-2.4%",
    trend: "down" as const,
    icon: MessageSquare,
  },
]

const recentContent = [
  {
    id: 1,
    title: "Getting Started with Evalion",
    author: "Admin",
    status: "published" as const,
    date: "Mar 23, 2026",
  },
  {
    id: 2,
    title: "Advanced Strategies Guide",
    author: "Editor",
    status: "draft" as const,
    date: "Mar 22, 2026",
  },
  {
    id: 3,
    title: "Community Tournament Rules",
    author: "Admin",
    status: "published" as const,
    date: "Mar 21, 2026",
  },
  {
    id: 4,
    title: "Balance Patch Notes v2.1",
    author: "Editor",
    status: "review" as const,
    date: "Mar 20, 2026",
  },
  {
    id: 5,
    title: "New Player Onboarding",
    author: "Admin",
    status: "published" as const,
    date: "Mar 19, 2026",
  },
  {
    id: 6,
    title: "API Documentation Update",
    author: "Developer",
    status: "draft" as const,
    date: "Mar 18, 2026",
  },
]

const activities = [
  {
    id: 1,
    user: "Admin",
    initials: "AD",
    action: "published",
    target: "Getting Started with Evalion",
    timeAgo: "2h ago",
  },
  {
    id: 2,
    user: "Editor",
    initials: "ED",
    action: "updated",
    target: "Advanced Strategies Guide",
    timeAgo: "5h ago",
  },
  {
    id: 3,
    user: "Admin",
    initials: "AD",
    action: "created",
    target: "Community Tournament Rules",
    timeAgo: "1d ago",
  },
  {
    id: 4,
    user: "Developer",
    initials: "DV",
    action: "commented on",
    target: "API Documentation Update",
    timeAgo: "1d ago",
  },
]

const statusBadgeVariant = {
  published: "default",
  draft: "secondary",
  review: "outline",
} as const

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-svh bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-muted/30 p-4 md:flex md:flex-col">
        <div className="mb-8 flex items-center gap-2">
          <LayoutDashboard className="size-5" />
          <span className="text-lg font-bold">Evalion CMS</span>
        </div>

        <nav className="flex flex-col gap-1">
          <Button variant="secondary" className="w-full justify-start">
            <LayoutDashboard />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FileText />
            Content
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Image />
            Media
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users />
            Users
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings />
            Settings
          </Button>
        </nav>

        <div className="mt-auto">
          <Separator />
          <div className="flex items-center gap-3 pt-4">
            <Avatar>
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Admin</span>
            <Button variant="ghost" size="icon" className="ml-auto">
              <LogOut />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-6 overflow-auto p-6">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Admin</h1>
            <p className="text-sm text-muted-foreground">March 24, 2026</p>
          </div>
          <div className="flex gap-3">
            <Button>
              <Plus />
              New Post
            </Button>
            <Button variant="outline">
              <Download />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {stat.trend === "up" ? (
                    <TrendingUp className="size-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="size-3 text-red-500" />
                  )}
                  <span
                    className={
                      stat.trend === "up"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }
                  >
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Content */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Content</CardTitle>
              <CardAction>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentContent.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell>{item.author}</TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant[item.status]}>
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus />
                    New Blog Post
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload />
                    Upload Media
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <UserPlus />
                    Invite User
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings />
                    Site Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Publishing Goal */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing Goal</CardTitle>
                <CardDescription>18 of 25 posts this month</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={72} />
                <p className="mt-2 text-sm text-muted-foreground">
                  72% complete
                </p>
              </CardContent>
            </Card>

            {/* Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-3 py-3 ${index < activities.length - 1 ? "border-b" : ""}`}
                  >
                    <Avatar>
                      <AvatarFallback>{activity.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        {activity.user} {activity.action}{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timeAgo}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
