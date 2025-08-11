/* eslint-disable @next/next/no-img-element */
"use client";

import { ExternalLink, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon: string;
  snippet: string;
  dateAdded: string;
  folder: string;
}

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  selectedFolder: string | null;
}

export function BookmarkGrid({ bookmarks, selectedFolder }: BookmarkGridProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ExternalLink className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No bookmarks found
        </h3>
        <p className="text-gray-500 max-w-sm">
          {selectedFolder
            ? `No bookmarks in "${selectedFolder}" folder yet. Add your first bookmark to get started.`
            : "You haven't saved any bookmarks yet. Add your first bookmark to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {selectedFolder ? `${selectedFolder} Bookmarks` : "All Bookmarks"}
        </h2>
        <span className="text-sm text-gray-500">
          {bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <Card
            key={bookmark.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
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
                      className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                    >
                      {bookmark.title}
                    </a>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {bookmark.snippet}
                </p>

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
    </div>
  );
}
