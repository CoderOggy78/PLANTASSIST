
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
    authorId: 'mock-user-organic',
    authorName: 'Meera Reddy',
    authorAvatar: 'https://picsum.photos/seed/avatar-meera/100',
    authorAvatarFallback: 'MR',
    text: "I've been dealing with a stubborn aphid problem on my hibiscus plants. I want to stick to organic methods. Has anyone had success with a homemade soap spray? What recipe did you use?",
    image: 'https://picsum.photos/seed/aphids-plant/600/400',
    imageHint: 'aphids plant',
    likes: 18,
    likedBy: [],
    comments: [
        { id: 'comment-organic-1', authorId: 'mock-user-vikram', authorName: 'Vikram Singh', authorAvatar: 'https://picsum.photos/seed/avatar-vikram/100', authorAvatarFallback: 'VS', text: 'A simple mix of 1 tablespoon of mild dish soap in 1 liter of water works wonders for me. Spray it in the evening to avoid leaf burn!', timestamp: Date.now() - 1000 * 60 * 45 },
    ],
    timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
  },
  {
    authorId: 'mock-user-compost',
    authorName: 'Sunita Chauhan',
    authorAvatar: 'https://picsum.photos/seed/avatar-sunita/100',
    authorAvatarFallback: 'SC',
    text: "After six months of patience, my first compost batch is finally ready! The soil looks so rich and dark. Can't wait to add this 'black gold' to my vegetable beds this weekend.",
    image: 'https://picsum.photos/seed/compost-soil/600/400',
    imageHint: 'compost soil',
    likes: 42,
    likedBy: [],
    comments: [],
    timestamp: Date.now() - 1000 * 60 * 60 * 22, // 22 hours ago
  },
  {
    authorId: 'mock-user-harvest',
    authorName: 'Rajesh Kumar',
    authorAvatar: 'https://picsum.photos/seed/avatar-rajesh/100',
    authorAvatarFallback: 'RK',
    text: "The first sunflower of the season just bloomed! It's always such a rewarding sight. Hope everyone's having a productive week in their gardens.",
    image: 'https://picsum.photos/seed/sunflower-bloom/600/400',
    imageHint: 'sunflower bloom',
    likes: 57,
    likedBy: [],
    comments: [],
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
  },
  {
    authorId: 'mock-user-question',
    authorName: 'Fatima Ansari',
    authorAvatar: 'https://picsum.photos/seed/avatar-fatima/100',
    authorAvatarFallback: 'FA',
    text: "Quick question for the community: Is it too late in the season to plant a new batch of spinach? I'm in the central plains region and the weather seems mild. Any thoughts?",
    likes: 8,
    likedBy: [],
    comments: [],
    timestamp: Date.now() - 1000 * 60 * 90, // 90 minutes ago
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
