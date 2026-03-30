import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import TagSelector from "@/components/Shared/TagSelector";

export default function NewDocumentDialog({ open, onClose, user }) {
    const navigate = useNavigate();

    const [type, setType] = useState("resume");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const defaultTitle = type === "resume" ? "Untitled Resume" : "Untitled Cover Letter";

    useEffect(() => {
        if (!user) return;
        supabase
            .from("tags")
            .select("id, name, color")
            .eq("user_id", user.id)
            .order("name", { ascending: true })
            .then(({ data }) => setAllTags(data || []));
    }, [user]);

    const handleCreate = async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from("documents")
            .insert({
                user_id: user.id,
                title: title.trim() || defaultTitle,
                type,
                is_template: false,
                content: "",
                tags: tags.map((t) => t.id),
            })
            .select("id")
            .single();

        if (error) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
            return;
        }

        navigate(`/editor/${data.id}`);
    };

    const handleClose = () => {
        setType("resume");
        setTitle("");
        setTags([]);
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>New Document</DialogTitle>
                    <DialogDescription>Configure your document before jumping in.</DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    {/* Document type selector */}
                    <div className="space-y-1.5">
                        <Label>Document Type</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { value: "resume", label: "Resume" },
                                { value: "cover_letter", label: "Cover Letter" },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setType(option.value)}
                                    className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors
                                        ${
                                            type === option.value
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border hover:border-primary hover:bg-muted"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label htmlFor="doc-title">Title</Label>
                        <Input
                            id="doc-title"
                            placeholder={defaultTitle}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <TagSelector user={user} selectedTags={tags} allTags={allTags} onChange={setTags} />

                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={loading}>
                        {loading ? "Creating..." : "Create Document"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
