import { Lightbulb } from "lucide-react";

function formatBody(body: string) {
  // Very small markdown: **bold** and newlines.
  const parts = body.split("\n").map((line, i) => {
    const withBold = line.split(/(\*\*[^*]+\*\*)/g).map((chunk, j) => {
      if (chunk.startsWith("**") && chunk.endsWith("**")) {
        return (
          <strong key={j} className="text-navy-800">
            {chunk.slice(2, -2)}
          </strong>
        );
      }
      return <span key={j}>{chunk}</span>;
    });
    return (
      <p key={i} className="text-sm leading-relaxed text-slate-700">
        {withBold}
      </p>
    );
  });
  return <div className="space-y-3">{parts}</div>;
}

export function Theory({ title, body }: { title?: string; body: string }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
      {title && (
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-200">
            <Lightbulb className="h-4 w-4" />
          </span>
          <h3 className="font-display text-base font-semibold text-navy-800">{title}</h3>
        </div>
      )}
      {formatBody(body)}
    </section>
  );
}

export function Tip({ body }: { body: string }) {
  return (
    <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-inset ring-amber-200">
      <div className="flex items-start gap-2">
        <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
        <p className="text-sm leading-relaxed text-amber-900">{body}</p>
      </div>
    </div>
  );
}
