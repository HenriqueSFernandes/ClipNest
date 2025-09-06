"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";

import type { Folder } from "@/app/dashboard/page";

interface AddFolderModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onFolderAdded: (newFolder: Folder) => void;
}

export function AddFolderModal({
	open,
	onOpenChange,
	onFolderAdded,
}: AddFolderModalProps) {
	const [folderName, setFolderName] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!folderName.trim()) return;

		setIsLoading(true);

		try {
			const formData = new FormData();
			formData.append("name", folderName.trim());
			const { id, name } = (await api.post("/folders", formData)) as {
				id: string;
				name: string;
			};
			onFolderAdded({
				id,
				name,
				count: 0,
			});
		} catch (err: unknown) {
			// TODO: Show error to user
			console.error("Failed to create folder:", err);
		} finally {
			setIsLoading(false);
			setFolderName("");
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Create New Folder</DialogTitle>
					<DialogDescription>
						Enter a name for your new bookmark folder.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="folder-name">Folder Name</Label>
						<Input
							id="folder-name"
							type="text"
							placeholder="Enter folder name"
							value={folderName}
							onChange={(e) => setFolderName(e.target.value)}
							required
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading || !folderName.trim()}>
							{isLoading ? "Creating..." : "Create Folder"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
