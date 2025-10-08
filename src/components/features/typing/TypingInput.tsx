export function TypingInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-text z-10 resize-none bg-transparent border-none p-0"
      rows={1}
    />
  );
}
