
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sprout, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import Image from "next/image";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,34.546,44,29.836,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
    )
}

export default function LoginPage() {
    const { signInWithEmail, signInWithGoogle, user } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await signInWithEmail(email, password);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        setGoogleLoading(true);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setGoogleLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            router.push('/home');
        }
    }, [user, router]);


    if (user) {
        return null;
    }

    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
             <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto grid w-[350px] gap-6">
                    <Card className="w-full max-w-sm shadow-xl border-none sm:border">
                        <CardHeader className="text-center">
                            <Link href="/" className="flex justify-center mb-4">
                                <Sprout className="w-14 h-14 text-primary" />
                            </Link>
                            <CardTitle className="text-3xl font-headline">Welcome Back</CardTitle>
                            <CardDescription className="text-md">Log in to your PlantAssist account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertTitle>Login Failed</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                                <div className="text-sm">
                                    <Link href="/forgot-password" passHref className="underline text-primary hover:text-primary/80">Forgot password?</Link>
                                </div>
                                <Button type="submit" className="w-full font-semibold" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Log In
                                </Button>
                            </form>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full font-semibold" onClick={handleGoogleSignIn} disabled={googleLoading}>
                                {googleLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <GoogleIcon className="mr-2" />
                                )}
                                Google
                            </Button>

                            <div className="mt-4 text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="underline text-primary hover:text-primary/80">
                                    Sign up
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative">
                <Image
                    src="https://picsum.photos/seed/green-leaves/1200/1800"
                    alt="Background image of lush green leaves"
                    fill
                    className="object-cover"
                    data-ai-hint="green leaves"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"></div>
            </div>
        </div>
    );
}
