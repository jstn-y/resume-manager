import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { FilePlus, LayoutTemplate } from "lucide-react";
import { supabase } from "@/lib/supabase";
import NewDocumentDialog from "@/components/Home/NewDocumentDialog";

export default function NewDocuments({ user }) {
    const navigate = useNavigate();
    const [dialog, setDialog] = useState(false);

    const options = [
        {
            label: "Blank Document",
            description: "Start from scratch",
            icon: <FilePlus className="h-6 w-6" />,
            action: () => setDialog(true),
        },
        {
            label: "From Template",
            description: "Use a saved template",
            icon: <LayoutTemplate className="h-6 w-6" />,
            action: () => navigate("/templates"),
        },
    ];

    return (
        <>
            <section>
                <h2 className="text-sm font-medium text-muted-forground uppercase tracking-wider mb-3">Create New</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {options.map((option) => (
                        <Card
                            key={option.label}
                            className="cursor-pointer hover:border-primary transition-colors group"
                            onClick={option.action}
                        >
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                    {option.icon}
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm">{option.label}</h3>
                                    <p className="text-sm text-muted-foreground">{option.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <NewDocumentDialog
                open={dialog}
                onClose={() => setDialog(false)}
                user={user}
            />
        </>
    );
}
