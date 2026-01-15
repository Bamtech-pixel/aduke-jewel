import { useMemo } from "react";

export default function EngravingPreview({
  value,
  onChange,
  memoryValue,
  onMemoryChange,
  showMemory = true,
}) {
  const preview = useMemo(() => {
    const clean = (value || "").trim();
    if (!clean) return "Your engraving preview will appear here...";
    return clean.length > 40 ? clean.slice(0, 40) + "…" : clean;
  }, [value]);

  return (
    <div className="mt-6 border border-white/10 rounded-xl p-4 bg-white/5">
      <h4 className="text-sm font-semibold text-white">
        Engraving / Customization
      </h4>
      <p className="text-xs text-gray-300 mt-1">
        Add a name, date, short message, or special instruction.
      </p>

      <div className="mt-3 grid gap-3">
        <div>
          <label className="block text-xs text-gray-300 mb-1">
            Engraving text (optional)
          </label>
          <input
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="e.g. Damilola • 25/05 • Forever"
            className="w-full px-3 py-2 rounded-lg bg-black border border-white/15 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d6b37c]"
          />
        </div>

        {showMemory && (
          <div>
            <label className="block text-xs text-gray-300 mb-1">
              Memory QR / Barcode (optional)
            </label>
            <input
              value={memoryValue}
              onChange={(e) => onMemoryChange?.(e.target.value)}
              placeholder="Paste a link or write what you want stored"
              className="w-full px-3 py-2 rounded-lg bg-black border border-white/15 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d6b37c]"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              This can be a link to a photo, note, or memory you want attached to
              your jewelry’s QR/Barcode.
            </p>
          </div>
        )}

        <div className="mt-1">
          <div className="text-xs text-gray-400 mb-2">Preview</div>
          <div className="rounded-lg border border-[#d6b37c]/35 bg-black px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.25em] text-gray-500">
              Aduke_Jewels
            </div>
            <div className="mt-1 text-base text-white">{preview}</div>
            {memoryValue?.trim() ? (
              <div className="mt-2 text-[12px] text-[#d6b37c] break-words">
                Memory: {memoryValue.trim()}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}