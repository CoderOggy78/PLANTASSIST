
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Leaf } from "lucide-react";

export default function ForgotPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-background">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <Link href="/" className="flex justify-center mb-4">
                        <Leaf className="w-12 h-12 text-primary" />
                    </Link>
                    <CardTitle className="text-2xl font-headline">Forgot Password</CardTitle>
                    <CardDescription>Enter your email to reset your password</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" required />
                        </div>
                        <Button type="submit" className="w-full">Send Reset Link</Button>
                        <div className="mt-4 text-center text-sm">
                            Remembered your password?{" "}
                            <Link href="/login" className="underline text-primary hover:text-primary/80">
                                Log in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
