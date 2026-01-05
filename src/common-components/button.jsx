export default function Button({
  children,
  variant = "base",
  className,
  ...props
}) {
  /*
    variant=base|primary|danger
     */
  const baseStyle = "border border-[#EFEEEE21] font-semibold";
  const variants = {
    primary: "bg-[#1F1F56]",
    danger: "bg-[#950606]",
    base: "bg-[#242429]",
    outline: "bg-transparent",
  };
  return (
    <button
      className={`${variants[variant]} ${baseStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
