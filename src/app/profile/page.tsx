
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HistoryList from "@/components/plant-assist/history-list";
import ThemeSwitcher from "@/components/plant-assist/theme-switcher";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User as UserIcon, Languages } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  if (!user) {
    router.push("/login");
    return null;
  }

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
          <h1 className="text-3xl font-bold font-headline">{user.displayName || 'User Profile'}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your app preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">App Theme</span>
            <ThemeSwitcher />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium flex items-center gap-2"><Languages className="w-5 h-5 text-primary"/>App Language</span>
            <Select defaultValue="en">
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
        <h2 className="text-2xl font-bold font-headline">Identification History</h2>
        <HistoryList />
      </div>

      <div className="pt-4">
        <Button variant="outline" className="w-full" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
