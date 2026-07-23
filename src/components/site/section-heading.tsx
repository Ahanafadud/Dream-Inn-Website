import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  tone = "dark",
  className,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  tone?: "dark" | "light";
  className?: string;
}) {
  const lines = title.split("\n");
  const isCenter = align === "center";
  const muted =
    tone === "light" ? "text-ink/75" : "text-bone/80";
  const titleColor = tone === "light" ? "text-ink" : "text-bone";
  const eyebrowClass =
    tone === "light"
      ? "text-[11px] font-medium uppercase tracking-luxe text-ink/70"
      : "luxe-eyebrow";

  return (
    <div
      className={cn(
        isCenter ? "mx-auto max-w-2xl text-center" : "max-w-xl text-left",
        className,
      )}
    >
      <p className={eyebrowClass}>{eyebrow}</p>
      <h2
        className={cn(
          "mt-5 font-serif text-4xl font-normal leading-[1.08] tracking-[-0.02em] md:text-5xl lg:text-[3.35rem]",
          titleColor,
        )}
      >
        {lines.map((line, i) => (
          <span key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </h2>
      {intro ? (
        <>
          <Separator
            className={cn(
              "mt-7 h-px w-12 bg-gold",
              isCenter ? "mx-auto" : "mx-0",
            )}
          />
          <p
            className={cn(
              "mt-6 max-w-xl text-[15px] font-normal leading-[1.85] md:text-base",
              muted,
              isCenter && "mx-auto",
            )}
          >
            {intro}
          </p>
        </>
      ) : null}
    </div>
  );
}
