
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorAvatarFallback: string;
  text: string;
  image?: string;
  imageHint?: string;
  likes: number;
  comments: number;
  timestamp: number;
}

const POSTS_STORAGE_KEY = 'plantassist-posts';

const initialMockPosts = [
  {
    id: "mock-1",
    authorId: 'mock-user-1',
    authorName: 'John Doe',
    authorAvatar: 'https://picsum.photos/seed/avatar1/100',
    authorAvatarFallback: 'JD',
    text: "My tomato plants are getting these weird yellow spots on the leaves. I've tried neem oil but it doesn't seem to be working. Any suggestions?",
    image: 'https://picsum.photos/seed/yellow-leaf/600/400',
    imageHint: 'yellow spots',
    likes: 12,
    comments: 4,
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
  },
  {
    id: "mock-2",
    authorId: 'mock-user-2',
    authorName: 'Jane Smith',
    authorAvatar: 'https://picsum.photos/seed/avatar2/100',
    authorAvatarFallback: 'JS',
    text: "Just wanted to share my success with using a baking soda spray for powdery mildew on my zucchini! Here's a before and after. So happy with the results!",
    image: 'https://picsum.photos/seed/healthy-zucchini/600/400',
    imageHint: 'healthy plant',
    likes: 34,
    comments: 9,
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
  },
  {
    id: "mock-3",
    authorId: 'mock-user-3',
    authorName: 'Samuel Green',
    authorAvatar: 'https://picsum.photos/seed/avatar3/100',
    authorAvatarFallback: 'SG',
    text: "Has anyone seen this kind of pest on their corn? They're small and black, and seem to be eating the silks. Not sure what to do.",
    image: 'https://picsum.photos/seed/corn-pest/600/400',
    imageHint: 'corn pest',
    likes: 5,
    comments: 2,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
  },
];


export function usePosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        // If no posts in storage, initialize with mock posts
        setPosts(initialMockPosts);
        localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(initialMockPosts));
      }
    } catch (error) {
      console.error("Failed to load posts from localStorage", error);
      setPosts(initialMockPosts);
    }
    setIsLoaded(true);
  }, []);

  const savePosts = (newPosts: Post[]) => {
      setPosts(newPosts);
      try {
        localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(newPosts));
      } catch (error) {
        console.error("Failed to save posts to localStorage", error);
      }
  }

  const addPost = useCallback((text: string) => {
    if (!user) {
        console.error("User must be logged in to post.");
        return;
    }
    const newPost: Post = {
        id: new Date().toISOString(),
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous Farmer',
        authorAvatar: user.photoURL || `https://picsum.photos/seed/${user.uid}/100`,
        authorAvatarFallback: (user.displayName || 'A').charAt(0).toUpperCase(),
        text: text,
        likes: 0,
        comments: 0,
        timestamp: Date.now(),
    };
    
    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
  }, [user, posts]);

  const deletePost = useCallback((postId: string) => {
     if (!user) {
        console.error("User must be logged in to delete posts.");
        return;
    }
    const postToDelete = posts.find(p => p.id === postId);
    if (postToDelete && postToDelete.authorId !== user.uid) {
        console.error("User is not authorized to delete this post.");
        return;
    }
    const updatedPosts = posts.filter(p => p.id !== postId);
    savePosts(updatedPosts);
  }, [user, posts]);

  return { posts, addPost, deletePost, isLoaded };
}
