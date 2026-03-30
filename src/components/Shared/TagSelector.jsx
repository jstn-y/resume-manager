import { useState, useRef, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { supabase } from "@/lib/supabase";

const PRESET_COLORS = [
    "#D91E18", // red
    "#E67E23", // orange
    "#F9BF3B", // yellow
    "#2FCC71", // green
    "#1BB5FE", // blue
    "#1F3A93", // violet
    "#F62496", // pink
    "#9A13B3", // purple
    "#95411B", // brown
    "#9CA3AF", // gray (default)
];

export default function TagSelector({
    user,
    selectedTags = [],
    allTags = [],
    onChange,
    maxTags = 5,
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [mode, setMode] = useState("pick"); // "pick" | "create"
    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState("#9CA3AF");
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const searchRef = useRef(null);

    const [localAllTags, setLocalAllTags] = useState(allTags);

    useEffect(() => {
        setLocalAllTags((prev) => {
            const incomingIds = new Set(allTags.map((t) => t.id));
            const localOnly = prev.filter((t) => !incomingIds.has(t.id));
            return [...allTags, ...localOnly];
        });
    }, [JSON.stringify(allTags)]);

    useEffect(() => {
        if (open) {
            setTimeout(() => searchRef.current?.focus(), 50);
            setSearch("");
            setMode("pick");
            setError("");
        }
    }, [open]);

    const selectedIds = new Set(selectedTags.map((t) => t.id));

    const filteredTags = localAllTags.filter(
        (t) => !selectedIds.has(t.id) && t.name.toLowerCase().includes(search.toLowerCase())
    );

    const exactMatch = localAllTags.some((t) => t.name.toLowerCase() === search.toLowerCase());

    function handleSelect(tag) {
        if (selectedTags.length >= maxTags) {
            setError(`Max ${maxTags} tags.`);
            return;
        }
        setError("");
        onChange([...selectedTags, tag]);
        setSearch("");
    }

    function handleRemove(tag) {
        onChange(selectedTags.filter((t) => t.id !== tag.id));
        setError("");
    }

    function openCreate() {
        setNewName(search);
        setNewColor("#9CA3AF");
        setMode("create");
        setError("");
    }

    async function handleCreate() {
        const trimmed = newName.trim();
        if (!trimmed) {
            setError("Tag name is required.");
            return;
        }

        if (trimmed.length > 25) {
            setError("Tag name must be 25 characters or fewer.");
            return;
        }
        if (selectedTags.length >= maxTags) {
            setError(`Max ${maxTags} tags.`);
            return;
        }

        setCreating(true);
        setError("");

        const { data, error: dbError } = await supabase
            .from("tags")
            .insert({ user_id: user.id, name: trimmed, color: newColor })
            .select()
            .single();

        setCreating(false);

        if (dbError) {
            setError(dbError.message);
            return;
        }

        setLocalAllTags((prev) => [...prev, data]);
        onChange([...selectedTags, data]);
        setMode("pick");
        setSearch("");
        setNewName("");
    }

    return (
        <div className="flex flex-col gap-2">
            {/* Selected tag badges */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {selectedTags.map((tag) => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleRemove(tag)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all border"
                            style={{
                                backgroundColor: tag.color,
                                borderColor: tag.color,
                                color: "white",
                            }}
                            aria-label={`Remove ${tag.name}`}
                        >
                            {tag.name} ×
                        </button>
                    ))}
                </div>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                {/* Trigger */}
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        disabled={selectedTags.length >= maxTags}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-dashed border-border rounded-md text-muted-foreground hover:border-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed w-fit"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 10V5a2 2 0 012-2z"
                            />
                        </svg>
                        {selectedTags.length === 0 ? "Add tags" : "Add more"}
                    </button>
                </PopoverTrigger>

                {/* Popover panel */}
                    <PopoverContent
                        align="start"
                        sideOffset={6}
                        className="z-50 w-auto rounded-lg border border-border bg-popover text-popover-foreground shadow-lg outline-none"
                    >
                        {mode === "pick" ? (
                            <div className="flex flex-col">
                                {/* Search */}
                                <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                                    <svg className="w-3.5 h-3.5 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setError("");
                                        }}
                                        placeholder="Search or create…"
                                        className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
                                    />
                                </div>

                                {/* Tag list */}
                                <div className="max-h-44 overflow-y-auto py-1" onWheel={(e) => e.stopPropagation()}>
                                    {filteredTags.length > 0 ? (
                                        filteredTags.map((tag) => (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() => handleSelect(tag)}
                                                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-secondary hover:text-accent-foreground transition-colors text-left text-foreground"
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.querySelector("span").style.backgroundColor = tag.color;
                                                    e.currentTarget.querySelector("span").style.color = "white";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.querySelector("span").style.backgroundColor = "transparent";
                                                    e.currentTarget.querySelector("span").style.color = tag.color;
                                                }}
                                                
                                            >
                                                <span
                                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-all"
                                                    style={{
                                                        backgroundColor: "transparent",
                                                        borderColor: tag.color,
                                                        color: tag.color,
                                                    }}
                                                >
                                                    {tag.name}
                                                </span>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="px-3 py-2 text-xs text-muted-foreground">
                                            {search ? "No matching tags." : "No tags yet."}
                                        </p>
                                    )}
                                </div>

                                {/* Create button */}
                                {!exactMatch && (
                                    <div className="border-t border-border p-2">
                                        <button
                                            type="button"
                                            onClick={openCreate}
                                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-primary hover:bg-accent rounded-md transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            {search ? `Create "${search}"` : "Create new tag"}
                                        </button>
                                    </div>
                                )}

                                {error && <p className="px-3 pb-2 text-xs text-destructive">{error}</p>}
                            </div>
                        ) : (
                    
                            <div className="flex flex-col gap-3 p-3">
                                <span className="text-sm font-medium text-foreground">New tag</span>

                                {/* Name input */}
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                                    placeholder="Tag name"
                                    maxLength={25}
                                    autoFocus
                                    className="w-full text-sm border border-border rounded-md px-2.5 py-1.5 outline-none bg-transparent text-foreground placeholder:text-muted-foreground focus:border-ring transition-colors"
                                />

                                {/* Color picker */}
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-xs text-muted-foreground">Color</span>
                                    <div className="grid grid-cols-10 gap-1.5">
                                        {PRESET_COLORS.map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setNewColor(c)}
                                                className="w-5 h-5 rounded-full transition-transform hover:scale-110 focus:outline-none"
                                                style={{
                                                    backgroundColor: c,
                                                    outline: newColor === c ? `2px solid ${c}` : "none",
                                                    outlineOffset: "2px",
                                                }}
                                                aria-label={c}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Preview */}
                                {newName.trim() && (
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        Preview:
                                        <span
                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border"
                                            style={{
                                                backgroundColor: newColor,
                                                borderColor: newColor,
                                                color: "white",
                                            }}
                                        >
                                            {newName.trim()}
                                        </span>
                                    </div>
                                )}

                                {error && <p className="text-xs text-destructive">{error}</p>}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setMode("pick")}
                                        className="flex-1 text-sm px-3 py-1.5 border border-border rounded-md hover:bg-accent text-foreground transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCreate}
                                        disabled={creating || !newName.trim()}
                                        className="flex-1 text-sm px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                    >
                                        {creating ? "Creating…" : "Create"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </PopoverContent>
            </Popover>

            {/* Max tags hint */}
            {selectedTags.length >= maxTags && (
                <p className="text-xs text-amber-600">Maximum of {maxTags} tags reached.</p>
            )}
        </div>
    );
}
