import { ChevronDown, Plus } from "lucide-react"
import DummyImg from "./DummyImg"

function InviteBtn() {
    return (
        <button className="svg-btn primary-btn flex items-center gap-2 px-4 py-2 border border-(--main-border-color) rounded-2xl">
            <Plus />
            <p>Invite members</p>
        </button>
    )
}

function DropdownBtn() {
    return (
        <button className="svg-btn icon-btn">
            <ChevronDown />
        </button>
    )
}

export default function Collaborators() {
    return (
        <div className="collaborators flex flex-col gap-4.5 bg-(--card-bg) border border-(--main-border-color) p-2.5 mt-8 rounded-2xl">
            <div className="collab-header flex justify-between items-center">
                <h1 className="header2 font-bold">Collaborators</h1>

                <InviteBtn />
            </div>

            <div className="collab-body flex justify-between items-center">
                <div className="flex gap-2 items-center pr-8">
                    <div className="profiles flex -space-x-4">
                        <DummyImg />
                        <DummyImg />
                        <DummyImg />
                        <DummyImg />
                    </div>
                    <p className="paragraph1">
                        <span className="font-bold">4</span> members
                    </p>
                </div>

                <DropdownBtn />
            </div>
        </div>
    )
}