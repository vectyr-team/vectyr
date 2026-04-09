import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

interface ScrollSectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
  children: React.ReactNode;
}

const ScrollSection = ({ as: Tag = "div", className, children, ...props }: ScrollSectionProps) => {
  const ref = useScrollAnimation<HTMLElement>();

  return (
    <Tag ref={ref as any} className={cn("scroll-animate", className)} {...props}>
      {children}
    </Tag>
  );
};

export default ScrollSection;
