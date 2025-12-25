export default function Input({
  label,
  className,
  placeholder,
  description,
  ...props
}) {
  return (
    <div className={className || ""}>
      <label className="font-semibold" htmlFor={label}>
        {label}
      </label>
      <input
        className={`block mt-4 mb-2 bg-[#303036] border border-[#EFEEEE21] px-5 py-2.5 min-w-lg rounded-xl
        `}
        placeholder={placeholder}
        name={label}
        {...props}
      />
      <span className="block text-sm text-[#9CA3AF] ">{description}</span>
    </div>
  );
}

export function TextArea({
  label,
  className,
  placeholder,
  description,
  height = "auto",
  ...props
}) {
  return (
    <div className={className || ""}>
      <label className="font-semibold" htmlFor={label}>
        {label}
      </label>
      <textarea
        className={`block mt-4 mb-2 bg-[#303036] border border-[#EFEEEE21] px-5 py-2.5 min-w-lg rounded-none"
        `}
        placeholder={placeholder}
        name={label}
        style={{ height }}
        {...props}
      ></textarea>
      <span className="block text-sm text-[#9CA3AF] ">{description}</span>
    </div>
  );
}
