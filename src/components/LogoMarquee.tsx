const modules = import.meta.glob<{ url: string }>("@/assets/logos/*.asset.json", {
  eager: true,
  import: "default",
});
const logos = Object.values(modules).map((m) => m.url);

const splitRows = (count: number) =>
  Array.from({ length: count }, (_, r) => logos.filter((_, i) => i % count === r));

const desktopRows = splitRows(4);
const mobileRows = splitRows(7);

const Rows = ({ rows, className, logoClass }: { rows: string[][]; className: string; logoClass: string }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-0 flex-col justify-evenly ${className}`}
  >
    {rows.map((row, r) => (
      <div key={r} className="flex w-max overflow-visible">
        <div
          className="flex shrink-0 items-center gap-16 md:gap-36 pr-16 md:pr-36"
          style={{
            animation: `logo-marquee ${180 + r * 30}s linear infinite ${r % 2 ? "reverse" : "normal"}`,
          }}
        >
          {[...row, ...row].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              loading="eager"
              className={`${logoClass} w-auto max-w-none brightness-0 invert`}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const LogoMarquee = () => (
  <>
    <Rows rows={mobileRows} className="flex md:hidden pt-24 pb-8 opacity-[0.12]" logoClass="h-12" />
    <Rows rows={desktopRows} className="hidden md:flex py-8 opacity-[0.07]" logoClass="h-32" />
  </>
);

export default LogoMarquee;
