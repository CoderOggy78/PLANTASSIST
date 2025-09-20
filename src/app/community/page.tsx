
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Send, ThumbsUp, MessageCircle } from 'lucide-react';
import Image from 'next/image';

const mockPosts = [
  {
    id: 1,
    author: 'John Doe',
    avatar: 'https://picsum.photos/seed/avatar1/100',
    avatarFallback: 'JD',
    text: "My tomato plants are getting these weird yellow spots on the leaves. I've tried neem oil but it doesn't seem to be working. Any suggestions?",
    image: 'https://picsum.photos/seed/post1/600/400',
    imageHint: 'yellow leaf spots',
    likes: 12,
    comments: 4,
  },
  {
    id: 2,
    author: 'Jane Smith',
    avatar: 'https://picsum.photos/seed/avatar2/100',
    avatarFallback: 'JS',
    text: "Just wanted to share my success with using a baking soda spray for powdery mildew on my zucchini! Here's a before and after. So happy with the results!",
    image: 'https://picsum.photos/seed/post2/600/400',
    imageHint: 'healthy zucchini plant',
    likes: 34,
    comments: 9,
  },
  {
    id: 3,
    author: 'Samuel Green',
    avatar: 'https://picsum.photos/seed/avatar3/100',
    avatarFallback: 'SG',
    text: "Has anyone seen this kind of pest on their corn? They're small and black, and seem to be eating the silks. Not sure what to do.",
    image: 'https://picsum.photos/seed/post3/600/400',
    imageHint: 'corn pest',
    likes: 5,
    comments: 2,
  },
];


export default function CommunityPage() {
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
                        <AvatarImage src="https://picsum.photos/seed/mainuser/100" data-ai-hint="person avatar"/>
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <Input placeholder="What's on your mind?" className="flex-1" />
                    <Button>
                        <Send className="mr-2"/> Post
                    </Button>
                </div>
            </CardContent>
        </Card>

        {mockPosts.map((post) => (
             <Card key={post.id}>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={post.avatar} data-ai-hint="person avatar"/>
                            <AvatarFallback>{post.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg font-semibold">{post.author}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{post.text}</p>
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
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                        <ThumbsUp className="w-5 h-5"/> {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                        <MessageCircle className="w-5 h-5"/> {post.comments} Comments
                    </Button>
                </CardFooter>
             </Card>
        ))}

      </div>
    </div>
  );
}
