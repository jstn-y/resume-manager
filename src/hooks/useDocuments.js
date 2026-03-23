import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useDocuments(user, options = {}) {
    const { limit = null, includeContent = false, includeFiles = true, templatesOnly = false } = options;

    const [documents, setDocuments] = useState([]);
    const [files, setfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const docSelect = ["id", "title", "type", "updated_at", "folder_id", includeContent ? "content" : null]
                    .filter(Boolean)
                    .join(",");

                let docQuery = supabase
                    .from("documents")
                    .select(docSelect)
                    .eq("user_id", user.id)
                    .eq("is_template", templatesOnly)
                    .order("updated_at", { ascending: false });

                if (limit) docQuery = docQuery.limit(limit);

                const queries = [docQuery];

                if (includeFiles && !templatesOnly) {
                    let fileQuery = supabase
                        .from("files")
                        .select("id, file_name, file_type, updated_at, folder_id")
                        .eq("user_id", user.id)
                        .order("updated_at", { ascending: false });

                    if (limit) fileQuery = fileQuery.limit(limit);
                    queries.push(fileQuery);
                }

                const [docsResult, filesResult] = await Promise.all(queries);

                if (docsResult.error) throw new Error(docsResult.error.message);
                if (filesResult?.error) throw new Error(filesResult.error.message);

                setDocuments(
                    (docsResult.data || []).map((d) => ({
                        id: d.id,
                        name: d.title,
                        type: d.type,
                        source: "document",
                        updated_at: d.updated_at,
                        folder_id: d.folder_id,
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
                    }))
                );
            } catch (err) {
                console.error(err);
                setError("Failed to load documents");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, limit, includeContent, includeFiles, templatesOnly]);

    return { documents, files, loading, error };
}
