import CodeViewer from "./CodeViewer";
import CodeViewerHeader from "./CodeViewerHeader";
import ReadMe from "./ReadMe";

export default function CodeBody() {
    return (
        <div className="code-body flex flex-col gap-4 h-full pl-6 overflow-y-auto scroll-bar">
            <CodeViewerHeader />
            <div className="flex flex-col gap-8 pr-6 pb-10">
                <CodeViewer />
                <ReadMe />
            </div>
        </div>
    )
}