import { Star } from "lucide-react";
import Button from "../../common-components/button";

function RepositoryCard({ name, visibility, description, stars, updatedAt, languages, contributors }) {
  return (
    <div className="w-full px-6 py-5 cursor-pointer hover:bg-[var(--secondary-button-hover)] transition-colors">
      <div className="flex items-start justify-between gap-8 border-b border-[var(--main-border-color)] p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-[var(--primary-text-color)]">
              {name}
            </h2>

            <Button
              variant="base"
              className="rounded-full px-3 py-0.5 text-sm text-[var(--secondary-text-color)] border border-[var(--main-border-color)]"
            >
              {visibility}
            </Button>
          </div>

          {/* Language Stats Bar */}
          {languages && languages.length > 0 && (
            <div className="flex h-2 w-56 overflow-hidden rounded-full bg-[var(--main-border-color)]">
              {languages.map((lang) => (
                <div
                  key={lang.label}
                  className="h-full transition-all hover:opacity-80"
                  style={{
                    width: `${lang.value}%`,
                    backgroundColor: lang.color || '#6b7280',
                  }}
                  title={`${lang.label}: ${lang.value.toFixed(1)}%`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[var(--mid-dim-font-color)] text-sm max-w-2xl">
            {description}{" "}
          </p>

          <div className="flex items-center gap-6 text-sm text-[var(--secondary-text-color)]">
            <span className="flex items-center gap-1.5">
              <Star size={16} className="text-yellow-400" />
              {stars || 0}
            </span>

            <span>{updatedAt}</span>

            {contributors && contributors.length > 0 && (
              <div className="flex -space-x-2">
                {contributors.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="contributor"
                    className="h-8 w-8 rounded-full border-2 border-[var(--dark-bg)]"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepositoryCard;
