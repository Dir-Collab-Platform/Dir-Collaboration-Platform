export default function Button({
  children,
  variant = "base",
  className,
  ...props
}) {
  /*
    variant=base|primary|danger
     */
  const baseStyle = "border border-(--main-border-color) font-semibold";
  const variants = {
    primary: "bg-(--primary-button)",
    danger: "bg-(--notification-count-bg)",
    base: "bg-(--secondary-button)",
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
