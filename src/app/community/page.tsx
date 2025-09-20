
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Send, ThumbsUp, MessageCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { usePosts, Post } from '@/hooks/use-posts';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import CommentDialog from '@/components/plant-assist/comment-dialog';
import { motion } from 'framer-motion';

export default function CommunityPage() {
    const { user, loading: authLoading } = useAuth();
    const { posts, addPost, isLoaded, likePost, addComment } = usePosts();
    const [newPostText, setNewPostText] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
    const [zoomedImageId, setZoomedImageId] = useState<string | null>(null);

    const handlePost = async () => {
        if (newPostText.trim()) {
            setIsPosting(true);
            await addPost(newPostText);
            setNewPostText('');
            setIsPosting(false);
        }
    }
    
    const handleCommentClick = (post: Post) => {
        setSelectedPost(post);
        setIsCommentDialogOpen(true);
    };

    const handleImageClick = (postId: string) => {
        setZoomedImageId(zoomedImageId === postId ? null : postId);
    };

    const sortedPosts = posts.sort((a, b) => b.timestamp - a.timestamp);

  return (
    <>
    <div className="container mx-auto max-w-3xl py-4">
       <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary font-headline flex items-center justify-center gap-3">
            <Users className="w-8 h-8"/>
            Community Forum
        </h1>
        <p className="text-muted-foreground">Share knowledge and connect with other farmers.</p>
      </header>
      
      <div className="space-y-6">
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/mainuser/100"} data-ai-hint="person avatar"/>
                        <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <Input 
                        placeholder="What's on your mind?" 
                        className="flex-1" 
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                        disabled={isPosting}
                    />
                    <Button onClick={handlePost} disabled={isPosting}>
                        {isPosting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>} Post
                    </Button>
                </div>
            </CardContent>
        </Card>
        
        {(!isLoaded || authLoading) ? (
            <div className="flex justify-center p-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary"/>
            </div>
        ) : sortedPosts.length > 0 ? (
            sortedPosts.map((post) => (
             <Card key={post.id} className="hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={post.authorAvatar} data-ai-hint="person avatar"/>
                            <AvatarFallback>{post.authorAvatarFallback}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg font-semibold">{post.authorName}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground whitespace-pre-wrap">{post.text}</p>
                    {post.image && (
                        <motion.div 
                            className="relative aspect-video rounded-lg overflow-hidden border cursor-pointer"
                            onClick={() => handleImageClick(post.id)}
                            animate={{ 
                                scale: zoomedImageId === post.id ? 1.1 : 1,
                                rotateY: zoomedImageId === post.id ? 10 : 0
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            style={{ perspective: '1000px' }}
                        >
                            <Image 
                                src={post.image}
                                alt="Post image"
                                fill
                                className="object-cover"
                                data-ai-hint={post.imageHint}
                            />
                        </motion.div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-start gap-6 border-t pt-4">
                    <Button variant="ghost" size="sm" className={cn("flex items-center gap-2 text-muted-foreground", post.isLiked && 'text-primary')} onClick={() => likePost(post.id)}>
                        <ThumbsUp className="w-5 h-5"/> {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground" onClick={() => handleCommentClick(post)}>
                        <MessageCircle className="w-5 h-5"/> {post.comments?.length || 0} Comments
                    </Button>
                </CardFooter>
             </Card>
            ))
        ) : (
             <Card>
                <CardContent className="p-10 text-center">
                    <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
                </CardContent>
             </Card>
        )}
      </div>
    </div>
    
    <CommentDialog 
        post={selectedPost}
        isOpen={isCommentDialogOpen}
        onOpenChange={setIsCommentDialogOpen}
        onAddComment={addComment}
    />
    </>
  );
}
