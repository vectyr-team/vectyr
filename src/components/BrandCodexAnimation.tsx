const BrandCodexAnimation = ({ visible }: { visible: boolean }) => {
  return (
    <div
      className="w-full max-w-[640px] lg:max-w-[550px] mx-auto lg:mx-0 rounded-lg border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        transitionDelay: "1.6s",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: 0, paddingBottom: "56.25%" }}>
        <iframe
          src="https://streamable.com/e/mun9sc?loop=0"
          allow="fullscreen"
          allowFullScreen
          title="Vectyr brand video"
          style={{
            border: "none",
            width: "100%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            overflow: "hidden",
          }}
        />
      </div>
    </div>
  );
};

export default BrandCodexAnimation;
