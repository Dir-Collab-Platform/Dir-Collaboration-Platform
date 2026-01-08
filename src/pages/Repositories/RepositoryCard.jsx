import { Star, Workflow } from "lucide-react";

function RepositoryCard({ name, visibility, description, stars, updatedAt, languages, isImported }) {
  return (
    <div className="w-full p-6 cursor-pointer hover:bg-(--secondary-button) transition-colors">
      <div className="flex flex-col gap-2">
        {/* Top Row: Name and Visibility */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold flex items-center gap-2 text-(--primary-text-color)">
            {isImported && <Workflow size={18} className="text-(--primary-text-color)" />}
            {name}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#2D2D3F] border border-(--main-border-color) text-(--secondary-text-color)">
            {visibility}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm line-clamp-1 text-(--secondary-text-color)">
          {description}
        </p>

        {/* Bottom Row: Stats and Language Bar */}
        <div className="flex items-center gap-6 mt-2 text-xs text-(--mid-dim-font-color)">

          {/* Language Bar (Progress-like) */}
          {languages && languages.length > 0 && (
            <div className="w-32 h-1.5 rounded-full overflow-hidden flex bg-[#2D2D3F]">
              {languages.map(lang => (
                <div
                  key={lang.label}
                  className="h-full"
                  style={{ width: `${lang.value}%`, backgroundColor: lang.color }}
                />
              ))}
            </div>
          )}

          {/* Stars */}
          <div className="flex items-center gap-1">
            <Star size={14} className="text-[#FFB224] fill-[#FFB224]" />
            <span>{stars || 0}</span>
          </div>

          {/* Updated Time */}
          <span>{updatedAt}</span>
        </div>
      </div>
    </div>
  );
}

export default RepositoryCard;
