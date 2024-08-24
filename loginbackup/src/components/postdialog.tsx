import React from 'react';
import { DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface User {
  name: string;
  ward: string;
  address: string;
  profilePicture: string;
}

interface Post {
  id: number;
  title: string;
  image: string;
  description: string;
  likes: number;
  comments: number;
  time: string;
  wardNumber: number;
  user: User;
}

interface PostDialogProps {
  post: Post;
}

export const PostDialog: React.FC<PostDialogProps> = ({ post }) => {
  return (
    <DialogContent>
      <div className="flex items-center">
        <img
          src={post.user.profilePicture}
          alt={post.user.name}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h3 className="text-lg font-bold">{post.user.name}</h3>
          <p className="text-sm text-gray-500">{post.time}</p>
        </div>
      </div>
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-64 object-cover my-4 rounded-lg"
      />
      <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.description}</p>
      <div className="flex justify-between text-gray-600 text-sm mb-4">
        <span>{post.likes} Likes</span>
        <span>{post.comments} Comments</span>
      </div>
      <p className="text-gray-500 text-sm">Ward: {post.wardNumber}</p>
      <DialogFooter>
        <Button onClick={() => console.log('Liked!')}>Like</Button>
        <Button onClick={() => console.log('Commented!')}>Comment</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default PostDialog;
