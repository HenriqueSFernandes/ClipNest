/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  Tag,
  Grid3X3,
  List,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddBookmarkModal } from "@/components/add-bookmark-modal";
import type { Bookmark, Folder } from "@/app/dashboard/page";

interface BookmarkManagementProps {
  bookmarks: Bookmark[];
  folders: Folder[];
  selectedFolder: string | null;
  onEditBookmark: (bookmark: Bookmark) => void;
  onDeleteBookmark: (bookmarkId: string) => void;
  onSwitchToAI: () => void;
}

type ViewType = "grid" | "list";
type SortBy = "date" | "title" | "folder";

export function BookmarkManagement({
  bookmarks,
  folders,
  selectedFolder,
  onEditBookmark,
  onDeleteBookmark,
  onSwitchToAI,
}: BookmarkManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [showAddBookmark, setShowAddBookmark] = useState(false);

  // Filter and sort bookmarks
  const filteredBookmarks = bookmarks
    .filter((bookmark) => {
      const matchesSearch =
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesFolder =
        !selectedFolder || bookmark.folder === selectedFolder;
      return matchesSearch && matchesFolder;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "folder":
          return a.folder.localeCompare(b.folder);
        case "date":
        default:
          return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
      }
    });

  const handleDeleteClick = (bookmark: Bookmark) => {
    if (confirm(`Are you sure you want to delete "${bookmark.title}"?`)) {
      onDeleteBookmark(bookmark.id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedFolder ? `${selectedFolder} Bookmarks` : "All Bookmarks"}
            </h2>
            <p className="text-gray-600">
              {filteredBookmarks.length} bookmark
              {filteredBookmarks.length !== 1 ? "s" : ""}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={onSwitchToAI} variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Ask AI
            </Button>
            <Button onClick={() => setShowAddBookmark(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Bookmark
            </Button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search bookmarks, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortBy)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date Added</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="folder">Folder</SelectItem>
              </SelectContent>
            </Select>

            <Tabs
              value={viewType}
              onValueChange={(value) => setViewType(value as ViewType)}
            >
              <TabsList>
                <TabsTrigger value="grid">
                  <Grid3X3 className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {filteredBookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ExternalLink className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookmarks found
            </h3>
            <p className="text-gray-500 max-w-sm mb-4">
              {searchQuery
                ? `No bookmarks match "${searchQuery}". Try a different search term.`
                : selectedFolder
                  ? `No bookmarks in "${selectedFolder}" folder yet.`
                  : "You haven't saved any bookmarks yet."}
            </p>
            <Button onClick={() => setShowAddBookmark(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Bookmark
            </Button>
          </div>
        ) : viewType === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookmarks.map((bookmark) => (
              <Card
                key={bookmark.id}
                className="hover:shadow-md transition-shadow group"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <img
                          src={bookmark.favicon || "/placeholder.svg"}
                          alt=""
                          className="w-4 h-4 mt-1 flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = "/simple-bookmark-icon.png";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2 block"
                          >
                            {bookmark.title}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEditBookmark(bookmark)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteClick(bookmark)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {bookmark.snippet}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {bookmark.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(bookmark.dateAdded).toLocaleDateString()}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {bookmark.folder}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredBookmarks.map((bookmark) => (
              <Card
                key={bookmark.id}
                className="hover:shadow-sm transition-shadow group"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <img
                        src={bookmark.favicon || "/placeholder.svg"}
                        alt=""
                        className="w-4 h-4 flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = "/simple-bookmark-icon.png";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-gray-900 hover:text-blue-600 truncate"
                          >
                            {bookmark.title}
                          </a>
                          <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {bookmark.snippet}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex flex-wrap gap-1">
                            {bookmark.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {bookmark.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{bookmark.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {bookmark.folder}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(bookmark.dateAdded).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEditBookmark(bookmark)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(bookmark)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddBookmarkModal
        open={showAddBookmark}
        onOpenChange={setShowAddBookmark}
        folders={folders}
      />
    </div>
  );
}
