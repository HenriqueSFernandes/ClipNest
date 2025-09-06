"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { FolderSidebar } from "@/components/folder-sidebar"
import { AIChatInterface } from "@/components/ai-chat-interface"
import { BookmarkManagement } from "@/components/bookmark-management"
import { AddFolderModal } from "@/components/add-folder-modal"
import { EditBookmarkModal } from "@/components/edit-bookmark-modal"
import { api } from "@/lib/api"

export type ViewMode = "ai-chat" | "bookmark-management"

export interface Bookmark {
  id: string
  title: string
  url: string
  favicon: string
  snippet: string
  dateAdded: string
  folder: string
  content: string
  tags: string[]
}

export interface Folder {
  id: string
  name: string
  count: number
}

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("ai-chat")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [showAddFolder, setShowAddFolder] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)

  const [folders, setFolders] = useState<Folder[]>([])

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const fetchedFolders = await api.get("/folders")
				const parsedFolders: Folder[] = fetchedFolders.map((folder: any) => ({
					id: folder.id,
					name: folder.name,
					count: 10, // Placeholder count, replace with actual data if available
				}))
				setFolders(parsedFolders)
      } catch (error) {
        console.error("Failed to fetch folders:", error)
      }
    }

    fetchFolders()
  }, [])

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    {
      id: "1",
      title: "React Documentation",
      url: "https://react.dev",
      favicon: "/react-logo.png",
      snippet:
        "The library for web and native user interfaces. React lets you build user interfaces out of individual pieces called components.",
      dateAdded: "2024-01-15",
      folder: "Learning",
      content:
        "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components...",
      tags: ["javascript", "frontend", "library"],
    },
    {
      id: "2",
      title: "Figma Design System",
      url: "https://figma.com",
      favicon: "/figma-logo.png",
      snippet:
        "A collaborative interface design tool. Build better products as a team with design systems, prototyping, and developer handoff.",
      dateAdded: "2024-01-14",
      folder: "Design",
      content:
        "Figma is a collaborative web application for interface design, with additional offline features enabled by desktop applications...",
      tags: ["design", "ui", "collaboration"],
    },
    {
      id: "3",
      title: "GitHub Repository",
      url: "https://github.com",
      favicon: "/github-logo.png",
      snippet:
        "Where the world builds software. Millions of developers and companies build, ship, and maintain their software on GitHub.",
      dateAdded: "2024-01-13",
      folder: "Work",
      content:
        "GitHub is a platform for version control and collaboration. It lets you and others work together on projects from anywhere...",
      tags: ["git", "collaboration", "development"],
    },
    {
      id: "4",
      title: "Tailwind CSS Documentation",
      url: "https://tailwindcss.com",
      favicon: "/tailwind-logo.png",
      snippet: "A utility-first CSS framework for rapidly building custom user interfaces.",
      dateAdded: "2024-01-12",
      folder: "Learning",
      content: "Tailwind CSS is a utility-first CSS framework packed with classes like flex, pt-4, text-center...",
      tags: ["css", "framework", "styling"],
    },
    {
      id: "5",
      title: "Notion Workspace",
      url: "https://notion.so",
      favicon: "/notion-logo.png",
      snippet:
        "A new tool that blends your everyday work apps into one. It's the all-in-one workspace for you and your team.",
      dateAdded: "2024-01-11",
      folder: "Personal",
      content: "Notion is a collaboration platform with modified Markdown support that integrates kanban boards...",
      tags: ["productivity", "notes", "collaboration"],
    },
  ])

  const handleDeleteBookmark = (bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId))
    // Update folder counts
    const deletedBookmark = bookmarks.find((b) => b.id === bookmarkId)
    if (deletedBookmark) {
      setFolders((prev) => prev.map((f) => (f.name === deletedBookmark.folder ? { ...f, count: f.count - 1 } : f)))
    }
  }

  const handleUpdateBookmark = (updatedBookmark: Bookmark) => {
    setBookmarks((prev) => prev.map((b) => (b.id === updatedBookmark.id ? updatedBookmark : b)))
    setEditingBookmark(null)
  }

  const handleFolderAdded = (newFolder: Folder) => {
    setFolders((prevFolders) => [...prevFolders, newFolder]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader viewMode={viewMode} onViewModeChange={setViewMode} />

      <div className="flex h-[calc(100vh-73px)]">
        <FolderSidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          onAddFolder={() => setShowAddFolder(true)}
          viewMode={viewMode}
        />

        <main className="flex-1 flex flex-col">
          {viewMode === "ai-chat" ? (
            <AIChatInterface
              bookmarks={bookmarks}
              folders={folders}
              selectedFolder={selectedFolder}
              onSwitchToManagement={() => setViewMode("bookmark-management")}
            />
          ) : (
            <BookmarkManagement
              bookmarks={bookmarks}
              folders={folders}
              selectedFolder={selectedFolder}
              onEditBookmark={setEditingBookmark}
              onDeleteBookmark={handleDeleteBookmark}
              onSwitchToAI={() => setViewMode("ai-chat")}
            />
          )}
        </main>
      </div>

      <AddFolderModal open={showAddFolder} onOpenChange={setShowAddFolder} onFolderAdded={handleFolderAdded}/>

      {editingBookmark && (
        <EditBookmarkModal
          bookmark={editingBookmark}
          folders={folders}
          open={!!editingBookmark}
          onOpenChange={(open) => !open && setEditingBookmark(null)}
          onSave={handleUpdateBookmark}
        />
      )}
    </div>
  )
}
