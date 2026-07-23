import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { getPublicContentFn, createEnquiryFn } from "@/lib/api/cms.functions";
import type { PublicContent, RoomPublic } from "@/lib/cms/defaults";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionHeading } from "@/components/site/section-heading";
import { DatesField, GuestsField } from "@/components/site/booking-fields";
import type { DateRange } from "react-day-picker";
import { bookingWhatsAppHref, whatsappUrl } from "@/lib/whatsapp";

type RoomParam = string;

export const Route = createFileRoute("/")({
  loader: () => getPublicContentFn(),
  validateSearch: (search: Record<string, unknown>): { room?: RoomParam } => {
    const r = search.room;
    if (typeof r === "string" && r.length > 0) return { room: r };
    return {};
  },
  head: ({ loaderData }) => {
    const s = loaderData?.settings;
    const og = s?.ogImage || loaderData?.hero?.imageUrl || "";
    return {
      meta: [
        { title: s?.seoTitle ?? "RRP Dream Inn" },
        { name: "description", content: s?.seoDescription ?? "" },
        { property: "og:title", content: s?.ogTitle ?? "" },
        { property: "og:description", content: s?.ogDescription ?? "" },
        { property: "og:image", content: og },
        { name: "twitter:image", content: og },
      ],
    };
  },
  component: Index,
});

const ContentCtx = createContext<PublicContent | null>(null);
function useContent() {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error("Content missing");
  return ctx;
}

function Index() {
  const content = Route.useLoaderData();
  const { room } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [selectedRoom, setSelectedRoom] = useState<string | null>(room ?? null);

  useEffect(() => {
    setSelectedRoom(room ?? null);
  }, [room]);

  useEffect(() => {
    if (room) {
      const el = document.getElementById("book");
      if (el) {
        requestAnimationFrame(() =>
          el.scrollIntoView({ behavior: "smooth", block: "center" }),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBook = useCallback(
    (roomName: string | null = null) => {
      setSelectedRoom(roomName);
      navigate({
        search: (prev: { room?: RoomParam }) => ({
          ...prev,
          room: roomName || undefined,
        }),
        replace: false,
      });
      const el = document.getElementById("book");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [navigate],
  );

  const clearRoom = useCallback(() => {
    setSelectedRoom(null);
    navigate({
      search: (prev: { room?: RoomParam }) => ({ ...prev, room: undefined }),
      replace: true,
    });
  }, [navigate]);

  return (
    <ContentCtx.Provider value={content}>
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <Hero
          selectedRoom={selectedRoom}
          onClearRoom={clearRoom}
          onSelectRoom={scrollToBook}
        />
        {selectedRoom && (
          <div className="mx-auto max-w-[1600px] px-6 pt-6 md:px-10 lg:hidden">
            <div className="flex items-center justify-between border border-gold/40 bg-gold/10 px-5 py-3">
              <span className="text-xs uppercase tracking-luxe text-gold">
                {content.ui.selectedPrefix}{" "}
                <span className="font-serif text-base normal-case">{selectedRoom}</span>
              </span>
              <button
                onClick={clearRoom}
                className="text-xs uppercase tracking-luxe text-muted-foreground hover:text-gold"
              >
                {content.ui.clearLabel}
              </button>
            </div>
          </div>
        )}
        <RoomCategoriesSelector selectedRoom={selectedRoom} onSelect={scrollToBook} />
        <About />
        <HighlightSection />
        <StayMosaic />
        <RoomsSection />
        <DineSection />
        <ResideSection />
        <WellnessCarousel />
        <Experience />
        <Location />
        <Concierge selectedRoom={selectedRoom} />
        <Footer />
      </div>
    </ContentCtx.Provider>
  );
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function Nav() {
  const { nav, settings, ui } = useContent();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = nav.links ?? [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };
  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "border-b border-gold/15 bg-ink shadow-[0_8px_30px_rgba(0,0,0,0.35)]" : ""
      }`}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          scrolled
            ? "bg-ink opacity-100"
            : "bg-gradient-to-b from-ink/85 via-ink/50 to-transparent opacity-100 backdrop-blur-[2px]"
        }`}
      />

      <div
        className={`relative mx-auto flex max-w-[1600px] items-center justify-end px-6 md:px-10 transition-all duration-500 ${
          scrolled ? "pt-2" : "pt-3"
        }`}
      >
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-2 text-[10px] uppercase tracking-luxe text-bone/80 hover:text-gold"
        >
          {settings.brandGroup}
          <span className="inline-grid grid-cols-2 gap-[2px]">
            <span className="block h-[5px] w-[5px] bg-gold" />
            <span className="block h-[5px] w-[5px] bg-gold" />
            <span className="block h-[5px] w-[5px] bg-gold" />
            <span className="block h-[5px] w-[5px] bg-gold" />
          </span>
        </button>
      </div>

      <div
        className={`relative mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 md:px-10 transition-all duration-500 ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-3 text-left"
          aria-label={`${settings.brandWordmark} ${settings.brandSub} — home`}
        >
          {settings.logoUrl?.trim() ? (
            <img
              src={settings.logoUrl.trim()}
              alt={`${settings.brandWordmark} ${settings.brandSub}`}
              style={{
                height: `${Number(settings.logoHeaderHeight) || 48}px`,
                width: settings.logoHeaderWidth
                  ? `${Number(settings.logoHeaderWidth)}px`
                  : "auto",
              }}
              className="object-contain"
            />
          ) : null}
          <span className="flex flex-col leading-none">
            <span className="font-serif text-3xl tracking-[0.18em] text-bone">
              {settings.brandWordmark}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-luxe text-bone/70">
              {settings.brandSub}
            </span>
          </span>
        </button>

        <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => handleNav(e, l.id)}
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a
            href="#book"
            onClick={(e) => handleNav(e, "book")}
            className="text-[11px] uppercase tracking-[0.2em] text-bone hover:text-gold"
          >
            {settings.manageBookingLabel}
          </a>
          <a
            href={whatsappUrl(settings.conciergeWhatsapp)}
            target="_blank"
            rel="noreferrer"
            aria-label={ui.whatsappAriaLabel}
            className="text-gold hover:opacity-80"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.9-2.9-1.6-4.1-3.5-.3-.5.3-.5.9-1.6.1-.2.05-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.3 3.1c.2.2 2.2 3.4 5.3 4.7 2.6 1.1 3.1 1 3.7.9.6-.1 1.7-.7 2-1.4.3-.7.3-1.2.2-1.4-.1-.2-.3-.2-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 4.9L2 22l5.3-1.4c1.3.7 2.9 1.1 4.7 1.1 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
            </svg>
          </a>
          <a
            href="#concierge"
            onClick={(e) => handleNav(e, "concierge")}
            className="text-[11px] uppercase tracking-[0.2em] text-bone hover:text-gold"
          >
            {settings.signInLabel}
          </a>
          <span className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-bone/70">
            {settings.languageLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="lg:hidden text-bone"
          aria-label={ui.menuAriaLabel}
        >
          <div className="space-y-1.5">
            <span className="block h-px w-6 bg-bone" />
            <span className="block h-px w-6 bg-bone" />
            <span className="block h-px w-6 bg-bone" />
          </div>
        </button>
      </div>

      {open && (
        <div className="relative border-t border-border bg-ink lg:hidden">
          <div className="flex flex-col px-6 py-6">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => handleNav(e, l.id)}
                className="py-3 text-xs uppercase tracking-luxe text-bone"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
              <a
                href="#book"
                onClick={(e) => handleNav(e, "book")}
                className="text-xs uppercase tracking-luxe text-bone"
              >
                {settings.manageBookingLabel}
              </a>
              <a
                href="#concierge"
                onClick={(e) => handleNav(e, "concierge")}
                className="text-xs uppercase tracking-luxe text-bone"
              >
                {settings.signInLabel}
              </a>
              <span className="text-xs uppercase tracking-luxe text-bone/60">
                {settings.languageLabel}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({
  selectedRoom,
  onClearRoom,
  onSelectRoom,
}: {
  selectedRoom: string | null;
  onClearRoom: () => void;
  onSelectRoom: (room: string | null) => void;
}) {
  const { hero } = useContent();
  const lines = hero.headline.split("\n");
  const videoUrl = (hero.videoUrl || "").trim();
  const imageUrl = (hero.imageUrl || "").trim();
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {videoUrl ? (
        <video
          key={videoUrl}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          {...(imageUrl ? { poster: imageUrl } : {})}
          aria-label={hero.imageAlt}
        >
          <source src={videoUrl} />
        </video>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt={hero.imageAlt}
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-charcoal" aria-hidden />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/20 to-ink/40" />
      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-40 md:px-10 md:pb-44">
        <p className="luxe-eyebrow">{hero.eyebrow}</p>
        <h1 className="luxe-display mt-6 max-w-3xl text-5xl text-bone md:text-7xl lg:text-[5.5rem]">
          {lines.map((line, i) => (
            <span key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="luxe-body mt-6 max-w-md text-bone/75">
          {hero.body}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10">
        <BookingBar
          selectedRoom={selectedRoom}
          onClearRoom={onClearRoom}
          onSelectRoom={onSelectRoom}
        />
      </div>
    </section>
  );
}

function BookingBar({
  selectedRoom,
  onClearRoom,
  onSelectRoom,
}: {
  selectedRoom: string | null;
  onClearRoom: () => void;
  onSelectRoom: (room: string | null) => void;
}) {
  const { ui } = useContent();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  return (
    <section id="book" className="mx-auto max-w-[1600px] px-6 pb-6 md:px-10">
      {selectedRoom && (
        <div className="mb-3 hidden items-center justify-between border border-gold/40 bg-gold/10 px-5 py-3 lg:flex">
          <span className="text-xs uppercase tracking-luxe text-gold">
            {ui.selectedPrefix}{" "}
            <span className="font-serif text-base normal-case">{selectedRoom}</span>
          </span>
          <button
            onClick={onClearRoom}
            className="text-xs uppercase tracking-luxe text-muted-foreground hover:text-gold"
          >
            {ui.clearLabel}
          </button>
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          scrollToId("suites");
        }}
        className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-[1.2fr_1.35fr_1.35fr_auto]"
      >
        <RoomField value={selectedRoom} onChange={onSelectRoom} />
        <DatesField
          placeholder={ui.datesPlaceholder}
          range={dateRange}
          onChange={setDateRange}
        />
        <GuestsField
          adults={adults}
          childrenCount={childrenCount}
          onAdultsChange={setAdults}
          onChildrenChange={setChildrenCount}
          adultsLabel={ui.adultsLabel || "Adults"}
          childrenLabel={ui.childrenLabel || "Children"}
        />
        <Button
          type="submit"
          variant="luxe"
          size="luxe"
          className="h-full rounded-none px-12 py-6 text-sm tracking-[0.2em]"
        >
          {ui.findRoomsLabel}
        </Button>
      </form>
    </section>
  );
}

function RoomField({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (room: string | null) => void;
}) {
  const { rooms, ui } = useContent();
  return (
    <label className="relative flex items-center gap-3 bg-charcoal/95 px-6 py-5 backdrop-blur">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-gold shrink-0"
      >
        <path d="M3 21V8l9-5 9 5v13" />
        <path d="M9 21v-8h6v8" />
      </svg>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full appearance-none bg-transparent pr-6 text-base text-bone focus:outline-none"
      >
        <option value="" className="bg-charcoal text-bone">
          {ui.suitePlaceholder}
        </option>
        {rooms.map((r) => (
          <option key={r.name} value={r.name} className="bg-charcoal text-bone">
            {r.name}
          </option>
        ))}
      </select>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute right-6 text-gold"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </label>
  );
}

function About() {
  const { about } = useContent();
  return (
    <section id="about" className="mx-auto max-w-[1400px] px-6 py-32 md:px-12 md:py-48">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-20">
        <div className="md:col-span-5">
          <SectionHeading
            eyebrow={about.eyebrow}
            title={about.headline}
            align="left"
            className="max-w-none [&_h2]:md:text-6xl"
          />
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <p className="luxe-body text-base md:text-lg">{about.body}</p>
          <Separator className="mt-12 h-px w-full bg-border" />
          <div className="mt-12 grid grid-cols-2 gap-8">
            {(about.stats ?? []).map((s) => (
              <Stat key={s.label} n={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-5xl text-gold">{n}</div>
      <div className="mt-2 text-xs uppercase tracking-luxe text-muted-foreground">{label}</div>
    </div>
  );
}

function RoomCategoriesSelector({
  selectedRoom,
  onSelect,
}: {
  selectedRoom: string | null;
  onSelect: (room: string | null) => void;
}) {
  const { rooms, categories, settings } = useContent();
  return (
    <section id="categories" className="border-t border-border bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <SectionHeading
          eyebrow={categories.eyebrow}
          title={categories.headline}
          intro={categories.intro}
        />

        <div className="mt-16 flex flex-wrap justify-center gap-4 md:gap-5">
          {rooms.map((r) => {
            const nums = r.numbers ?? [];
            const active = selectedRoom === r.name;
            const cols = 5;
            const maxSlots = cols * 2;
            const hasOverflow = nums.length > maxSlots;
            const shownNums = hasOverflow ? nums.slice(0, maxSlots - 1) : nums;
            const overflowCount = hasOverflow ? nums.length - shownNums.length : 0;
            const bookHref = bookingWhatsAppHref(settings.conciergeWhatsapp, {
              room: r.name,
              intent: `Hello, I would like to book the ${r.name} at RRP Dream Inn.`,
            });
            return (
              <div
                key={r.name}
                className={`group relative flex w-full flex-col overflow-hidden text-left transition-all duration-500 sm:w-[calc(50%-0.5rem)] lg:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-5rem)/5)] ${
                  active
                    ? "ring-1 ring-gold shadow-[0_0_0_1px_rgba(212,175,105,0.35)]"
                    : "ring-1 ring-white/15 hover:ring-gold/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(r.name)}
                  className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal text-left"
                >
                  {r.image ? (
                    <img
                      src={r.image}
                      alt={r.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-charcoal" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/35" />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink to-transparent" />

                  <div className="absolute left-3 top-3 z-10 flex items-center gap-2 md:left-4 md:top-4">
                    <Badge
                      variant="luxe"
                      className="border-gold/60 bg-ink/80 text-[10px] tracking-[0.22em] text-gold"
                    >
                      {r.size}
                    </Badge>
                  </div>

                  <Badge
                    variant={active ? "luxeSolid" : "luxe"}
                    className={`absolute right-3 top-3 z-10 text-[10px] tracking-[0.22em] md:right-4 md:top-4 ${
                      active
                        ? ""
                        : "border-gold/60 bg-ink/80 text-gold group-hover:border-gold group-hover:bg-gold group-hover:text-primary-foreground"
                    }`}
                  >
                    {active ? categories.selectedLabel : categories.selectLabel}
                  </Badge>

                  <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5">
                    <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-gold">
                      {r.tagline}
                    </p>
                    <h3 className="mt-2 font-serif text-[1.4rem] font-normal leading-[1.15] text-white drop-shadow-sm md:text-[1.55rem]">
                      {r.name}
                    </h3>
                    <div className="mt-4 flex items-end justify-between gap-3 border-t border-gold/35 pt-3.5">
                      <div>
                        <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-bone/70">
                          {categories.fromLabel || "From"}
                        </p>
                        <p className="mt-1 font-serif text-xl font-normal text-gold md:text-[1.35rem]">
                          {r.price.replace(/^From\s+/i, "")}
                        </p>
                      </div>
                      <span
                        role="link"
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(bookHref, "_blank", "noopener,noreferrer");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(bookHref, "_blank", "noopener,noreferrer");
                          }
                        }}
                        className="cursor-pointer pb-0.5 text-[10px] font-medium uppercase tracking-[0.24em] text-white transition-colors hover:text-gold group-hover:text-gold"
                      >
                        {categories.bookCta}
                      </span>
                    </div>
                  </div>
                </button>

                <div className="border-t border-white/10 bg-[#161412] px-4 py-4 md:px-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-bone/70">
                    {categories.roomNumbersLabel}
                    <span className="text-gold"> · {nums.length}</span>
                  </p>
                  <div className="mt-3 min-h-[calc(2*28px+0.375rem)] bg-[#161412]">
                    <div className="grid grid-cols-5 gap-1.5">
                      {shownNums.map((n) => (
                        <span
                          key={n}
                          className="inline-flex min-h-[28px] items-center justify-center border border-gold/45 bg-[#12100e] px-1 font-mono text-[10px] font-normal tracking-wider text-bone"
                        >
                          {n}
                        </span>
                      ))}
                      {hasOverflow && (
                        <span className="inline-flex min-h-[28px] items-center justify-center border border-gold bg-gold/15 px-1 font-mono text-[10px] font-medium tracking-wider text-gold">
                          +{overflowCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HighlightSection() {
  const { highlight, settings } = useContent();
  return (
    <section className="border-t border-border bg-ink py-28 md:py-40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:gap-20 md:px-12">
        <div className="text-center md:text-left">
          <SectionHeading
            eyebrow={highlight.eyebrow}
            title={highlight.headline}
            intro={highlight.body}
            align="left"
            className="mx-auto md:mx-0 [&_h2]:text-5xl [&_h2]:md:text-6xl [&_p]:md:text-[17px] md:[&_.bg-gold\/70]:mx-0"
          />

          <div className="mt-10 space-y-2 text-sm tracking-wide text-muted-foreground">
            <p>{settings.highlightEmail}</p>
            <p>{settings.highlightPhone}</p>
          </div>

          <div className="mt-12">
            <Button asChild variant="luxeOutline" size="luxe">
              <a href={highlight.ctaHref || "#suites"}>{highlight.ctaLabel}</a>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="row-span-2 overflow-hidden">
              <img
                src={highlight.imageMain}
                alt={highlight.imageMainAlt}
                className="h-full min-h-[480px] w-full object-cover md:min-h-[600px]"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden">
              <img
                src={highlight.imageTop}
                alt={highlight.imageTopAlt}
                className="h-[235px] w-full object-cover md:h-[292px]"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden">
              <img
                src={highlight.imageBottom}
                alt={highlight.imageBottomAlt}
                className="h-[235px] w-full object-cover md:h-[292px]"
                loading="lazy"
              />
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-bone px-8 py-6 shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" className="h-3 w-3 fill-current">
                    <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1z" />
                  </svg>
                ))}
              </div>
              <div className="mt-2 text-[10px] tracking-[0.3em] text-ink/60">
                {highlight.awardYear}
              </div>
              <div className="mt-1 font-serif text-2xl italic text-ink">
                {highlight.awardName}
              </div>
              <div className="text-[9px] tracking-[0.32em] text-ink/70">
                {highlight.awardSubtitle}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoomsSection() {
  const { rooms, suites } = useContent();
  const [lightbox, setLightbox] = useState<{ room: RoomPublic; index: number } | null>(
    null,
  );

  return (
    <section id="suites" className="border-t border-border bg-charcoal/40 py-32 md:py-48">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={suites.eyebrow}
            title={suites.headline}
            align="left"
            className="[&_h2]:md:text-6xl"
          />
          <p className="luxe-body max-w-sm">{suites.intro}</p>
        </div>

        <div className="mt-20 space-y-24">
          {rooms.map((r, i) => (
            <RoomCard
              key={r.name}
              room={r}
              reverse={i % 2 === 1}
              index={i + 1}
              onOpen={(idx) => setLightbox({ room: r, index: idx })}
            />
          ))}
        </div>
      </div>

      {lightbox && (
        <Lightbox
          room={lightbox.room}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onChange={(idx) => setLightbox({ room: lightbox.room, index: idx })}
        />
      )}
    </section>
  );
}

function RoomCard({
  room,
  reverse,
  index,
  onOpen,
}: {
  room: RoomPublic;
  reverse: boolean;
  index: number;
  onOpen: (i: number) => void;
}) {
  const { suites, settings } = useContent();
  const [expanded, setExpanded] = useState(false);
  const reserveHref = bookingWhatsAppHref(settings.conciergeWhatsapp, {
    room: room.name,
    intent: `Hello, I would like to reserve the ${room.name} at RRP Dream Inn.`,
  });
  return (
    <article className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
      <div className={`md:col-span-7 ${reverse ? "md:order-2" : ""}`}>
        <button
          type="button"
          onClick={() => onOpen(0)}
          className="group relative block aspect-[4/3] w-full overflow-hidden"
          aria-label={`Open ${room.name} gallery`}
        >
          <img
            src={room.image}
            alt={room.name}
            width={1280}
            height={896}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 border border-gold/60 bg-ink/40 px-4 py-2 text-[10px] uppercase tracking-luxe text-gold opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100">
            <ExpandIcon /> {suites.viewGalleryLabel} · {room.gallery.length}
          </div>
        </button>
      </div>
      <div
        className={`flex flex-col justify-center md:col-span-5 ${reverse ? "md:order-1" : ""}`}
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-gold">0{index}</span>
          <Separator className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-luxe text-muted-foreground">
            {room.size}
          </span>
        </div>
        <p className="luxe-eyebrow mt-8">{room.tagline}</p>
        <h3 className="luxe-display mt-4 text-3xl text-bone md:text-5xl">
          {room.name}
        </h3>
        <p className="luxe-body mt-6 md:text-base">{room.description}</p>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-8 flex items-center gap-3 text-xs uppercase tracking-luxe text-gold transition-opacity hover:opacity-80"
          aria-expanded={expanded}
        >
          <span className="h-px w-8 bg-gold" />
          {expanded
            ? suites.hideGalleryLabel
            : `${suites.exploreGalleryLabel} (${room.gallery.length})`}
        </button>

        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <div>
            <div className="text-[10px] uppercase tracking-luxe text-muted-foreground">
              {suites.perNightLabel}
            </div>
            <div className="mt-1 font-serif text-2xl text-gold">{room.price}</div>
          </div>
          <Button asChild variant="luxeOutline" size="luxe" className="px-6 py-3">
            <a href={reserveHref} target="_blank" rel="noreferrer">
              {suites.reserveLabel}
            </a>
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="md:col-span-12">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {room.gallery.map((g, idx) => (
              <button
                key={`${g.src}-${idx}`}
                type="button"
                onClick={() => onOpen(idx)}
                className="group relative aspect-[4/3] overflow-hidden border border-border"
                aria-label={`Open image ${idx + 1}: ${g.caption}`}
              >
                <img
                  src={g.src}
                  alt={g.caption}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30" />
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 text-[10px] uppercase tracking-luxe text-bone opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {g.caption}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function Lightbox({
  room,
  index,
  onClose,
  onChange,
}: {
  room: RoomPublic;
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const total = room.gallery.length;
  const prev = useCallback(
    () => onChange((index - 1 + total) % total),
    [index, total, onChange],
  );
  const next = useCallback(() => onChange((index + 1) % total), [index, total, onChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next]);

  const current = room.gallery[index];
  if (!current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${room.name} gallery`}
      className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-md"
    >
      <div className="flex items-center justify-between border-b border-border px-6 py-5 md:px-10">
        <div>
          <p className="luxe-eyebrow text-[10px]">{room.tagline}</p>
          <h4 className="mt-1 font-serif text-xl text-bone md:text-2xl">{room.name}</h4>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button
            onClick={onClose}
            aria-label="Close gallery"
            className="text-bone transition-colors hover:text-gold"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 py-6 md:px-16 md:py-10">
        <button
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 border border-border bg-ink/60 p-3 text-bone transition-colors hover:border-gold hover:text-gold md:left-6"
        >
          <ArrowIcon dir="left" />
        </button>
        <img
          key={current.src}
          src={current.src}
          alt={current.caption}
          width={1920}
          height={1280}
          className="max-h-full max-w-full object-contain animate-in fade-in duration-500"
        />
        <button
          onClick={next}
          aria-label="Next image"
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 border border-border bg-ink/60 p-3 text-bone transition-colors hover:border-gold hover:text-gold md:right-6"
        >
          <ArrowIcon dir="right" />
        </button>
      </div>

      <div className="border-t border-border px-6 py-4 md:px-10">
        <p className="mb-4 font-serif text-base text-bone md:text-lg">{current.caption}</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {room.gallery.map((g, idx) => (
            <button
              key={`${g.src}-${idx}`}
              onClick={() => onChange(idx)}
              aria-label={`Go to image ${idx + 1}`}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden border transition-colors md:h-20 md:w-28 ${
                idx === index ? "border-gold" : "border-border hover:border-muted-foreground"
              }`}
            >
              <img
                src={g.src}
                alt=""
                width={224}
                height={160}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              {idx !== index && <div className="absolute inset-0 bg-ink/50" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExpandIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      style={{ transform: dir === "left" ? "rotate(180deg)" : undefined }}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Experience() {
  const { experience } = useContent();
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-32 md:px-12 md:py-48">
      <SectionHeading
        eyebrow={experience.eyebrow}
        title={experience.headline}
        align="left"
        className="mb-20 [&_h2]:md:text-6xl"
      />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {(experience.items ?? []).map((it) => (
          <div key={it.title} id={it.anchor} className="group">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={it.imageUrl}
                alt={it.title}
                width={1280}
                height={896}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            </div>
            <p className="luxe-eyebrow mt-6">{it.tag}</p>
            <h3 className="luxe-display mt-3 text-2xl text-bone md:text-3xl">{it.title}</h3>
            <p className="luxe-body mt-3">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Location() {
  const { location, settings } = useContent();
  const rows: [string, string][] = [
    [location.addressLabel, settings.locationAddress],
    [location.reservationsLabel, settings.locationReservations],
    [location.conciergeLabel, settings.locationConcierge],
    [location.airportLabel, settings.locationAirport],
    [location.railLabel, settings.locationRail],
  ];
  return (
    <section id="location" className="border-t border-border bg-charcoal/40 py-32 md:py-48">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading
              eyebrow={location.eyebrow}
              title={location.headline}
              intro={location.body}
              align="left"
              className="[&_h2]:md:text-6xl"
            />
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <dl className="divide-y divide-border border-y border-border">
              {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-6 py-5">
                  <dt className="text-xs uppercase tracking-luxe text-muted-foreground">{k}</dt>
                  <dd className="col-span-2 font-serif text-lg text-bone">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function StayMosaic() {
  const { stay, rooms, settings } = useContent();
  const bySlug = new Map(rooms.map((r) => [r.slug, r]));
  const spans = [
    "md:col-span-7 md:row-span-2 aspect-[4/5] md:aspect-auto",
    "md:col-span-5 aspect-[16/10]",
    "md:col-span-3 aspect-square",
    "md:col-span-2 aspect-square",
  ];
  const tiles = (stay.tileSlugs ?? [])
    .map((slug, i) => {
      const room = bySlug.get(slug);
      if (!room) return null;
      return { name: room.name, img: room.image, span: spans[i] ?? spans[spans.length - 1] };
    })
    .filter(Boolean) as { name: string; img: string; span: string }[];

  return (
    <section id="stay" className="bg-bone py-28 md:py-40">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <SectionHeading
          eyebrow={stay.eyebrow}
          title={stay.headline}
          tone="light"
          className="[&_h2]:md:text-6xl"
        />

        <div className="mt-16 grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
          {tiles.map((t) => (
            <div key={t.name} className={`group relative block overflow-hidden ${t.span}`}>
              <a href="#suites" className="block h-full w-full">
                <img
                  src={t.img}
                  alt={t.name}
                  width={1280}
                  height={896}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <h3 className="absolute bottom-5 left-6 font-serif text-xl text-bone md:text-2xl">
                  {t.name}
                </h3>
              </a>
              <Button
                asChild
                variant="luxeOutline"
                size="luxe"
                className="absolute right-4 top-4 border-gold/60 bg-ink/40 px-4 py-2 text-[10px] backdrop-blur hover:bg-gold hover:text-primary-foreground"
              >
                <a
                  href={bookingWhatsAppHref(settings.conciergeWhatsapp, {
                    room: t.name,
                    intent: `Hello, I would like to book the ${t.name} at RRP Dream Inn.`,
                  })}
                  target="_blank"
                  rel="noreferrer"
                >
                  {stay.bookNowLabel}
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DineSection() {
  const { dine, settings } = useContent();
  return (
    <section id="dine" className="bg-background py-28 md:py-40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:gap-24 md:px-12">
        <div className="grid grid-cols-2 grid-rows-2 gap-3 md:gap-4">
          <div className="overflow-hidden bg-ink">
            <img
              src={dine.image1}
              alt={dine.image1Alt}
              width={800}
              height={600}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="bg-ink" />
          <div className="bg-ink" />
          <div className="overflow-hidden bg-ink">
            <img
              src={dine.image2}
              alt={dine.image2Alt}
              width={800}
              height={600}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="text-center md:text-left">
          <SectionHeading
            eyebrow={dine.eyebrow}
            title={dine.headline}
            intro={dine.body}
            align="left"
            className="mx-auto md:mx-0 md:[&_.bg-gold\/70]:mx-0"
          />
          <div className="mt-8 space-y-2 text-sm text-muted-foreground">
            <p>{settings.dineEmail}</p>
            <p>{settings.dinePhone}</p>
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild variant="luxeOutline" size="luxe">
              <a href="#experience">{dine.discoverLabel}</a>
            </Button>
            <Button asChild variant="luxe" size="luxe">
              <a
                href={bookingWhatsAppHref(settings.conciergeWhatsapp, {
                  intent: "Hello, I would like to reserve a table at RRP Dream Inn.",
                })}
                target="_blank"
                rel="noreferrer"
              >
                {dine.reserveLabel}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResideSection() {
  const { reside, settings } = useContent();
  return (
    <section id="reside" className="bg-bone py-28 md:py-40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:gap-24 md:px-12">
        <div className="order-2 text-center md:order-1 md:text-left">
          <SectionHeading
            eyebrow={reside.eyebrow}
            title={reside.headline}
            intro={reside.body}
            align="left"
            tone="light"
            className="mx-auto md:mx-0 md:[&_.bg-gold\/70]:mx-0"
          />
          <div className="mt-8 space-y-2 text-sm text-ink/60">
            <p>{settings.resideEmail}</p>
            <p>{settings.residePhone}</p>
          </div>
          <div className="mt-10">
            <Button asChild variant="luxeInk" size="luxe">
              <a
                href={bookingWhatsAppHref(settings.conciergeWhatsapp, {
                  intent: "Hello, I would like to enquire about RRP Residences.",
                })}
                target="_blank"
                rel="noreferrer"
              >
                {reside.ctaLabel}
              </a>
            </Button>
          </div>
        </div>
        <div className="order-1 overflow-hidden md:order-2">
          <img
            src={reside.imageUrl}
            alt={reside.imageAlt}
            width={1280}
            height={896}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function WellnessCarousel() {
  const { wellness, settings } = useContent();
  const slides = wellness.slides ?? [];
  const [i, setI] = useState(0);
  const total = slides.length || 1;
  const prev = () => setI((i - 1 + total) % total);
  const next = () => setI((i + 1) % total);

  return (
    <section id="wellness" className="bg-bone pb-28 md:pb-40">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <SectionHeading
          eyebrow={wellness.eyebrow}
          title={wellness.headline}
          tone="light"
          className="[&_h2]:md:text-6xl"
        />

        <div className="relative mt-16">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${i * 60}%)` }}
            >
              {slides.map((s, idx) => (
                <div key={idx} className="relative w-[60%] flex-shrink-0 px-3">
                  <div
                    className={`aspect-[4/3] overflow-hidden transition-opacity duration-500 ${
                      idx === i ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    <img
                      src={s.imageUrl}
                      alt={s.alt}
                      width={1280}
                      height={896}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-2 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-bone text-ink shadow-xl transition-colors hover:text-gold md:left-6"
          >
            <ArrowIcon dir="left" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-2 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-bone text-ink shadow-xl transition-colors hover:text-gold md:right-6"
          >
            <ArrowIcon dir="right" />
          </button>

          <div className="mt-8 flex justify-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 w-2 rounded-full transition-colors ${
                  idx === i ? "bg-gold" : "bg-ink/20"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="luxeInk" size="luxe">
            <a
              href={bookingWhatsAppHref(settings.conciergeWhatsapp, {
                intent: "Hello, I would like to book a wellness experience at RRP Dream Inn.",
              })}
              target="_blank"
              rel="noreferrer"
            >
              {wellness.ctaLabel}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Concierge({ selectedRoom }: { selectedRoom: string | null }) {
  const { concierge, settings } = useContent();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dates, setDates] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const subject = selectedRoom
    ? `Concierge enquiry — ${selectedRoom}`
    : "Concierge enquiry — RRP Dream Inn";

  const composeBody = () => {
    const lines = [
      `Name: ${name || "—"}`,
      `Email: ${email || "—"}`,
      `Phone: ${phone || "—"}`,
      `Preferred dates: ${dates || "—"}`,
      `Interested in: ${selectedRoom ?? "General enquiry"}`,
      "",
      "Message:",
      message || "—",
    ];
    return lines.join("\n");
  };

  const whatsappHref = `https://wa.me/${settings.conciergeWhatsapp}?text=${encodeURIComponent(
    `${subject}\n\n${composeBody()}`,
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await createEnquiryFn({
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          preferredDates: dates.trim(),
          message: message.trim(),
          roomPreference: selectedRoom ?? "",
        },
      });
      setSent(true);
      setName("");
      setEmail("");
      setPhone("");
      setDates("");
      setMessage("");
    } catch {
      setError(concierge.errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const messagePh = selectedRoom
    ? (concierge.messagePlaceholderWithRoom || "").replace("{room}", selectedRoom)
    : concierge.messagePlaceholder;

  return (
    <section id="concierge" className="border-t border-border bg-ink py-28 md:py-40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 md:grid-cols-12 md:gap-20 md:px-12">
        <div className="md:col-span-5">
          <SectionHeading
            eyebrow={concierge.eyebrow}
            title={concierge.headline}
            intro={concierge.body}
            align="left"
            className="[&_h2]:md:text-6xl"
          />

          {selectedRoom && (
            <div className="mt-8 inline-flex items-center gap-3 border border-gold/40 bg-gold/10 px-4 py-3">
              <Badge variant="luxe" className="border-0 bg-transparent px-0">
                {concierge.enquiringAboutLabel}
              </Badge>
              <span className="font-serif text-base text-bone">{selectedRoom}</span>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-4 text-sm text-muted-foreground">
            <a href={`mailto:${settings.conciergeEmail}`} className="hover:text-gold">
              {settings.conciergeEmail}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-gold"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-gold"
              >
                <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.9-2.9-1.6-4.1-3.5-.3-.5.3-.5.9-1.6.1-.2.05-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.3 3.1c.2.2 2.2 3.4 5.3 4.7 2.6 1.1 3.1 1 3.7.9.6-.1 1.7-.7 2-1.4.3-.7.3-1.2.2-1.4-.1-.2-.3-.2-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 4.9L2 22l5.3-1.4c1.3.7 2.9 1.1 4.7 1.1 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
              </svg>
              {concierge.whatsappLinkLabel}
            </a>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="md:col-span-6 md:col-start-7"
        >
          <div className="relative border border-gold/25 bg-gradient-to-b from-charcoal/90 to-ink/80 p-5 md:p-7">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

            <div className="grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-2">
              <ConciergeField
                label={concierge.fieldName}
                value={name}
                onChange={setName}
                required
              />
              <ConciergeField
                label={concierge.fieldEmail}
                type="email"
                value={email}
                onChange={setEmail}
                required
              />
              <ConciergeField
                label={concierge.fieldPhone}
                value={phone}
                onChange={setPhone}
              />
              <ConciergeField
                label={concierge.fieldDates}
                value={dates}
                onChange={setDates}
                placeholder={concierge.datesPlaceholder}
              />
            </div>

            <div className="mt-1">
              <label className="group block py-3">
                <span className="text-[9px] uppercase tracking-luxe text-gold/70 transition-colors group-focus-within:text-gold">
                  {concierge.fieldMessage}
                </span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                  rows={4}
                  maxLength={1000}
                  placeholder={messagePh}
                  className="mt-2 w-full resize-none border-b border-gold/20 bg-transparent pb-2 font-serif text-base leading-relaxed text-bone placeholder:font-sans placeholder:text-xs placeholder:tracking-normal placeholder:text-bone/35 focus:border-gold focus:outline-none"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
              <Button
                type="submit"
                variant="luxe"
                size="luxe"
                disabled={!name.trim() || !email.trim() || submitting}
                className="flex-1 px-8 py-3 disabled:opacity-40"
              >
                {submitting ? concierge.submittingLabel : concierge.submitLabel}
              </Button>
              <Button asChild variant="luxeOutline" size="luxe" className="flex-1 px-8 py-3">
                <a href={whatsappHref} target="_blank" rel="noreferrer">
                  {concierge.whatsappInsteadLabel}
                </a>
              </Button>
            </div>

            {sent && (
              <p className="mt-5 border-t border-gold/20 pt-4 text-[10px] uppercase tracking-luxe text-gold">
                {concierge.successMessage}
              </p>
            )}
            {error && (
              <p className="mt-5 text-[10px] uppercase tracking-luxe text-red-400/90">
                {error}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function ConciergeField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="group block py-3">
      <span className="text-[9px] uppercase tracking-luxe text-gold/70 transition-colors group-focus-within:text-gold">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        maxLength={255}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-gold/20 bg-transparent pb-2 font-serif text-base text-bone placeholder:font-sans placeholder:text-xs placeholder:tracking-normal placeholder:text-bone/35 focus:border-gold focus:outline-none"
      />
    </label>
  );
}

function Footer() {
  const { footer, settings } = useContent();
  return (
    <footer className="border-t border-border bg-ink py-16">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            {settings.logoUrl?.trim() ? (
              <img
                src={settings.logoUrl.trim()}
                alt={`${settings.brandWordmark} ${settings.brandSub}`}
                style={{
                  height: `${Number(settings.logoFooterHeight) || 40}px`,
                  width: settings.logoFooterWidth
                    ? `${Number(settings.logoFooterWidth)}px`
                    : "auto",
                }}
                className="object-contain"
              />
            ) : null}
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-2xl tracking-wide text-bone">
                {settings.brandWordmark}
              </span>
              <span className="luxe-eyebrow text-[10px]">{settings.brandSub}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {(footer.links ?? []).map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(l.id);
                }}
                className="text-xs uppercase tracking-luxe text-muted-foreground transition-colors hover:text-gold"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-12 hairline" />
        <p className="mt-8 text-center text-xs uppercase tracking-luxe text-muted-foreground">
          © {new Date().getFullYear()} {footer.copyrightSuffix}
        </p>
        {(footer.creditLine || "").trim() ? (
          <p className="mt-3 text-center text-[11px] tracking-wide text-bone/55">
            {footer.creditLine}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
