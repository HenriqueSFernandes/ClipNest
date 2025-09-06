"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Sparkles,
	Upload,
	LinkIcon,
	FileText,
	ImageIcon,
	File,
	XCircle,
} from "lucide-react";
import { api } from "@/lib/api";

interface Folder {
	id: string;
	name: string;
	count: number;
}

interface AddBookmarkModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	folders: Folder[];
}

const allowedFileTypes = {
	"application/pdf": [".pdf"],
	"application/msword": [".doc"],
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
		".docx",
	],
	"text/plain": [".txt"],
	"text/markdown": [".md"],
	"text/html": [".html"],
	"image/png": [".png"],
	"image/jpeg": [".jpg", ".jpeg"],
	"image/gif": [".gif"],
	"image/webp": [".webp"],
};

const acceptedFileExtensions = Object.values(allowedFileTypes).flat();
const maxFileSize = 10 * 1024 * 1024; // 10 MB

export function AddBookmarkModal({
	open,
	onOpenChange,
	folders,
}: AddBookmarkModalProps) {
	const [activeTab, setActiveTab] = useState("url");
	const [url, setUrl] = useState("");
	const [selectedFolder, setSelectedFolder] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [dragActive, setDragActive] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const validateFile = (file: File) => {
		const fileType = file.type;
		const fileExtension = `.${file.name.split(".").pop()}`;

		if (file.size > maxFileSize) {
			setError(`File size cannot exceed ${maxFileSize / 1024 / 1024} MB.`);
			return false;
		}

		if (
			allowedFileTypes[fileType as keyof typeof allowedFileTypes]?.includes(
				fileExtension,
			)
		) {
			setError(null);
			return true;
		}

		setError(
			`Invalid file type. Please upload one of the following: ${acceptedFileExtensions.join(
				", ",
			)}`,
		);
		return false;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (activeTab === "url" && (!url || !selectedFolder)) return;
		if (activeTab === "file" && (!selectedFile || !selectedFolder)) return;

		setIsLoading(true);

		try {
			if (activeTab === "url") {
				// await api.post("/bookmarks/upload", { url, folderId: selectedFolder });
			} else {
				const formData = new FormData();
				formData.append("file", selectedFile as Blob);
				formData.append("folderId", selectedFolder);
				console.log(formData)
				await api.post("/bookmarks/upload", formData);
			}

			resetForm();
			onOpenChange(false);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unexpected error occurred.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0];
			if (validateFile(file)) {
				setSelectedFile(file);
				setActiveTab("file");
			}
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			if (validateFile(file)) {
				setSelectedFile(e.target.files[0]);
			}
		}
	};

	const getFileIcon = (file: File) => {
		const type = file.type;
		if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
		if (type.includes("pdf")) return <FileText className="h-4 w-4" />;
		return <File className="h-4 w-4" />;
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return (
			Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
		);
	};

	const resetForm = () => {
		setUrl("");
		setSelectedFile(null);
		setSelectedFolder("");
		setActiveTab("url");
		setError(null);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				if (!open) resetForm();
				onOpenChange(open);
			}}
		>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add New Bookmark</DialogTitle>
					<DialogDescription>
						Save a website URL or upload a document to your bookmark collection.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="url" className="flex items-center space-x-2">
								<LinkIcon className="h-4 w-4" />
								<span>Website URL</span>
							</TabsTrigger>
							<TabsTrigger value="file" className="flex items-center space-x-2">
								<Upload className="h-4 w-4" />
								<span>Upload File</span>
							</TabsTrigger>
						</TabsList>

						<TabsContent value="url" className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="url">Website URL</Label>
								<Input
									id="url"
									type="url"
									placeholder="https://example.com"
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									required={activeTab === "url"}
								/>
								<p className="text-xs text-gray-500">
									We&apos;ll automatically extract the title, description, and
									content from the webpage.
								</p>
							</div>
						</TabsContent>

						<TabsContent value="file" className="space-y-4">
							<div className="space-y-2">
								<Label>Upload Document</Label>
								<div
									className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
											? "border-blue-400 bg-blue-50"
											: selectedFile
												? "border-green-400 bg-green-50"
												: "border-gray-300 hover:border-gray-400"
										}`}
									onDragEnter={handleDrag}
									onDragLeave={handleDrag}
									onDragOver={handleDrag}
									onDrop={handleDrop}
								>
									{selectedFile ? (
										<div className="space-y-2">
											<div className="flex items-center justify-center space-x-2 text-green-600">
												{getFileIcon(selectedFile)}
												<span className="font-medium">{selectedFile.name}</span>
											</div>
											<p className="text-sm text-gray-500">
												{formatFileSize(selectedFile.size)}
											</p>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => setSelectedFile(null)}
											>
												Remove File
											</Button>
										</div>
									) : (
										<div className="space-y-2">
											<Upload className="h-8 w-8 text-gray-400 mx-auto" />
											<div>
												<p className="text-sm font-medium text-gray-900">
													Drop your file here, or{" "}
													<label className="text-blue-600 hover:text-blue-500 cursor-pointer">
														browse
														<input
															type="file"
															className="hidden"
															onChange={handleFileChange}
															accept={acceptedFileExtensions.join(",")}
														/>
													</label>
												</p>
												<p className="text-xs text-gray-500 mt-1">
													Supports PDF, Word docs, images, text files, and more
												</p>
												<p className="text-xs text-gray-500 mt-1">
													Max file size: {maxFileSize / 1024 / 1024} MB
												</p>
											</div>
										</div>
									)}
								</div>
								{error && (
									<div className="flex items-center space-x-2 text-red-600">
										<XCircle className="h-4 w-4" />
										<p className="text-xs">{error}</p>
									</div>
								)}
								{selectedFile && !error && (
									<p className="text-xs text-gray-500">
										We'll extract text content and make it searchable through
										AI.
									</p>
								)}
							</div>
						</TabsContent>
					</Tabs>

					<div className="space-y-2">
						<Label htmlFor="folder">Folder</Label>
						<Select
							value={selectedFolder}
							onValueChange={setSelectedFolder}
							required
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a folder" />
							</SelectTrigger>
							<SelectContent>
								{folders.map((folder) => (
									<SelectItem key={folder.id} value={folder.name}>
										{folder.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
						<div className="flex items-center space-x-2 mb-1">
							<Sparkles className="h-4 w-4 text-blue-600" />
							<span className="text-sm font-medium text-blue-900">
								AI Enhancement
							</span>
						</div>
						<p className="text-xs text-blue-700">
							{activeTab === "url"
								? "Once saved, you can ask our AI to summarize this webpage, find related content, or answer questions about it!"
								: "Once uploaded, you can ask our AI to summarize the document, extract key information, or search within its content!"}
						</p>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={
								isLoading ||
								!selectedFolder ||
								(activeTab === "url" && !url) ||
								(activeTab === "file" && !selectedFile)
							}
						>
							{isLoading
								? activeTab === "url"
									? "Adding Bookmark..."
									: "Uploading File..."
								: activeTab === "url"
									? "Add Bookmark"
									: "Upload & Save"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
