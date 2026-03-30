import { useState, useRef, useEffect } from "react";
import { ArrowDownUp, ArrowUpNarrowWide, ArrowDownWideNarrow, Check, ChevronDown } from "lucide-react";

export const SORT_OPTIONS = [
    { id: "name", label: "Name" },
    { id: "updated_at", label: "Date Updated" },
    { id: "created_at", label: "Date Created" },
];

export const DEFAULT_SORT = { by: "updated_at", dir: "desc" };

export function applySort(sort, items) {
    const { by, dir } = sort;
    const modifier = dir === "asc" ? 1 : -1;

    return [...items].sort((a, b) => {
        if (by === "name") {
            return modifier * a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
        }

        const dateA = new Date(a[by] ?? 0);
        const dateB = new Date(b[by] ?? 0);
        return modifier * (dateA - dateB);
    });
}

export default function SortDropdown({ sort = DEFAULT_SORT, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const activeOption = SORT_OPTIONS.find((o) => o.id === sort.by) ?? SORT_OPTIONS[0];

    useEffect(() => {
        const handleOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [open]);

    const selectOption = (id) => {
        onChange({ ...sort, by: id} );
    };

    const toggleDirection = (e) => {
        e.stopPropagation();
        onChange({ ...sort, dir: sort.dir === "asc" ? "desc" : "asc" });
    };


    return (
        <div className="relative" ref={ref}>
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium transition-colors hover:bg-muted"
            >
                <ArrowDownUp className="w-3.5 h-3.5" />
                <span>Sort</span>
                <span className="text-muted-foreground font-normal">
                    {activeOption.label}
                </span>
                <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
                />
            </button>
 
            {/* Dropdown panel */}
            {open && (
                <div className="absolute left-0 top-full mt-1.5 w-52 rounded-lg border bg-popover shadow-md z-50 py-1.5">
                    {/* Sort field options */}
                    <div className="px-3 pb-1 pt-0.5">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Sort by
                        </span>
                    </div>
 
                    {SORT_OPTIONS.map((opt) => (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => selectOption(opt.id)}
                            className="flex items-center gap-2.5 w-full px-3 py-1.5 rounded-md text-sm hover:bg-muted transition-colors text-left"
                        >
                            <span
                                className="flex items-center justify-center w-4 h-4 rounded-full border shrink-0 transition-colors"
                                style={
                                    sort.by === opt.id
                                        ? { backgroundColor: "hsl(var(--primary))", borderColor: "hsl(var(--primary))" }
                                        : { borderColor: "hsl(var(--border))" }
                                }
                            >
                                {sort.by === opt.id && (
                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                )}
                            </span>
                            {opt.label}
                        </button>
                    ))}
 
                    {/* Direction toggle */}
                    <div className="my-1.5 border-t" />
                    <div className="px-3 pb-1">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Direction
                        </span>
                    </div>
 
                    <div className="flex items-center gap-1 px-3 py-1.5">
                        <button
                            type="button"
                            onClick={toggleDirection}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium transition-colors hover:bg-muted"
                        >
                            {sort.dir === "asc" ? (
                                <>
                                    <ArrowUpNarrowWide className="w-3.5 h-3.5" />
                                    Ascending
                                </>
                            ) : (
                                <>
                                    <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                                    Descending
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
