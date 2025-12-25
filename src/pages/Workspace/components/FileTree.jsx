import { Search } from "lucide-react"

function SearchFilesBtn() {
    return (
        <button className="svg-btn icon-btn">
            <Search color='var(--secondary-text-color)' />
        </button>
    )
}

export default function FileTree() {
    return (
        <div className="file-tree">
            <div className="search flex items-center justify-between bg-(--card-bg-lighter) h-12 p-4 border border-(--main-border-color) rounded-4xl">
                <input className="max-w-36 focus:outline-none" type="text" placeholder="search files" />
                <SearchFilesBtn />
            </div>

            {/* replace this with the actual file tree */}
            <p className="flex justify-center items-center py-6 text-(--secondary-text-color)">No files yet!</p>

        </div>
    )
}