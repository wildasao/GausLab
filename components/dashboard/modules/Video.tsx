import { Clapperboard } from "lucide-react";

export function Video({
  src,
  title,
  caption,
}: {
  src: string;
  title?: string;
  caption?: string;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
      {title && (
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-200">
            <Clapperboard className="h-4 w-4" />
          </span>
          <h3 className="font-display text-base font-semibold text-navy-800">{title}</h3>
        </div>
      )}
      <video
        controls
        playsInline
        preload="metadata"
        className="w-full rounded-2xl bg-navy-900"
      >
        <source src={src} type="video/mp4" />
      </video>
      {caption && <p className="mt-3 text-sm leading-relaxed text-slate-700">{caption}</p>}
    </section>
  );
}
