export default function RepoOptions({
  activeState,
  onStateChange,
  label,
  option1,
  option2,
}) {
  return (
    <div className="flex gap-6 w-full">
      <span className="min-w-32 mr-2">{label}</span>
      <button
        onClick={onStateChange}
        className={` ${
          activeState === "option1"
            ? "bg-(--card-bg) border-2"
            : "bg-(--secondary-button-hover) border"
        } border-(--main-border-color) rounded-lg py-1 px-8 min-w-32`}
      >
        {option1}
      </button>
      <button
        onClick={onStateChange}
        className={`${
          activeState === "option2"
            ? "bg-(--card-bg) border-2"
            : "bg-(--secondary-button-hover) border"
        } border-(--main-border-color) rounded-lg py-1 px-8 min-w-32`}
      >
        {option2}
      </button>
    </div>
  );
}
