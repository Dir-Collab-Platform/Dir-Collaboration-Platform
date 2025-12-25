import { List, Pencil, Plus, Settings } from "lucide-react"

function SidebarToggle() {
    return (
        <button className="svg-btn icon-btn">
            <List />
        </button>
    )
}

function SettingsBtn() {
    return (
        <button className="svg-btn icon-btn">
            <Settings />
        </button>
    )
}

function AddFileBtn() {
    return (
        <button className="svg-btn icon-btn">
            <Plus />
        </button>
    )
}

function EditFileBtn() {
    return (
        <button className="svg-btn icon-btn">
            <Pencil />
        </button>
    )
}

export default function SidebarToolbar() {
    return (
        <div className="flex justify-between bg-(--card-bg-lighter) border border-(--main-border-color) rounded-tr-4xl px-6 pr-10 py-3">
            <SidebarToggle />
            <SettingsBtn />
            <AddFileBtn />
            <EditFileBtn />
        </div>
    )
}