import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import {
  LayoutDashboardIcon,
  CheckSquareIcon,
  CalendarIcon,
  UserIcon,
  MessageSquareIcon,
  BellIcon,
  SettingsIcon,
  HelpCircleIcon,
  PencilIcon,
  LayoutListIcon,
  LayoutDashboardIcon as LayoutBoardIcon,
  ClockIcon,
  FilterIcon,
} from "lucide-react"
import {Link} from "react-router"

const tasks = [
  {
    id: 1,
    name: "Employee Details",
    description: "Create a page where there is information about employees",
    estimation: "Feb 14, 2024 - Feb 7, 2024",
    tags: ["Java"],
    priority: "High",
  },
  {
    id: 2,
    name: "Employee Details",
    description: "Create a page where there is information about employees",
    estimation: "Feb 14, 2024 - Feb 7, 2024",
    tags: ["Java"],
    priority: "High",
  },
  {
    id: 3,
    name: "Employee Details",
    description: "Create a page where there is information about employees",
    estimation: "Feb 14, 2024 - Feb 7, 2024",
    tags: ["Java"],
    priority: "High",
  },
  {
    id: 4,
    name: "Employee Details",
    description: "Create a page where there is information about employees",
    estimation: "Feb 14, 2024 - Feb 7, 2024",
    tags: ["Java"],
    priority: "High",
  },
]

export default function TasksPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <aside className="w-64 p-6 border-r border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold">Bibek Tamang</h2>
          <Button variant="ghost" size="icon">
            <PencilIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Menu</h3>
            <nav className="space-y-1">
              <Link
                to="#"
                className="flex items-center px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
              >
                <LayoutDashboardIcon className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link to="#" className="flex items-center px-3 py-2 text-primary rounded-lg bg-accent">
                <CheckSquareIcon className="mr-3 h-5 w-5" />
                Tasks
              </Link>
              <Link
                to="#"
                className="flex items-center px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
              >
                <CalendarIcon className="mr-3 h-5 w-5" />
                Calendar
              </Link>
            </nav>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Account</h3>
            <nav className="space-y-1">
              <Link
                to="#"
                className="flex items-center px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
              >
                <UserIcon className="mr-3 h-5 w-5" />
                User
              </Link>
              <Link
                to="#"
                className="flex items-center px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
              >
                <MessageSquareIcon className="mr-3 h-5 w-5" />
                Chat
              </Link>
              <Link
                to="#"
                className="flex items-center px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
              >
                <BellIcon className="mr-3 h-5 w-5" />
                Notifications
              </Link>
            </nav>
          </div>

          <div className="pt-6 space-y-1">
            <Link
              to="#"
              className="flex items-center px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
            >
              <SettingsIcon className="mr-3 h-5 w-5" />
              Setting
            </Link>
            <Link
              to="#"
              className="flex items-center px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
            >
              <HelpCircleIcon className="mr-3 h-5 w-5" />
              Help
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                <CheckSquareIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-semibold">Tasks</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center rounded-lg border border-border p-1">
                <Button variant="ghost" size="sm" className="px-3">
                  <LayoutListIcon className="h-4 w-4 mr-2" />
                  Lists
                </Button>
                <Button variant="ghost" size="sm" className="px-3">
                  <LayoutBoardIcon className="h-4 w-4 mr-2" />
                  Board
                </Button>
                <Button variant="ghost" size="sm" className="px-3">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Timeline
                </Button>
              </div>
              <Button variant="ghost" size="icon">
                <FilterIcon className="h-5 w-5" />
              </Button>
              <Button>New Task</Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Estimation</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>People</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.estimation}</TableCell>
                  <TableCell>
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="mr-1">
                        {tag}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Avatar className="h-8 w-8 bg-muted" />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      {task.priority}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}

