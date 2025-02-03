
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  MoreHorizontal,
  MessageSquare,
  Paperclip,
  CheckSquareIcon,
  LayoutListIcon,
  LayoutDashboardIcon,
  ClockIcon,
  FilterIcon,
} from "lucide-react"

interface Task {
  id: string
  title: string
  tag: string
  date: string
  comments: number
  attachments: number
}

const columns = [
  {
    title: "To do",
    tasks: [
      {
        id: "1",
        title: "Design Homepage Wireframe",
        tag: "UI Design",
        date: "07 Feb 2024",
        comments: 12,
        attachments: 3,
      },
    ],
  },
  {
    title: "In Progress",
    tasks: [
      {
        id: "2",
        title: "Design Homepage Wireframe",
        tag: "UI Design",
        date: "07 Feb 2024",
        comments: 12,
        attachments: 3,
      },
    ],
  },
  {
    title: "Done",
    tasks: [
      {
        id: "3",
        title: "Design Homepage Wireframe",
        tag: "UI Design",
        date: "07 Feb 2024",
        comments: 12,
        attachments: 3,
      },
      {
        id: "4",
        title: "Design Homepage Wireframe",
        tag: "UI Design",
        date: "07 Feb 2024",
        comments: 12,
        attachments: 3,
      },
      {
        id: "5",
        title: "Design Homepage Wireframe",
        tag: "UI Design",
        date: "07 Feb 2024",
        comments: 12,
        attachments: 3,
      },
    ],
  },
]

function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-500">
            {task.tag}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <h3 className="mt-2 font-medium">{task.title}</h3>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{task.date}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {task.comments}
            </div>
            <div className="flex items-center">
              <Paperclip className="h-4 w-4 mr-1" />
              {task.attachments}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function BoardView() {
  return (
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
            {columns.map((column) => (
              <div key={column.title} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                    {column.title}
                  </h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 min-h-[600px]">
                  {column.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}
          </div>
      </main>
  )
}

