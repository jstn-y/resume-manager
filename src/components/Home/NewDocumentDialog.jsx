import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

export default function NewDocumentDialog({ open, onClose, user }) {
    const navigate = useNavigate();

    const [type, setType] = useState("resume");
    const [title, setTitle] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);
    const [isTemplate, setIsTemplate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const defaultTitle = type === "resume" ? "Untitled Resume" : "Untitled Cover Letter";

    const handleTagKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tag) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleCreate = async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from("documents")
            .insert({
                user_id: user.id,
                title: title.trim() || defaultTitle,
                type,
                is_template: isTemplate,
                content: "",
                tags,
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
        setTagInput("");
        setIsTemplate(false);
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

                    {/* Template toggle */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="text-sm font-medium">Save as Template</p>
                            <p className="text-xs text-muted-foreground">
                                Reuse this document as a starting point for future documents.
                            </p>
                        </div>
                        <Switch checked={isTemplate} onCheckedChange={setIsTemplate} />
                    </div>

                    {/* Tags */}
                    <div className="space-y-1.5">
                        <Label htmlFor="doc-tags">Tags</Label>
                        <Input
                            id="doc-tags"
                            placeholder="Type a tag and press Enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                        />
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="gap-1">
                                        {tag}
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-destructive transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    

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
