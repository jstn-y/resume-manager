import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, Check, X, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TYPE_OPTIONS = [
    { id: "document", label: "Documents" },
    { id: "resume", label: "Resumes" },
    { id: "cover_letter", label: "Cover Letters" },
    { id: "file", label: "Files" },
];

export function applyFilters(filters, item) {
    const {typeIds, tagIds} = filters;

    if (typeIds.length > 0) {
        const isFile = item.source === "file";

        const matchesFile = typeIds.includes("file") && isFile;

        const matchesDocument = typeIds.includes("document") && !isFile;

        const matchesResume = typeIds.includes("resume") && item.type === "resume" && !isFile;

        const matchesCoverLetter = typeIds.includes("cover_letter") && item.type === "cover_letter" && !isFile;

        if (!matchesFile && !matchesDocument && !matchesResume && !matchesCoverLetter) {
            return false;
        }
    }

    if (tagIds.length > 0) {
        const itemTagIds = (item.tags || []).map((t) => t.id);
        const hasMatch = tagIds.some((id) => itemTagIds.includes(id));
        if (!hasMatch) return false;
    }

    return true;
}

function CheckRow({ label, checked, color, onToggle }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-2.5 w-full px-3 py-1.5 rounded-md text-sm hover:bg-muted transition-colors text-left"
        >
            {/* Checkbox */}
            <span
                className="flex items-center justify-center w-4 h-4 rounded border shrink-0 transition-colors"
                style={
                    checked
                        ? { backgroundColor: color || "hsl(var(--primary))", borderColor: color || "hsl(var(--primary))" }
                        : { borderColor: "hsl(var(--border))" }
                }
            >
                {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
            </span>
 
            {/* Color swatch for tags */}
            {color && (
                <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                />
            )}
 
            <span className="truncate">{label}</span>
        </button>
    );
}

export default function FilterDropdown({ filters, onChange, tags = [] }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
 
    const { typeIds = [], tagIds = [] } = filters;
    const activeCount = typeIds.length + tagIds.length;
 
    // Close on outside click
    useEffect(() => {
        function handleOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        if (open) document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [open]);
 
    // --- Toggle helpers ---
    const toggleType = (id) => {
        const next = typeIds.includes(id) ? typeIds.filter((t) => t !== id) : [...typeIds, id];
        onChange({ ...filters, typeIds: next });
    };
 
    const toggleTag = (id) => {
        const next = tagIds.includes(id) ? tagIds.filter((t) => t !== id) : [...tagIds, id];
        onChange({ ...filters, tagIds: next });
    };
 
    const clearAll = () => onChange({ typeIds: [], tagIds: [] });
 
    return (
        <div className="relative" ref={ref}>
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium transition-colors hover:bg-muted"
            >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filter
                {activeCount > 0 && (
                    <Badge className="ml-0.5 h-4 px-1.5 text-xs">{activeCount}</Badge>
                )}
                <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
                />
            </button>
 
            {/* Dropdown panel */}
            {open && (
                <div className="absolute left-0 top-full mt-1.5 w-52 rounded-lg border bg-popover shadow-md z-50 py-1.5">
                    {/* Type section */}
                    <div className="px-3 pb-1 pt-0.5">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Type
                        </span>
                    </div>
 
                    {TYPE_OPTIONS.map((opt) => (
                        <CheckRow
                            key={opt.id}
                            label={opt.label}
                            checked={typeIds.includes(opt.id)}
                            onToggle={() => toggleType(opt.id)}
                        />
                    ))}
 
                    {/* Tags section — only rendered if the user has tags */}
                    {tags.length > 0 && (
                        <>
                            <div className="my-1.5 border-t" />
                            <div className="px-3 pb-1">
                                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Tags
                                </span>
                            </div>
                            {tags.map((tag) => (
                                <CheckRow
                                    key={tag.id}
                                    label={tag.name}
                                    color={tag.color}
                                    checked={tagIds.includes(tag.id)}
                                    onToggle={() => toggleTag(tag.id)}
                                />
                            ))}
                        </>
                    )}
 
                    {/* Clear all — only shown when something is active */}
                    {activeCount > 0 && (
                        <>
                            <div className="my-1.5 border-t" />
                            <button
                                type="button"
                                onClick={clearAll}
                                className="flex items-center gap-1.5 w-full px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                                Clear filters
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
