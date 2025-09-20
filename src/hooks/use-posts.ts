
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';

export interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    authorAvatarFallback: string;
    text: string;
    timestamp: number;
}

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
  comments: Comment[];
  timestamp: number;
  isLiked?: boolean; // To track if the current user liked the post
}

const POSTS_STORAGE_KEY = 'plantassist-posts';

const initialMockPosts: Post[] = [
  {
    id: "mock-1",
    authorId: 'mock-user-1',
    authorName: 'John Doe',
    authorAvatar: 'https://picsum.photos/seed/avatar1/100',
    authorAvatarFallback: 'JD',
    text: "My tomato plants are getting these weird yellow spots on the leaves. I've tried neem oil but it doesn't seem to be working. Any suggestions?",
    image: 'https://picsum.photos/seed/sick-plant/600/400',
    imageHint: 'sick plant',
    likes: 12,
    comments: [
        { id: 'comment-1-1', authorId: 'mock-user-2', authorName: 'Jane Smith', authorAvatar: 'https://picsum.photos/seed/avatar2/100', authorAvatarFallback: 'JS', text: 'It might be a nutrient deficiency. Have you checked your soil pH?', timestamp: Date.now() - 1000 * 60 * 30 },
    ],
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
  },
  {
    id: "mock-2",
    authorId: 'mock-user-2',
    authorName: 'Jane Smith',
    authorAvatar: 'https://picsum.photos/seed/avatar2/100',
    authorAvatarFallback: 'JS',
    text: "Just wanted to share my success with using a baking soda spray for powdery mildew on my zucchini! Here's a before and after. So happy with the results!",
    image: 'https://picsum.photos/seed/harvest/600/400',
    imageHint: 'bountiful harvest',
    likes: 34,
    comments: [],
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
  },
  {
    id: "mock-3",
    authorId: 'mock-user-3',
    authorName: 'Samuel Green',
    authorAvatar: 'https://picsum.photos/seed/avatar3/100',
    authorAvatarFallback: 'SG',
    text: "Has anyone seen this kind of pest on their corn? They're small and black, and seem to be eating the silks. Not sure what to do.",
    image: 'https://picsum.photos/seed/corn-field/600/400',
    imageHint: 'corn field',
    likes: 5,
    comments: [],
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
        comments: [],
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

  const likePost = useCallback((postId: string) => {
    const updatedPosts = posts.map(p => {
        if (p.id === postId) {
            // In a real app, you'd prevent multiple likes from the same user.
            // For this demo, we'll just toggle the like.
            if (p.isLiked) {
                return { ...p, likes: p.likes - 1, isLiked: false };
            } else {
                return { ...p, likes: p.likes + 1, isLiked: true };
            }
        }
        return p;
    });
    savePosts(updatedPosts);
  }, [posts]);

  const addComment = useCallback((postId: string, commentText: string) => {
    if (!user) {
        console.error("User must be logged in to comment.");
        return;
    }
    const newComment: Comment = {
        id: new Date().toISOString(),
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous Farmer',
        authorAvatar: user.photoURL || `https://picsum.photos/seed/${user.uid}/100`,
        authorAvatarFallback: (user.displayName || 'A').charAt(0).toUpperCase(),
        text: commentText,
        timestamp: Date.now(),
    };
    const updatedPosts = posts.map(p => {
        if (p.id === postId) {
            const existingComments = Array.isArray(p.comments) ? p.comments : [];
            return { ...p, comments: [...existingComments, newComment] };
        }
        return p;
    });
    savePosts(updatedPosts);
  }, [user, posts]);


  return { posts, addPost, deletePost, likePost, addComment, isLoaded };
}
