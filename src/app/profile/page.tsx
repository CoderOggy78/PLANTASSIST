
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HistoryList from "@/components/plant-assist/history-list";
import ThemeSwitcher from "@/components/plant-assist/theme-switcher";
import { useAuth } from "@/hooks/use-auth";
import { usePosts } from "@/hooks/use-posts";
import { LogOut, User as UserIcon, Languages, Trash2, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocalization } from "@/hooks/use-localization";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ProfilePage() {
  const { user, signOut, loading } = useAuth();
  const { posts, deletePost, isLoaded: postsLoaded } = usePosts();
  const router = useRouter();
  const { language, setLanguage, t } = useLocalization();

  if (loading) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  if (!user) {
    router.push("/login");
    return null;
  }
  
  const userPosts = posts.filter(post => post.authorId === user.uid).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="container mx-auto max-w-3xl py-4 space-y-8">
      <header className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.photoURL || "https://picsum.photos/seed/user/200"} alt={user.displayName || "User"} data-ai-hint="person avatar" />
          <AvatarFallback>
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon />}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold font-headline">{user.displayName || t('userProfile')}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings')}</CardTitle>
          <CardDescription>{t('managePreferences')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{t('appTheme')}</span>
            <ThemeSwitcher />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium flex items-center gap-2"><Languages className="w-5 h-5 text-primary"/>{t('appLanguage')}</span>
            <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'hi' | 'mr' | 'gu')}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                    <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                    <SelectItem value="gu">Gujarati (ગુજરાતી)</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-headline">My Posts</h2>
        {userPosts.length > 0 ? (
          <div className="space-y-4">
            {userPosts.map(post => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <p className="text-muted-foreground">{post.text}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center bg-muted/50 p-3">
                   <p className="text-xs text-muted-foreground">
                        Posted on {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4 mr-2"/> Delete
                         </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete your post. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deletePost(post.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50"/>
                <p className="mt-4 text-muted-foreground">You haven't posted anything yet.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-headline">{t('identificationHistory')}</h2>
        <HistoryList />
      </div>

      <div className="pt-4">
        <Button variant="outline" className="w-full" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          {t('logOut')}
        </Button>
      </div>
    </div>
  );
}
