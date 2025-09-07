"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { FolderSidebar } from "@/components/folder-sidebar";
import { AIChatInterface } from "@/components/ai-chat-interface";
import { BookmarkManagement } from "@/components/bookmark-management";
import { AddFolderModal } from "@/components/add-folder-modal";
import { EditBookmarkModal } from "@/components/edit-bookmark-modal";
import { api } from "@/lib/api";

export type ViewMode = "ai-chat" | "bookmark-management";

export interface Bookmark {
	id: string;
	title: string;
	url: string;
	favicon: string;
	snippet: string;
	dateAdded: string;
	folder: number;
	content: string;
	tags: string[];
}

export interface Folder {
	id: number;
	name: string;
	count: number;
}

export default function DashboardPage() {
	const [viewMode, setViewMode] = useState<ViewMode>("ai-chat");
	const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
	const [isBookmarksLoading, setIsBookmarksLoading] = useState(false);
	const [showAddFolder, setShowAddFolder] = useState(false);
	const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

	const [folders, setFolders] = useState<Folder[]>([]);
	const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
	useEffect(() => {
		const fetchFolders = async () => {
			try {
				const fetchedFolders = await api.get("/folders");
				const parsedFolders: Folder[] = fetchedFolders.map((folder: any) => ({
					id: folder.id,
					name: folder.name,
					count: 10, // Placeholder count, replace with actual data if available
				}));
				setFolders(parsedFolders);
			} catch (error) {
				console.error("Failed to fetch folders:", error);
			}
		};

		fetchFolders();
	}, []);

	useEffect(() => {
		const fetchBookmarks = async () => {
			if (selectedFolderId === null) {
				setBookmarks([]);
				return;
			}

			setIsBookmarksLoading(true);
			try {
				const fetchedBookmarks = await api.get(
					`/folders/${selectedFolderId}/bookmarks`,
				);
				console.log("Fetched bookmarks:", fetchedBookmarks);
				const parsedBookmarks: Bookmark[] = fetchedBookmarks.map(
					(bookmark: any) => ({
						id: bookmark.id,
						title: bookmark.title,
						url: "https://example.com", // TODO: replace with actual URL
						favicon: "/favicon.ico", // TODO: replace with actual favicon URL
						snippet: "This is a sample snippet of the bookmark content.",
						dateAdded: new Date(bookmark.createdAt).toISOString().split("T")[0],
						folder: bookmark.folder_id,
						content: "TEMP",
						tags: [],
					}),
				);
				setBookmarks(parsedBookmarks);
			} catch (error) {
				console.error("Failed to fetch bookmarks:", error);
			} finally {
				setIsBookmarksLoading(false);
			}
		};

		fetchBookmarks();
	}, [selectedFolderId]);

	// const [bookmarks, setBookmarks] = useState<Bookmark[]>([
	//   {
	//     id: "1",
	//     title: "React Documentation",
	//     url: "https://react.dev",
	//     favicon: "/react-logo.png",
	//     snippet:
	//       "The library for web and native user interfaces. React lets you build user interfaces out of individual pieces called components.",
	//     dateAdded: "2024-01-15",
	//     folder: "Learning",
	//     content:
	//       "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components...",
	//     tags: ["javascript", "frontend", "library"],
	//   },
	// ])

	const handleDeleteBookmark = (bookmarkId: string) => {
		setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
		// Update folder counts
		const deletedBookmark = bookmarks.find((b) => b.id === bookmarkId);
		if (deletedBookmark) {
			setFolders((prev) =>
				prev.map((f) =>
					f.id === deletedBookmark.folder ? { ...f, count: f.count - 1 } : f,
				),
			);
		}
	};

	const handleUpdateBookmark = (updatedBookmark: Bookmark) => {
		setBookmarks((prev) =>
			prev.map((b) => (b.id === updatedBookmark.id ? updatedBookmark : b)),
		);
		setEditingBookmark(null);
	};

	const handleFolderAdded = (newFolder: Folder) => {
		setFolders((prevFolders) => [...prevFolders, newFolder]);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<DashboardHeader viewMode={viewMode} onViewModeChange={setViewMode} />

			<div className="flex h-[calc(100vh-73px)]">
				<FolderSidebar
					folders={folders}
					selectedFolder={selectedFolderId}
					onSelectFolder={setSelectedFolderId}
					onAddFolder={() => setShowAddFolder(true)}
					viewMode={viewMode}
				/>

				<main className="flex-1 flex flex-col">
					{viewMode === "ai-chat" ? (
						<AIChatInterface
							bookmarks={bookmarks}
							folders={folders}
							selectedFolder={selectedFolderId}
							isLoading={isBookmarksLoading}
							onSwitchToManagement={() => setViewMode("bookmark-management")}
						/>
					) : (
						<BookmarkManagement
							bookmarks={bookmarks}
							folders={folders}
							selectedFolder={selectedFolderId}
							isLoading={isBookmarksLoading}
							onEditBookmark={setEditingBookmark}
							onDeleteBookmark={handleDeleteBookmark}
							onSwitchToAI={() => setViewMode("ai-chat")}
						/>
					)}
				</main>
			</div>

			<AddFolderModal
				open={showAddFolder}
				onOpenChange={setShowAddFolder}
				onFolderAdded={handleFolderAdded}
			/>

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
	);
}
