import { useState, useRef, useEffect } from 'react'
import { Plus, X } from 'lucide-react'

export default function NewItemInput({ isVisible, onSubmit, onCancel, depth = 0 }) {
    const [name, setName] = useState('')
    const inputRef = useRef(null)

    useEffect(() => {
        if (isVisible && inputRef.current) {
            inputRef.current.focus()
            setName('')
        }
    }, [isVisible])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (name.trim()) {
            // Determine type based on extension
            const type = name.includes('.') ? 'file' : 'dir'
            onSubmit(name.trim(), type)
            setName('')
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onCancel()
            setName('')
        }
    }

    if (!isVisible) return null

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 py-1.5 pr-2 rounded-md bg-(--secondary-button) min-w-max animate-in fade-in slide-in-from-left-2 duration-200"
            style={{ marginLeft: `${depth * 20 + 20}px` }}
        >
            <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="filename.ext or folder"
                className="flex-1 px-2 py-0.5 text-[13px] bg-transparent border-none outline-none text-(--primary-text-color) placeholder:text-(--secondary-text-color) placeholder:opacity-50 min-w-[140px]"
                onBlur={() => {
                    if (!name.trim()) onCancel();
                }}
            />
            <div className="flex items-center gap-1">
                <button type="submit" className="text-green-500 hover:text-green-400 p-0.5 rounded hover:bg-white/10 transition-colors">
                    <Plus size={14} />
                </button>
                <button type="button" onClick={onCancel} className="text-red-400 hover:text-red-300 p-0.5 rounded hover:bg-white/10 transition-colors">
                    <X size={14} />
                </button>
            </div>
        </form>
    )
}
