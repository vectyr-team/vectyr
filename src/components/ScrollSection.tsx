import { cn } from "@/lib/utils";

interface ScrollSectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
  children: React.ReactNode;
}

// Plain wrapper: text sections render immediately, no fade-in on scroll.
const ScrollSection = ({ as: Tag = "div", className, children, ...props }: ScrollSectionProps) => {
  return (
    <Tag className={cn(className)} {...props}>
      {children}
    </Tag>
  );
};

export default ScrollSection;
