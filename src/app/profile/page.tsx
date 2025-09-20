import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HistoryList from "@/components/plant-assist/history-list";
import ThemeSwitcher from "@/components/plant-assist/theme-switcher";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-3xl py-4 space-y-8">
      <header className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="https://picsum.photos/seed/user/200" alt="User" data-ai-hint="person avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold font-headline">User Profile</h1>
          <p className="text-muted-foreground">farmer@plantassist.com</p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your app preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="font-medium">App Theme</span>
            <ThemeSwitcher />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-headline">Identification History</h2>
        <HistoryList />
      </div>

      <div className="pt-4">
          <Button variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
          </Button>
      </div>
    </div>
  );
}
