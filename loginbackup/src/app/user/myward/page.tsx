"use client";

import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Post {
  id: string;
  image: string;
  caption: string;
  wardName: string;
  locationInWard: string;
  issueTitle: string;
  descriptionOfIssue: string;
  likes: number;
  comments: string[];
  date: string;
  time: string;
}

const WardPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [showCommentInput, setShowCommentInput] = useState<string | null>(null);
  const [showAllComments, setShowAllComments] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const examplePosts: Post[] = [
      {
        id: "1",
        image: "/image1.jpg", // Local image path
        caption: "This is the first post",
        wardName: "Ward A",
        locationInWard: "Location X",
        issueTitle: "Issue 1",
        descriptionOfIssue: "This is the description of issue 1.",
        likes: 10,
        comments: [
          "Great post!",
          "Love it!",
          "This is amazing!",
          "Really informative!"
        ],
        date: "2024-08-09",
        time: "12:30 PM",
      },
      // Add more dummy posts as needed
    ];

    setPosts(examplePosts);
  }, []);

  const handleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleAddComment = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
    setNewComment(""); // Clear input after adding comment
    setShowCommentInput(null); // Hide input after adding comment
  };

  const handleCommentInputToggle = (postId: string) => {
    setShowCommentInput((prev) => (prev === postId ? null : postId));
  };

  const toggleShowAllComments = (postId: string) => {
    setShowAllComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <ScrollArea className="w-full h-screen">
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        <div className="w-full max-w-5xl rounded-lg border-gray-300">
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex"
                style={{ maxWidth: "100%", marginBottom: "20px" }} // Ensure card doesn't exceed container width
              >
                <div className="relative w-1/3 h-96 flex-shrink-0">
                  <Image
                    src={post.image} // Local image path
                    alt={`Post ${post.id} Image`}
                    layout="fill" // Ensure image scales correctly
                    objectFit="cover" // Ensure image covers its container
                    className="w-full h-full object-cover rounded-l-lg" // Cover image with rounded corners
                  />
                </div>
                <div className="p-6 w-2/3 flex flex-col max-h-[calc(100vh-2rem)] overflow-y-auto">
                  <h2 className="text-gray-800 font-bold text-2xl mb-2">{post.issueTitle}</h2>
                  <p className="text-gray-600 text-lg mb-1">{post.caption}</p>
                  <p className="text-gray-500 text-base mb-1">{`Ward: ${post.wardName}`}</p>
                  <p className="text-gray-500 text-base mb-1">{`Location: ${post.locationInWard}`}</p>
                  <p className="text-gray-700 text-base mb-4">{post.descriptionOfIssue}</p>
                  <p className="text-gray-400 text-sm mb-4">
                    {post.date} at {post.time}
                  </p>
                  <div className="mt-auto flex items-center space-x-4">
                    <Button
                      onClick={() => handleLike(post.id)}
                      className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md"
                    >
                      Like ({post.likes})
                    </Button>
                    <Button
                      onClick={() => handleCommentInputToggle(post.id)}
                      className="bg-gray-800 text-white hover:bg-gray-600 px-4 py-2 rounded-md"
                    >
                      {showCommentInput === post.id
                        ? "Hide Comment Box"
                        : "Add Comment"}
                    </Button>
                  </div>
                  <div className="mt-6">
                    {post.comments.length > 0 && (
                      <div className="flex flex-col space-y-3">
                        {post.comments.slice(0, 2).map((comment, index) => (
                          <p key={index} className="text-gray-600 text-base">
                            {comment}
                          </p>
                        ))}
                        {post.comments.length > 2 && !showAllComments[post.id] && (
                          <p
                            onClick={() => toggleShowAllComments(post.id)}
                            className="text-blue-500 cursor-pointer hover:underline"
                          >
                            Show More Comments
                          </p>
                        )}
                        {showAllComments[post.id] && post.comments.slice(2).map((comment, index) => (
                          <p key={index} className="text-gray-600 text-base">
                            {comment}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  {showCommentInput === post.id && (
                    <div className="mt-4 flex">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a comment..."
                      />
                      <Button
                        onClick={() => handleAddComment(post.id)}
                        className="ml-3 bg-gray-800 text-white hover:bg-gray-600 px-4 py-2 rounded-md"
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default WardPage;
