export default function PageLoader({msg}) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
            <div className="relative flex flex-col items-center">
                {/* Spinning ring using global variables */}
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-(--main-border-color) border-t-(--active-text-color)"></div>
                
                <div className="mt-6 flex flex-col items-center gap-2">
                    <h2 className="header1 font-bold tracking-widest text-(--primary-text-color) animate-pulse">
                        Dir
                    </h2>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-(--secondary-button) border border-(--main-border-color)">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <p className="paragraph-mini capitalize tracking-tighter text-(--secondary-text-color)">
                            {msg}...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
