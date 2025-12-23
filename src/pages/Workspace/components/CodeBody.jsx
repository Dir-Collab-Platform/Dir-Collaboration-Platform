import CodeViewer from "./CodeViewer";
import CodeViewerHeader from "./CodeViewerHeader";

export function CodeBody() {
    return (
        <div className="code-body flex flex-col gap-4 h-full">
            <CodeViewerHeader />
            <CodeViewer />
        </div>
    )
}