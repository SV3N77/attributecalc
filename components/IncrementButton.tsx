type IncrementButtonProps = React.ComponentPropsWithoutRef<"button"> & {};

export default function IncrementButton({
  children,
  onClick,
  disabled,
}: IncrementButtonProps) {
  return (
    <button
      className="border border-yellow-300 p-1 text-yellow-300"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
