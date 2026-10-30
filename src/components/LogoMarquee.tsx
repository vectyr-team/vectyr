const modules = import.meta.glob<{ url: string }>("@/assets/logos/*.asset.json", {
  eager: true,
  import: "default",
});
const logos = Object.values(modules).map((m) => m.url);

// Each row takes a different slice of the logo list so neighbouring rows don't repeat.
const buildRows = (count: number, perRow: number, step: number) =>
  Array.from({ length: count }, (_, r) =>
    Array.from({ length: perRow }, (_, i) => logos[(r * step + i) % logos.length])
  );

// The field is rotated, so it needs more rows than before to cover the corners.
const desktopRows = buildRows(14, 14, 7);
const mobileRows = buildRows(12, 9, 4);

const ROTATION = -30;

const Rows = ({
  rows,
  className,
  fieldClass,
  logoClass,
}: {
  rows: string[][];
  className: string;
  fieldClass: string;
  logoClass: string;
}) => (
  <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
    <div
      className={`absolute left-1/2 h-[250%] w-[250%] flex flex-col justify-center ${fieldClass}`}
      style={{ transform: `translate(-50%, -50%) rotate(${ROTATION}deg)` }}
    >
      {rows.map((row, r) => (
        <div key={r} className="flex w-max overflow-visible">
          <div
            className="flex shrink-0 items-center gap-11 md:gap-[101px] pr-11 md:pr-[101px]"
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
  </div>
);

const LogoMarquee = () => (
  <>
    <Rows
      rows={mobileRows}
      className="block md:hidden opacity-[0.09]"
      fieldClass="top-[calc(50%+48px)] gap-11"
      logoClass="h-10"
    />
    <Rows
      rows={desktopRows}
      className="hidden md:block opacity-[0.07]"
      fieldClass="top-1/2 gap-12 lg:gap-14"
      logoClass="h-12 lg:h-20"
    />
  </>
);

export default LogoMarquee;
