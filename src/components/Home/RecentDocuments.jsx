import { useNavigate } from "react-router-dom";
import { useDocuments } from "@/hooks/useDocuments";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Paperclip } from "lucide-react";

export const timeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

export default function RecentDocuments({ user }) {
    const navigate = useNavigate();
    const { documents, files, loading } = useDocuments(user, {
        limit: 6,
        includeFiles: true,
        includeContent: true,
    });

    const recent = [...documents, ...files].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 6);

    const handleClick = (item) => {
        if (item.source === "document") navigate(`/editor/${item.id}`);
        // file preview later
    };

    return (
        <section>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Recently Opened</h2>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                </div>
            ) : recent.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent documents or files. Create one above!</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {recent.map((item) => (
                        <Card
                            key={`${item.source}-${item.id}`}
                            className="cursor-pointer hover:border-primary transition-colors"
                            onClick={() => handleClick(item)}
                        >
                            <CardContent className="p-4 flex flex-col gap-2">
                                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                    {item.source === "document" ? (
                                        <div className="relative h-full w-full overflow-hidden">
                                            <div
                                                className="text-[10px] leading-snug text-foreground pointer-events-none scale-[0.85] origin-top-left"
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent" />
                                        </div>
                                    ) : (
                                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                                <p className="text-sm font-medium leading-tight line-clamp-2">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{timeAgo(item.updated_at)}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
}
