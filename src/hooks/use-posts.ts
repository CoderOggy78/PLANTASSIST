
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
      authorId: 'mock-user-tomato',
      authorName: 'Anjali Sharma',
      authorAvatar: 'https://picsum.photos/seed/avatar-anjali/100',
      authorAvatarFallback: 'AS',
      text: "My tomato plants are looking a bit yellow at the bottom. I'm thinking it's a nitrogen deficiency. Has anyone else seen this? What's the best organic fertilizer to fix it?",
      image: 'https://picsum.photos/seed/tomato-plant/600/400',
      imageHint: 'tomato plant',
      likes: 24,
      likedBy: [],
      comments: [
          { id: 'comment-tomato-1', authorId: 'mock-user-vikram', authorName: 'Vikram Singh', authorAvatar: 'https://picsum.photos/seed/avatar-vikram/100', authorAvatarFallback: 'VS', text: 'Definitely looks like a nitrogen issue. A good dose of compost tea or some fish emulsion should help green them up!', timestamp: Date.now() - 1000 * 60 * 30 },
      ],
      timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    },
    {
      authorId: 'mock-user-wheat',
      authorName: 'Balwinder Singh',
      authorAvatar: 'https://picsum.photos/seed/avatar-balwinder/100',
      authorAvatarFallback: 'BS',
      text: "The wheat crop is coming in nicely this year. The heads are looking full. Fingers crossed for good weather during the harvest period next month!",
      image: 'https://picsum.photos/seed/wheat-field/600/400',
      imageHint: 'wheat field',
      likes: 68,
      likedBy: [],
      comments: [],
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    },
    {
      authorId: 'mock-user-corn',
      authorName: 'Priya Patel',
      authorAvatar: 'https://picsum.photos/seed/avatar-priya/100',
      authorAvatarFallback: 'PP',
      text: "I'm seeing some strange tassels on my corn plants. Is this normal or a sign of some kind of stress? First time growing this variety.",
      image: 'https://picsum.photos/seed/corn-tassel/600/400',
      imageHint: 'corn tassel',
      likes: 12,
      likedBy: [],
      comments: [],
      timestamp: Date.now() - 1000 * 60 * 45, // 45 minutes ago
    },
    {
      authorId: 'mock-user-marigold',
      authorName: 'Ravi Desai',
      authorAvatar: 'https://picsum.photos/seed/avatar-ravi/100',
      authorAvatarFallback: 'RD',
      text: "Planted marigolds between my vegetable rows as a natural pest deterrent. They're looking beautiful and hopefully doing their job!",
      image: 'https://picsum.photos/seed/marigold-flower/600/400',
      imageHint: 'marigold flower',
      likes: 95,
      likedBy: [],
      comments: [],
      timestamp: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
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
        if (count === 0) {
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
