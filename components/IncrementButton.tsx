type IncrementButtonProps = React.ComponentPropsWithoutRef<"button"> & {};

export default function IncrementButton({
  children,
  onClick,
  disabled,
}: IncrementButtonProps) {
  return (
    <button
      className="border border-yellow-300 p-1 text-yellow-300 disabled:pointer-events-none disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
