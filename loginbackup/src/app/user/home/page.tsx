"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
}

interface Post {
  id: number;
  content: string;
  issue_id: number;
  user_id: number;
  image: string;
  resolve_count: number;
  created_at: string;
  updated_at: string;
  comments: Comment[];
  like_count: number;
  liked_by_user: boolean; // Added field
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [showCommentInput, setShowCommentInput] = useState<number | null>(null);
  const [showAllComments, setShowAllComments] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/users/home');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleAddComment = async (postId: number) => {
    try {
      const res = await fetch('/api/users/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: 2, // Replace with actual user_id
          content: newComment,
        }),
      });
      const addedComment = await res.json();
      setPosts(posts.map(post => 
        post.id === postId ? { 
          ...post, 
          comments: [...post.comments, addedComment].filter((comment, index, self) => 
            index === self.findIndex((c) => c.id === comment.id)
          )
        } : post
      ));
      setNewComment("");
      setShowCommentInput(null);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAddLike = async (postId: number) => {
    try {
      const res = await fetch('/api/users/home', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: 2, // Replace with actual user_id
        }),
      });

      if (res.status === 400) {
        const errorData = await res.json();
        console.error(errorData.error);
      } else {
        const { like_count } = await res.json();
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, like_count: like_count, liked_by_user: true } : post
        ));
      }
    } catch (error) {
      console.error('Error adding like:', error);
    }
  };

  const handleCommentInputToggle = (postId: number) => {
    setShowCommentInput(prev => (prev === postId ? null : postId));
  };

  const toggleShowAllComments = (postId: number) => {
    setShowAllComments(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <ScrollArea className="w-full h-screen">
      <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
        <div className="w-full max-w-5xl rounded-md border-gray-300">
          <div className="space-y-4 p-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex"
                style={{ maxWidth: "100%", marginBottom: "16px" }} // Ensure card doesn't exceed container width
              >
                <div className="relative w-1/3 h-90 flex-shrink-0">
                  <Image
                    src={`data:image/jpeg;base64,${post.image}`} // Image path
                    alt={`Post ${post.id} Image`}
                    layout="fill" // Ensure image scales correctly
                    objectFit="cover" // Ensure image covers its container
                    className="w-full h-full object-cover" // Cover image
                  />
                </div>
                <div className="p-4 w-2/3 flex flex-col max-h-[calc(100vh-2rem)] overflow-y-auto">
                  <p className="text-gray-800 font-bold text-xl">Issue #{post.issue_id}</p>
                  <p className="text-gray-600 text-base"><strong>Content:</strong> {post.content}</p>
                  <p className="text-gray-600 text-base"><strong>Resolve Count:</strong> {post.resolve_count}</p>
                  <p className="text-gray-600 text-base"><strong>Likes:</strong> {post.like_count}</p>
                  <p className="text-gray-500 text-sm">{new Date(post.created_at).toLocaleString()}</p>
                  
                  <div className="mt-4 flex items-center space-x-4">
                    <Button
                      onClick={() => handleAddLike(post.id)}
                      className={`${
                        post.liked_by_user ? "bg-blue-500" : "bg-gray-500"
                      } text-white hover:bg-opacity-80`}
                    >
                      Like ({post.like_count})
                    </Button>
                    <Button
                      onClick={() => handleCommentInputToggle(post.id)}
                      className="bg-gray-800 text-white hover:bg-gray-600"
                    >
                      {showCommentInput === post.id
                        ? "Hide Comment Box"
                        : "Add Comment"}
                    </Button>
                  </div>
                  <div className="mt-4 flex flex-col">
                    {post.comments.length > 0 && (
                      <div className="flex flex-col space-y-2">
                        {(
                          <p
                            onClick={() => toggleShowAllComments(post.id)}
                            className="text-blue-500 cursor-pointer hover:underline mt-2"
                          >
                            Show/Hide Comments
                          </p>
                        )}
                        {showAllComments[post.id] && post.comments.map((comment) => (
                          <div key={comment.id}>
                            <p className="text-gray-600 text-base">{comment.content}</p>
                            <span className="text-xs text-gray-500">{(comment.created_at)}</span>
                          </div>
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
                        className="border border-gray-300 p-2 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a comment..."
                      />
                      <Button
                        onClick={() => handleAddComment(post.id)}
                        className="ml-2 bg-gray-800 text-white hover:bg-gray-600"
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

export default HomePage;
