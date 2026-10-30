const modules = import.meta.glob<{ url: string }>("@/assets/logos/*.asset.json", {
  eager: true,
  import: "default",
});
const logos = Object.values(modules).map((m) => m.url);

const rows = [0, 1, 2, 3].map((r) => logos.filter((_, i) => i % 4 === r));

const LogoMarquee = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 flex flex-col justify-evenly py-8 opacity-[0.07]"
  >
    {rows.map((row, r) => (
      <div key={r} className="flex w-max overflow-visible">
        <div
          className="flex shrink-0 items-center gap-24 md:gap-36 pr-24 md:pr-36"
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
              className="h-20 md:h-32 w-auto max-w-none brightness-0 invert"
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default LogoMarquee;
