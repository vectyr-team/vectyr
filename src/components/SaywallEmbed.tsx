import { useEffect } from "react";

const WIDGET_ID = "vOaykgx9Sd2sLRtwTULLlA";
const SCRIPT_SRC = "https://saywall.io/embed.min.js";

const SaywallEmbed = () => {
  useEffect(() => {
    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      <link
        rel="preload"
        href={`https://saywall.io/w/${WIDGET_ID}?shadow=1`}
        as="fetch"
        crossOrigin="anonymous"
      />
      <div data-saywall-widget={WIDGET_ID} data-mode="shadow" />
    </>
  );
};

export default SaywallEmbed;