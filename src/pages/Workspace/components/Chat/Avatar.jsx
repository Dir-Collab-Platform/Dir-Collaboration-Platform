export default function Avatar({ src, size = 32, className = "" }) {
    return (
        <div 
            style={{ width: size, height: size }}
            className={`rounded-full bg-(--secondary-button) border border-(--main-border-color) overflow-hidden flex items-center justify-center shrink-0 ${className}`}
        >
            {src ? (
                <img src={src} alt="avatar" className="w-full h-full object-cover" />
            ) : (
                <div className="w-1/2 h-1/2 bg-(--active-text-color) opacity-20 rounded-full" />
            )}
        </div>
    )
}
