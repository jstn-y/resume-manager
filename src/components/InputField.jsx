export default function InputField({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[#aaa] text-xs uppercase tracking-widest">
        {label}
      </label>
      <input
        className="bg-[#111] border border-[#2e2e2e] rounded-lg px-4 py-3 text-[#f0ece3] w-full"
        {...props}
      />
    </div>
  )
}
