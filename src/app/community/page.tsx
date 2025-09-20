
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Send, ThumbsUp, MessageCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { usePosts } from '@/hooks/use-posts';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export default function CommunityPage() {
    const { user } = useAuth();
    const { posts, addPost, isLoaded, likePost, incrementCommentCount } = usePosts();
    const [newPostText, setNewPostText] = useState('');

    const handlePost = () => {
        if (newPostText.trim()) {
            addPost(newPostText);
            setNewPostText('');
        }
    }

    const sortedPosts = posts.sort((a, b) => b.timestamp - a.timestamp);

  return (
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
                    />
                    <Button onClick={handlePost}>
                        <Send className="mr-2"/> Post
                    </Button>
                </div>
            </CardContent>
        </Card>
        
        {!isLoaded ? (
            <div className="flex justify-center p-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary"/>
            </div>
        ) : sortedPosts.length > 0 ? (
            sortedPosts.map((post) => (
             <Card key={post.id} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                        <div className="relative aspect-video rounded-lg overflow-hidden border">
                            <Image 
                                src={post.image}
                                alt="Post image"
                                fill
                                className="object-cover"
                                data-ai-hint={post.imageHint}
                            />
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-start gap-6 border-t pt-4">
                    <Button variant="ghost" size="sm" className={cn("flex items-center gap-2 text-muted-foreground", post.isLiked && 'text-primary')} onClick={() => likePost(post.id)}>
                        <ThumbsUp className="w-5 h-5"/> {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground" onClick={() => incrementCommentCount(post.id)}>
                        <MessageCircle className="w-5 h-5"/> {post.comments} Comments
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
  );
}
