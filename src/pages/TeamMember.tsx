import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useTeamMemberBySlug, useTeamData, getOrderedMembers } from "@/hooks/use-team-data";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Icon } from "@iconify/react";

const TeamMember = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: member, isLoading: memberLoading } = useTeamMemberBySlug(slug || "");
  const { departments, members } = useTeamData();

  const allOrdered = departments.data && members.data
    ? getOrderedMembers(departments.data, members.data)
    : [];

  const currentIndex = allOrdered.findIndex((m) => m.slug === slug);
  const prevMember = currentIndex > 0
    ? allOrdered[currentIndex - 1]
    : allOrdered.length > 0 ? allOrdered[allOrdered.length - 1] : null;
  const nextMember = currentIndex < allOrdered.length - 1
    ? allOrdered[currentIndex + 1]
    : allOrdered.length > 0 ? allOrdered[0] : null;

  const isLoading = memberLoading || departments.isLoading || members.isLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <span className="text-muted-foreground font-mono text-sm">Loading...</span>
        </main>
        <Footer />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground font-body text-lg mb-4">Team member not found.</p>
            <Link to="/team" className="text-primary font-mono text-sm hover:underline">
              ← Back to Team
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <SEOHead title={`${member.name} — Vectyr`} description={member.title} />

      <main className="flex-1 px-6 pt-28 pb-16 md:pt-44 md:pb-24">
        <div className="mx-auto max-w-[1300px]">
          {/* Back link */}
          <Link
            to="/team"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <Icon icon="lucide:arrow-left" className="w-4 h-4" />
            Back to Team
          </Link>

          {/* Two-column layout */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Image */}
            <AspectRatio ratio={2 / 3} className="overflow-hidden rounded bg-card">
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={`${member.name}, ${member.title}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-sm">
                  No Photo
                </div>
              )}
            </AspectRatio>

            {/* Info */}
            <div>
              <h1 className="font-headline text-5xl md:text-6xl text-foreground leading-[0.95] mb-2">
                {member.name.toUpperCase()}
              </h1>
              <p className="font-mono text-sm uppercase tracking-[0.15em] text-primary mb-8">
                {member.title}
              </p>
              {member.bio && (
                <div className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground whitespace-pre-line">
                  {member.bio}
                </div>
              )}
            </div>
          </div>

          {/* Prev/Next navigation */}
          <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
            {prevMember ? (
              <Link
                to={`/team/${prevMember.slug}`}
                className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon icon="lucide:arrow-left" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {prevMember.name}
              </Link>
            ) : <span />}
            {nextMember ? (
              <Link
                to={`/team/${nextMember.slug}`}
                className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
              >
                {nextMember.name}
                <Icon icon="lucide:arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : <span />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeamMember;
