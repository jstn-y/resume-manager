import { Switch } from "@/components/ui/switch";

export default function TemplateToggle({ isTemplate, onChange }) {
    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
                <p className="text-sm font-medium">Save as Template</p>
                <p className="text-xs text-muted-foreground">
                    Reuse this document as a starting point for future documents.
                </p>
            </div>
            <Switch checked={isTemplate} onCheckedChange={onChange} />
        </div>
    );
}
