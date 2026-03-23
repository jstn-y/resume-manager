import { useNavigate } from "react-router-dom";
import { useDocuments } from "@/hooks/useDocuments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Paperclip, Clock } from "lucide-react";

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function DocRow({ item, onClick }) {
    const isFile = item.source === "file";
    return (
        <div
            className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
            onClick={onClick}
        >
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
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 ml-4">
                <Clock className="h-3 w-3" />
                {formatDate(item.updated_at)}
            </div>
        </div>
    );
}

export default function AllDocuments({ user }) {
    const navigate = useNavigate();
    const { documents, files, loading } = useDocuments(user, { includeFiles: true });

    const allItems = [...documents, ...files].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    const handleClick = (item) => {
        if (item.source === "document") navigate(`/editor/${item.id}`);
    };

    const renderList = (items) => {
        if (loading) {
            return Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />);
        }
        if (items.length === 0) {
            return <p className="text-sm text-muted-foreground px-4 py-6">Nothing here yet.</p>;
        }
        return items.map((item) => (
            <DocRow key={`${item.source}-${item.id}`} item={item} onClick={() => handleClick(item)} />
        ));
    };

    return (
        <section>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">All Documents</h2>

            <Tabs defaultValue="all">
                <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-1">
                    {renderList(allItems)}
                </TabsContent>
                <TabsContent value="documents" className="space-y-1">
                    {renderList(documents)}
                </TabsContent>
                <TabsContent value="files" className="space-y-1">
                    {renderList(files)}
                </TabsContent>
            </Tabs>
        </section>
    );
}
