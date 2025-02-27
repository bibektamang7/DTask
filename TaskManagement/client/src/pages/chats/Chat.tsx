

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react"
import { useState } from "react"

const chatRooms = Array(8).fill({
  id: 1,
  name: "Design chat",
  lastMessage: "you'll find new app here!",
  timestamp: "4m",
})

interface Message {
  id: number
  content: string
  sender: string
  timestamp: string
  isCurrentUser: boolean
}

const messages: Message[] = [
  {
    id: 1,
    content: "Added new Task to UX design",
    sender: "Bibek Tamang",
    timestamp: "09:30",
    isCurrentUser: true,
  },
  {
    id: 2,
    content: "The design thread 🧵",
    sender: "Design Team",
    timestamp: "09:32",
    isCurrentUser: false,
  },
]

function ChatRoomList({ onSelectRoom }: { onSelectRoom?: () => void }) {
  return (
    <ScrollArea className="h-[calc(100vh-5rem)]">
      {chatRooms.map((room, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer"
          onClick={onSelectRoom}
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback>DC</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium truncate">{room.name}</h3>
              <span className="text-xs text-muted-foreground">{room.timestamp}</span>
            </div>
            <p className="text-sm text-muted-foreground truncate">{room.lastMessage}</p>
          </div>
        </div>
      ))}
    </ScrollArea>
  )
}

function ChatHeader({ onBack }: { onBack?: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarFallback>DC</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">Design chat</h2>
          <p className="text-sm text-muted-foreground">24 members</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hidden md:inline-flex">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden md:inline-flex">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export default function WorkspaceChat() {
  const [showMobileChatList, setShowMobileChatList] = useState(true)

  return (
    <div className="w-full flex bg-background">
      {/* Mobile view */}
      <div className="md:hidden flex flex-col w-full">
        {showMobileChatList ? (
          <>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h1 className="text-xl font-semibold">Workspaces</h1>
            </div>
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-9 bg-muted" />
              </div>
            </div>
            <ChatRoomList onSelectRoom={() => setShowMobileChatList(false)} />
          </>
        ) : (
          <div className="flex flex-col h-screen">
            <ChatHeader onBack={() => setShowMobileChatList(true)} />
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-2 max-w-[70%] ${message.isCurrentUser ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.sender
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{message.sender}</span>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                        </div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border">
              <Input placeholder="Type a message..." className="bg-muted" />
            </div>
          </div>
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex w-full">
        {/* Left sidebar - Chat rooms */}
        <div className="w-80 max-h-screen scrollbar-hidden overflow-scroll border-r border-border">

          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-semibold">Workspaces</h1>
          </div>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-9 bg-muted" />
            </div>
          </div>
          <ChatRoomList />
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col max-h-screen">
          <ChatHeader />
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[70%] ${message.isCurrentUser ? "flex-row-reverse" : ""}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {message.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{message.sender}</span>
                        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-border">
            <Input placeholder="Type a message..." className="bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}

