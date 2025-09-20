
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sprout } from "lucide-react";
import Image from "next/image";
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto grid w-[350px] gap-6">
                    <Card className="w-full max-w-sm shadow-xl border-none sm:border">
                        <CardHeader className="text-center">
                            <Link href="/" className="flex justify-center mb-4">
                                <Sprout className="w-14 h-14 text-primary" />
                            </Link>
                            <CardTitle className="text-3xl font-headline">Forgot Password</CardTitle>
                            <CardDescription className="text-md">Enter your email to reset your password</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="you@example.com" required />
                                </div>
                                <Button type="submit" className="w-full font-semibold">Send Reset Link</Button>
                                <div className="mt-4 text-center text-sm">
                                    Remembered your password?{" "}
                                    <motion.div whileTap={{ scale: 0.95 }} className="inline-block">
                                        <Link href="/login" className="underline text-primary hover:text-primary/80">
                                            Log in
                                        </Link>
                                    </motion.div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative">
                <Image
                    src="https://picsum.photos/seed/forest-path/1200/1800"
                    alt="Lush forest path"
                    fill
                    className="object-cover"
                    data-ai-hint="forest path"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"></div>
            </div>
        </div>
    );
}
