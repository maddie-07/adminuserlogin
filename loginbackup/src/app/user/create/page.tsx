"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Import ScrollArea and ScrollBar

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [wardName, setWardName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [issueTitle, setIssueTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewURL(previewURL);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile.name);
      console.log("Caption:", caption);
      console.log("Ward Name:", wardName);
      console.log("Location in Ward:", location);
      console.log("Issue Title:", issueTitle);
      console.log("Description of Issue:", description);
      // Upload logic here, including file and other form data
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewURL(null);
    setCaption("");
    setWardName("");
    setLocation("");
    setIssueTitle("");
    setDescription("");
  };

  return (
    <ScrollArea className="w-full h-screen"> {/* Add ScrollArea here */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className={`w-full max-w-2xl shadow-lg ${previewURL ? 'aspect-auto' : 'h-auto'}`}>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Create a New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              {!selectedFile ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-500 transition duration-200 ease-in-out">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      aria-hidden="true"
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16V6a4 4 0 014-4h2a4 4 0 014 4v10m5 4H3m14-4v4m-4-4v4"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <>
                  <div className="w-full mb-4">
                    {previewURL && (
                      <img
                        src={previewURL}
                        alt="Preview"
                        className="object-cover w-full h-full rounded-lg"
                        style={{ aspectRatio: '1 / 1' }}
                      />
                    )}
                  </div>

                  <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..."
                    className="w-full mb-4"
                    rows={2}
                  />

                  <Select onValueChange={(value) => setWardName(value)}>
                    <SelectTrigger className="w-full mb-4">
                      <SelectValue placeholder="Select Ward" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ward 1">Ward 1</SelectItem>
                      <SelectItem value="Ward 2">Ward 2</SelectItem>
                      <SelectItem value="Ward 3">Ward 3</SelectItem>
                      {/* Add more wards as needed */}
                    </SelectContent>
                  </Select>

                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location in Ward"
                    className="w-full mb-4"
                  />

                  <Input
                    type="text"
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    placeholder="Issue Title"
                    className="w-full mb-4"
                  />

                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description of Issue"
                    className="w-full mb-4"
                    rows={3}
                  />
                </>
              )}

              {selectedFile && (
                <>
                  <Button
                    onClick={handleUpload}
                    className="w-full bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Upload
                  </Button>

                  <Button
                    onClick={handleRemove}
                    className="mt-2 w-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                  >
                    Remove
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <ScrollBar orientation="vertical" /> {/* Add ScrollBar for vertical scrolling */}
    </ScrollArea>
  );
};

export default UploadPage;
