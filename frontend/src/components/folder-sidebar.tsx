"use client"

import { Folder, Plus, FolderOpen, Sparkles, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ViewMode } from "@/app/dashboard/page"

interface FolderSidebarProps {
  folders: { id: string; name: string; count: number }[]
  selectedFolder: string | null
  onSelectFolder: (folderId: string | null) => void
  onAddFolder: () => void
  viewMode: ViewMode
}

export function FolderSidebar({ folders, selectedFolder, onSelectFolder, onAddFolder, viewMode }: FolderSidebarProps) {
  const totalBookmarks = folders.reduce((total, folder) => total + folder.count, 0)

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="space-y-6">
        {/* Mode-specific tip */}
        {viewMode === "ai-chat" ? (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">AI Tip</span>
            </div>
            <p className="text-xs text-blue-700">
              Ask the AI to "show me bookmarks from [folder name]" to focus on specific collections!
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-100">
            <div className="flex items-center space-x-2 mb-2">
              <Grid3X3 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Management Mode</span>
            </div>
            <p className="text-xs text-green-700">
              Click on folders to filter bookmarks. Use the search bar and controls to organize your collection.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Folders</h2>
            <Button onClick={onAddFolder} size="sm" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => onSelectFolder(null)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors",
                selectedFolder === null ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50",
              )}
            >
              <FolderOpen className="h-4 w-4" />
              <span className="flex-1">All Bookmarks</span>
              <span className="text-sm text-gray-500">{totalBookmarks}</span>
            </button>

            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => onSelectFolder(folder.name)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors",
                  selectedFolder === folder.name ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50",
                )}
              >
                <Folder className="h-4 w-4" />
                <span className="flex-1">{folder.name}</span>
                <span className="text-sm text-gray-500">{folder.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mode-specific quick actions */}
        {viewMode === "ai-chat" && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Quick AI Commands</h3>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-gray-50 rounded text-gray-600">
                "Summarize my {folders[0]?.name.toLowerCase()} bookmarks"
              </div>
              <div className="p-2 bg-gray-50 rounded text-gray-600">"Find bookmarks about [topic]"</div>
              <div className="p-2 bg-gray-50 rounded text-gray-600">"Show me recent saves"</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
