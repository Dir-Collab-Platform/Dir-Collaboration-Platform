import { Star } from "lucide-react";
import Button from "../../common-components/button";

export default function WorkSpacesSlot({
  projectName,
  visibility,
  description,
  stars,
  updatedAt,
  contributors,
  languages,
}) {
  return (
    <div className="w-full px-6 py-5">
      <div className="flex items-start justify-between gap-8 border-b border-(--main-border-color) p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-(--primary-text-color)">
              {projectName}
            </h2>

            <Button
              variant="base"
              className="rounded-full px-3 py-0.5 text-sm text-(--secondary-text-color) border border-(--main-border-color)"
            >
              {visibility}
            </Button>
          </div>

          {/* Language Stats Bar - will be populated from languages prop */}
          {languages && languages.length > 0 ? (
            <div className="flex h-2 w-56 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--main-border-color)' }}>
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
          ) : (
            <div className="flex h-2 w-56 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--main-border-color)' }}>
              <span className="w-2/3 bg-green-500" />
              <span className="w-1/4 bg-purple-600" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-(--mid-dim-font-color) text-sm max-w-2xl">
            {description}{" "}
          </p>

          <div className="flex items-center gap-6 text-sm text-(--secondary-text-color)">
            <span className="flex items-center gap-1.5">
              <Star size={16} className="text-yellow-400" />
              {stars}
            </span>

            <span>{updatedAt}</span>

            <div className="flex -space-x-2">
              {contributors.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="contributor"
                  className="h-8 w-8 rounded-full border-2 border-(--dark-bg)"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
