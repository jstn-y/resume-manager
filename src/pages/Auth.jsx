import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";  
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";


export default function Auth() {
    const [mode, setMode] = useState("signup");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // Google OAuth
    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                // add URL later
                redirectTo: window.location.origin,
            },
        });

        if (error) setError(error.message);
        setLoading(false);
    };

    // Email & Password Auth
    const handleEmailAuth = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);

        if (mode === "signup") {
            const { error } = await supabase.auth.signUp({ 
                email, 
                password, 
                options: {
                    data: {
                        first_name: firstName.trim(),
                        last_name: lastName.trim(),
                        full_name: `${firstName.trim()} ${lastName.trim()}`,
                    },
                } 
            });
            if (error) setError(error.message);

        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) setError(error.message);
        }

        setLoading(false);
    };

    const switchMode = () => {
        setMode(mode === "signup" ? "signin" : "signup");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setError(null);
        setMessage(null);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome to ResumeManager!</CardTitle>
                    <CardDescription className="italic">
                        {mode === "signup"
                            ? "Please create an account before you continue."
                            : "Welcome back."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    {/* Google Sign In/Up */}
                    <Button variant="outline" onClick={handleGoogleSignIn} disabled={loading} className="w-full gap-2">
                        <GoogleIcon />
                        {mode === "signup" ? "Sign Up with Google" : "Sign In with Google"}
                    </Button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-muted-foreground text-xs">or</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* First & Last Name — signup only */}
                    {mode === "signup" && (
                        <div className="flex gap-3">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="Jane"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Smith"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Error & Success Messages */}
                    {error && <p className="text-destructive text-xs">{error}</p>}
                    {message && <p className="text-green-500 text-xs">{message}</p>}

                    {/* Submit */}
                    <Button onClick={handleEmailAuth} disabled={loading} className="w-full">
                        {loading ? "Loading..." : mode === "signup" ? "Create Account" : "Sign In"}
                    </Button>

                    {/* Toggle */}
                    <p className="text-center text-sm text-muted-foreground">
                        {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
                        <button
                            onClick={switchMode}
                            className="text-primary hover:underline font-medium bg-transparent border-none p-0 cursor-pointer"
                        >
                            {mode === "signin" ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

// Google SVG Icon
function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
        <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
        </svg>
    );
}
