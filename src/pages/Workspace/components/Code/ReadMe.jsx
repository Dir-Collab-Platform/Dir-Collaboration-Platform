import { Pencil } from "lucide-react"

function EditBtn() {
    return (
        <button className="svg-btn icon-btn">
            <Pencil />
        </button>
    )
}

export default function ReadMe() {
    return (
        <div className="bg-(--card-bg) border border-(--main-border-color) rounded-2xl">
            <div className="header flex justify-between items-center px-6 border-b border-(--main-border-color) py-2">
                <h1 className="header2 font-semibold">README</h1>
                <EditBtn />
            </div>

            <div className="readme-content flex flex-col gap-4 px-6 py-4 pb-8">
                <h2 className="header2 font-bold">My-repository</h2>
                <p>
                    A fully static multi-page website built using vanilla HTML and CSS. The project represents a modern gym called Iron-Core Gym, showcasing its services, membership plans, and contact information.
                </p>
            </div>
        </div>
    )
} 