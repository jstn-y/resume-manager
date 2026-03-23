import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function ProtectedRoute({ user, children }) {
    if (user === undefined) return null;
    if (user === null) return <Navigate to="/auth" replace />;
    return children;
}

export default function App() {
    const { user } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute user={user}>
                            <Home user={user} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/editor/:documentId"
                    element={
                        <ProtectedRoute user={user}>
                            <Dashboard user={user} />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
