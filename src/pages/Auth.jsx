import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Form } from "react-router-dom";
import InputField from "@/components/InputField";

export default function Auth() {
    const [mode, setMode] = useState("signup");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const FormLabel = ({ children }) => (
        <label className="text-[#aaa] text-xs font-sans uppercase tracking-wide">
        {children}
        </label>
    );

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
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) setError(error.message);

        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) setError(error.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-2xl p-10 w-full max-w-md shadow-lg flex flex-col gap-4">
            {/* Introduction */}
            <div className="text-center mb-2">
                <h1 className="text-2xl font-bold text-white"> Welcome to ResumeManager!</h1>
                <p className="mt-1 text-[#888] italic">
                    {mode === "signup" ? "Please create an account before you continue." : "Welcome back."}
                </p>
            </div>

            {/* Google Sign Up/In Button */}
            <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full p-3 bg-[#242424] border border-[#3a3a3a] rounded-lg text-[#e0ddd8] hover:bg-[#333333] transition-colors duration-150"
            >
            <GoogleIcon />
            {mode === "signup" ? "Sign Up with Google" : "Sign In with Google"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 m-1">
                <div className="flex-1 h-px bg-[#2e2e2e]" />
                <span className="text-[#666] text-xs font-sans">or</span>
                <div className="flex-1 h-px bg-[#2e2e2e]" />
            </div>

            {/* Email & Password Fields */}
            <InputField 
                label="Email" 
                type="email" 
                placeholder="your.email@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />

            <InputField 
                label="Password" 
                type="password" 
                placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />

            {/* Error & Success Messages */}
            {error && <p className="text-[#e07070] text-xs font-sans">{error}</p>}
            {message && <p className="text-[#70c97e] text-xs font-sans">{message}</p>}

            {/* Submit Button */}
            <button
                onClick={handleEmailAuth}
                disabled={loading}
                className="w-full p-3 bg-[#c8a96e] rounded-lg text-[#0f0f0f] font-bold hover:bg-[#b5965a] transition-colors duration-150"
            >
            {loading ? "Loading..." : mode === "signup" ? "Create Account" : "Sign In"}
            </button>

            {/* Toggle Between Sign Up/In*/}
            {/* <p className="text-center text-[#666] text-xs font-sans"> */}
            <p className="text-center mt-1 text-[#888]">
            {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
            <button
                onClick={() => {
                    setMode(mode === "signup" ? "signin" : "signup");
                    setError(null);
                    setMessage(null);
                }}

                className="text-[#c8a96e] hover:underline font-medium bg-transparent border-none p-0 cursor-pointer"
            >
                {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
            </p>
        </div>
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
