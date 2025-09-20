
"use client";

import { useState } from 'react';
import { Post, Comment } from '@/hooks/use-posts';
import { useAuth } from '@/hooks/use-auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface CommentDialogProps {
  post: Post | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddComment: (postId: string, commentText: string) => void;
}

export default function CommentDialog({ post, isOpen, onOpenChange, onAddComment }: CommentDialogProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddComment = async () => {
    if (newComment.trim() && post) {
      setIsSubmitting(true);
      await onAddComment(post.id, newComment);
      setNewComment('');
      setIsSubmitting(false);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Comments on {post.authorName}'s post</DialogTitle>
          <DialogDescription>
            Replying to: "{post.text.substring(0, 50)}..."
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4">
            {post.comments && post.comments.length > 0 ? (
                post.comments
                .sort((a,b) => a.timestamp - b.timestamp)
                .map((comment: Comment) => (
                    <div key={comment.id} className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.authorAvatar} data-ai-hint="person avatar"/>
                            <AvatarFallback>{comment.authorAvatarFallback}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-muted p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-semibold text-sm">{comment.authorName}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                                </p>
                            </div>
                            <p className="text-sm text-foreground/90">{comment.text}</p>
                        </div>
                    </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-10">
                <MessageCircle className="mx-auto w-12 h-12" />
                <p className="mt-2">No comments yet. Be the first to reply!</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-6 border-t mt-auto">
            <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/currentuser/100"} data-ai-hint="person avatar"/>
                    <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <Input 
                    placeholder="Write a comment..." 
                    className="flex-1" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button onClick={handleAddComment} disabled={isSubmitting || !newComment.trim()}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>}
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
