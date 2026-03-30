import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "@/hooks/useDocuments";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Paperclip, Clock, X } from "lucide-react";
import FilterDropdown, { applyFilters } from "../Shared/FilterDropdown";
import SortDropdown, { applySort, DEFAULT_SORT } from "../Shared/SortDropdown";


function formatDate(date) {
    return new Date(date).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function TagPill({ tag, onRemove }) {
    return (
        <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white shrink-0"
            style={{ backgroundColor: tag.color }}
        >
            {tag.name}
            {onRemove && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onRemove(tag); }}
                    className="hover:opacity-70 transition-opacity leading-none"
                    aria-label={`Remove ${tag.name} filter`}
                >
                    <X className="w-2.5 h-2.5" />
                </button>
            )}
        </span>
    );
}

function DocRow({ item, onClick }) {
    const isFile = item.source === "file";
    const tags = item.tags || [];

    return (
        <div
            className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted cursor-pointer transition-colors gap-3"
            onClick={onClick}
        >
            {/* Left: icon + title + type badge */}
            <div className="flex items-center gap-3 min-w-0">
                {isFile ? (
                    <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span className="text-sm font-medium truncate">{item.name}</span>
                {!isFile && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                        {item.type === "cover_letter" ? "Cover Letter" : "Resume"}
                    </Badge>
                )}
            </div>

            {/* Right: tags + date */}
            <div className="flex items-center gap-3 shrink-0 ml-auto">
                {tags.length > 0 && (
                    <div className="flex items-center gap-1">
                        {tags.slice(0, 3).map((tag) => (
                            <TagPill key={tag.id} tag={tag} />
                        ))}
                        {tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                                +{tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(item.updated_at)}
                </div>
            </div>
        </div>
    );
}

export default function AllDocuments({ user }) {
    const navigate = useNavigate();
    
    const [filters, setFilters] = useState({ typeIds: [], tagIds: [] });
    const [sort, setSort] = useState(DEFAULT_SORT);

    const { documents, files, tags, loading } = useDocuments(user, { includeFiles: true });

    const allItems = applySort(sort, 
        [...documents, ...files].filter((item) => applyFilters(filters, item))
    );

    const activeFilterCount = filters.typeIds.length + filters.tagIds.length;

    const handleClick = (item) => {
        if (item.source === "document") navigate(`/editor/${item.id}`);
    };

    const renderList = (items) => {
        if (loading) {
            return Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
            ));
        }
        if (items.length === 0) {
            return (
                <p className="text-sm text-muted-foreground px-4 py-6">
                    {activeFilterCount > 0 ? "No documents match the selected tags." : "Nothing here yet."}
                </p>
            );
        }
        return items.map((item) => (
            <DocRow
                key={`${item.source}-${item.id}`}
                item={item}
                onClick={() => handleClick(item)}
            />
        ));
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium uppercase tracking-wider">
                    All Documents
                </h2>
                <div className="flex items-center gap-2">
                    <FilterDropdown filters={filters} onChange={setFilters} tags={tags} />
                    <SortDropdown sort={sort} onChange={setSort} />
                </div>
            </div>

            <div className="space-y-1 mt-4">
                {renderList(allItems)}
            </div>

        </section>
    );
}
