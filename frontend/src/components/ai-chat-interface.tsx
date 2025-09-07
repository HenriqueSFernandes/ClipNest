"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, Plus, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AddBookmarkModal } from "@/components/add-bookmark-modal"
import type { Bookmark, Folder } from "@/app/dashboard/page"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  bookmarks?: Bookmark[]
  timestamp: Date
}

interface AIChatInterfaceProps {
  bookmarks: Bookmark[]
  folders: Folder[]
  selectedFolder: number | null
  isLoading: boolean
  onSwitchToManagement: () => void
}

export function AIChatInterface({ bookmarks, folders, selectedFolder, onSwitchToManagement }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        '👋 Hi! I\'m your AI bookmark assistant. I can help you search through your bookmarks, summarize content, find related resources, and answer questions about your saved links. Try asking me something like:\n\n• "Show me my React bookmarks"\n• "Summarize my design resources"\n• "What did I save about JavaScript?"\n• "Find bookmarks from last week"\n\nFor detailed bookmark management, you can switch to the Management view anytime!',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAddBookmark, setShowAddBookmark] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateAIResponse = (userMessage: string): { content: string; bookmarks?: Bookmark[] } => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("react") || lowerMessage.includes("javascript")) {
      const reactBookmarks = bookmarks.filter(
        (b) =>
          b.title.toLowerCase().includes("react") ||
          b.content.toLowerCase().includes("react") ||
          b.content.toLowerCase().includes("javascript") ||
          b.tags.some((tag) => tag.includes("javascript") || tag.includes("react")),
      )
      return {
        content:
          "I found your React and JavaScript resources! Here are the relevant bookmarks I found in your collection:",
        bookmarks: reactBookmarks,
      }
    }

    if (lowerMessage.includes("design") || lowerMessage.includes("figma")) {
      const designBookmarks = bookmarks.filter(
        (b) =>
          folders.find(f => f.id === b.folder)?.name.toLowerCase().includes("design") ||
          b.title.toLowerCase().includes("figma") ||
          b.content.toLowerCase().includes("design") ||
          b.tags.some((tag) => tag.includes("design") || tag.includes("ui")),
      )
      return {
        content: "Here are your design-related bookmarks and resources:",
        bookmarks: designBookmarks,
      }
    }

    if (lowerMessage.includes("work") || lowerMessage.includes("github")) {
      const workBookmarks = bookmarks.filter(
        (b) => folders.find(f => f.id === b.folder)?.name.toLowerCase().includes("work") || b.title.toLowerCase().includes("github"),
      )
      return {
        content: "I found your work-related bookmarks:",
        bookmarks: workBookmarks,
      }
    }

    if (lowerMessage.includes("summarize") || lowerMessage.includes("summary")) {
      return {
        content: `Here's a summary of your bookmark collection:\n\n📚 **Total Bookmarks**: ${bookmarks.length}\n📁 **Folders**: ${folders.map((f) => `${f.name} (${f.count})`).join(", ")}\n\n**Recent Activity**: You've been actively saving resources about React development, design systems, and collaborative tools. Your most recent saves focus on modern web development practices.\n\n**Popular Tags**: ${Array.from(
          new Set(bookmarks.flatMap((b) => b.tags)),
        )
          .slice(0, 5)
          .join(", ")}`,
        bookmarks: bookmarks.slice(0, 3),
      }
    }

    if (lowerMessage.includes("last week") || lowerMessage.includes("recent")) {
      return {
        content: "Here are your most recently saved bookmarks:",
        bookmarks: bookmarks.slice(0, 3),
      }
    }

    if (lowerMessage.includes("manage") || lowerMessage.includes("edit") || lowerMessage.includes("organize")) {
      return {
        content:
          "For detailed bookmark management like editing, deleting, or organizing your bookmarks, I recommend switching to the Management view. You can use the 'Manage Bookmarks' button above or click the 'Manage Bookmarks' tab in the header. There you'll have full control over your bookmark collection!",
      }
    }

    // Default response with search results
    const searchResults = bookmarks.filter(
      (b) =>
        b.title.toLowerCase().includes(lowerMessage) ||
        b.content.toLowerCase().includes(lowerMessage) ||
        b.snippet.toLowerCase().includes(lowerMessage) ||
        b.tags.some((tag) => tag.toLowerCase().includes(lowerMessage)),
    )

    if (searchResults.length > 0) {
      return {
        content: `I found ${searchResults.length} bookmark${searchResults.length !== 1 ? "s" : ""} related to your query:`,
        bookmarks: searchResults,
      }
    }

    return {
      content:
        "I couldn't find specific bookmarks matching your query, but I can help you with:\n\n• Searching through your saved content\n• Summarizing bookmarks by topic or folder\n• Finding related resources\n• Organizing your bookmarks\n\nTry being more specific or ask me to show you bookmarks from a particular folder! For detailed management, switch to the Management view.",
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = simulateAIResponse(inputValue)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse.content,
        bookmarks: aiResponse.bookmarks,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickPrompts = [
    "Show me my React bookmarks",
    "Summarize my design resources",
    "What did I save about JavaScript?",
    "Find my most recent bookmarks",
  ]

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Bookmark Assistant</h2>
              <p className="text-sm text-gray-500">Ask me anything about your bookmarks</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={onSwitchToManagement} size="sm" variant="outline">
              <Grid3X3 className="h-4 w-4 mr-2" />
              Manage Bookmarks
            </Button>
            <Button onClick={() => setShowAddBookmark(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex space-x-3 max-w-3xl ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "user" ? "bg-blue-600" : "bg-gradient-to-r from-blue-500 to-purple-600"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>

                <div className={`flex-1 ${message.type === "user" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Bookmark Results */}
                  {message.bookmarks && message.bookmarks.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.bookmarks.map((bookmark) => (
                        <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <img
                                src={bookmark.favicon || "/placeholder.svg"}
                                alt=""
                                className="w-4 h-4 mt-1 flex-shrink-0"
                                onError={(e) => {
                                  e.currentTarget.src = "/simple-bookmark-icon.png"
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <a
                                  href={bookmark.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-gray-900 hover:text-blue-600 block"
                                >
                                  {bookmark.title}
                                </a>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{bookmark.snippet}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex flex-wrap gap-1">
                                    {bookmark.tags.slice(0, 3).map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {folders.find(f => f.id === bookmark.folder)?.name}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {new Date(bookmark.dateAdded).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-3xl">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <div className="border-t border-gray-100 p-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-600 mb-3">Try these suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(prompt)}
                  className="text-sm"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your bookmarks..."
                className="pr-12"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            AI can make mistakes. Verify important information from your bookmarks.
          </p>
        </div>
      </div>

      <AddBookmarkModal open={showAddBookmark} onOpenChange={setShowAddBookmark} folders={folders} />
    </div>
  )
}

