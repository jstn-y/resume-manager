import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useDocuments(user, options = {}) {
    const { limit = null, includeContent = false, includeFiles = true, templatesOnly = false, filterTagIds = [] } = options;

    const [documents, setDocuments] = useState([]);
    const [files, setfiles] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const docSelect = ["id", "title", "type", "updated_at", "folder_id", "tags", includeContent ? "content" : null]
                    .filter(Boolean)
                    .join(",");

                let docQuery = supabase
                    .from("documents")
                    .select(docSelect)
                    .eq("user_id", user.id)
                    .eq("is_template", templatesOnly)
                    .order("updated_at", { ascending: false });

                if (limit) docQuery = docQuery.limit(limit);

                if (filterTagIds.length > 0) {
                    docQuery = docQuery.contains("tags", filterTagIds);
                }

                const queries = [docQuery];

                if (includeFiles && !templatesOnly) {
                    let fileQuery = supabase
                        .from("files")
                        .select("id, file_name, file_type, updated_at, folder_id, tags")
                        .eq("user_id", user.id)
                        .order("updated_at", { ascending: false });

                    if (limit) fileQuery = fileQuery.limit(limit);
                    if (filterTagIds.length > 0) {
                        fileQuery = fileQuery.contains("tags", filterTagIds);
                    }
                    queries.push(fileQuery);
                }

                const tagsQuery = supabase
                    .from("tags")
                    .select("id, name, color")
                    .eq("user_id", user.id)
                    .order("name", { ascending: true });

                queries.push(tagsQuery);

                const [docsResult, filesOrTagsResult, tagsOrUndefined] = await Promise.all(queries);

                // When includeFiles is false, filesOrTagsResult is actually the tags result
                const filesResult = includeFiles && !templatesOnly ? filesOrTagsResult : null;
                const tagsResult = includeFiles && !templatesOnly ? tagsOrUndefined : filesOrTagsResult;

                if (docsResult.error) throw new Error(docsResult.error.message);
                if (filesResult?.error) throw new Error(filesResult.error.message);
                if (tagsResult?.error) throw new Error(tagsResult.error.message);

                const tagMap = Object.fromEntries(
                    (tagsResult?.data || []).map((t) => [t.id, t])
                );

                const resolveTags = (tagIds) =>
                    (tagIds || []).map((id) => tagMap[id]).filter(Boolean);

                setDocuments(
                    (docsResult.data || []).map((d) => ({
                        id: d.id,
                        name: d.title,
                        type: d.type,
                        source: "document",
                        updated_at: d.updated_at,
                        folder_id: d.folder_id,
                        tags: resolveTags(d.tags),
                        content: includeContent ? (d.content || "").slice(0, 1000) : null,
                    }))
                );

                setfiles(
                    (filesResult?.data || []).map((f) => ({
                        id: f.id,
                        name: f.file_name,
                        kind: f.file_type,
                        source: "file",
                        updated_at: f.updated_at,
                        folder_id: f.folder_id,
                        tags: resolveTags(f.tags),
                    }))
                );

                setTags(tagsResult?.data || []);

            } catch (err) {
                console.error(err);
                setError("Failed to load documents");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, limit, includeContent, includeFiles, templatesOnly, JSON.stringify(filterTagIds)]);

    return { documents, files, tags, loading, error };
}
