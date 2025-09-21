
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import {
    listenToPosts,
    addPostFirestore,
    deletePostFirestore,
    likePostFirestore,
    addCommentFirestore,
    getPostsCount,
} from '@/lib/firebase/firestore';
import { Unsubscribe } from 'firebase/firestore';


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
  likedBy?: string[]; // Array of user IDs who liked the post
  comments: Comment[];
  timestamp: number;
  isLiked?: boolean; // Client-side state
}

const initialMockPosts: Omit<Post, 'id'>[] = [
    {
        authorId: 'mockuser2',
        authorName: 'Community Manager',
        authorAvatar: `https://picsum.photos/seed/cm/100`,
        authorAvatarFallback: 'C',
        text: 'Welcome to the PlantAssist Community Forum! 🌱 Share your farming successes, ask questions, and connect with fellow farmers. Let\'s grow together!',
        likes: 15,
        likedBy: [],
        comments: [],
        timestamp: Date.now() - 86400000, // 1 day ago
    }
];


export function usePosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // One-time initialization for mock data
  useEffect(() => {
    const initializePosts = async () => {
        const count = await getPostsCount();
        if (count === 0 && initialMockPosts.length > 0) {
            console.log("No posts found in Firestore, populating with mock data...");
            for (const postData of initialMockPosts) {
                await addPostFirestore(postData);
            }
        }
    }
    initializePosts();
  }, []);

  useEffect(() => {
    setIsLoaded(false);
    const unsubscribe = listenToPosts((allPosts) => {
        const processedPosts = allPosts.map(p => ({
            ...p,
            comments: Array.isArray(p.comments) ? p.comments : [],
            isLiked: !!(user && p.likedBy && p.likedBy.includes(user.uid)),
        }));
        setPosts(processedPosts);
        setIsLoaded(true);
    });
    
    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [user]);


  const addPost = useCallback(async (text: string) => {
    if (!user) {
        console.error("User must be logged in to post.");
        return;
    }
    const newPost: Omit<Post, 'id'> = {
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous Farmer',
        authorAvatar: user.photoURL || `https://picsum.photos/seed/${user.uid}/100`,
        authorAvatarFallback: (user.displayName || 'A').charAt(0).toUpperCase(),
        text: text,
        likes: 0,
        likedBy: [],
        comments: [],
        timestamp: Date.now(),
    };
    
    await addPostFirestore(newPost);
  }, [user]);

  const deletePost = useCallback(async (postId: string) => {
     if (!user) {
        console.error("User must be logged in to delete posts.");
        return;
    }
    const postToDelete = posts.find(p => p.id === postId);
    if (postToDelete && postToDelete.authorId !== user.uid) {
        console.error("User is not authorized to delete this post.");
        return;
    }
    await deletePostFirestore(postId);
  }, [user, posts]);

  const likePost = useCallback(async (postId: string) => {
     if (!user) {
        console.error("User must be logged in to like posts.");
        return;
    }
    await likePostFirestore(postId, user.uid);
  }, [user]);

  const addComment = useCallback(async (postId: string, commentText: string) => {
    if (!user) {
        console.error("User must be logged in to comment.");
        return;
    }
    const newComment: Comment = {
        id: new Date().toISOString() + user.uid, // Unique ID for the comment
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous Farmer',
        authorAvatar: user.photoURL || `https://picsum.photos/seed/currentuser/100`,
        authorAvatarFallback: (user.displayName || 'A').charAt(0).toUpperCase(),
        text: commentText,
        timestamp: Date.now(),
    };
    
    await addCommentFirestore(postId, newComment);
  }, [user]);


  return { posts, addPost, deletePost, likePost, addComment, isLoaded };
}
