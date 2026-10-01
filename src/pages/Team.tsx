import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { usePageMeta } from "@/hooks/use-seo-data";
import { useTeamData } from "@/hooks/use-team-data";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BreadcrumbListJsonLd } from "@/components/JsonLd";

const Team = () => {
  const pageMeta = usePageMeta("team");
  const { departments, members, gridSettings } = useTeamData();

  const deptData = departments.data ?? [];
  const memberData = members.data ?? [];
  const grid = gridSettings.data;
  const loadError = departments.error || members.error;

  const desktopCols = grid?.desktop_columns ?? 4;
  const tabletCols = grid?.tablet_columns ?? 3;
  const mobileCols = grid?.mobile_columns ?? 2;

  const responsiveGridCSS = `
    .team-grid { grid-template-columns: repeat(${mobileCols}, minmax(0, 1fr)); }
    @media (min-width: 768px) { .team-grid { grid-template-columns: repeat(${tabletCols}, minmax(0, 1fr)); } }
    @media (min-width: 1024px) { .team-grid { grid-template-columns: repeat(${desktopCols}, minmax(0, 1fr)); } }
  `;

  const renderResponsiveGrid = (filteredMembers: typeof memberData, startIndex = 0) => (
    <div className="team-grid grid gap-6">
      {filteredMembers.map((member, i) => (
        <Link
          key={member.id}
          to={`/team/${member.slug}`}
          className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded opacity-0 animate-fade-in"
          style={{ animationDelay: `${(startIndex + i) * 60}ms`, animationFillMode: "forwards" }}
        >
          <AspectRatio ratio={2 / 3} className="overflow-hidden rounded bg-card">
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={`${member.name}, ${member.title}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-xs">
                No Photo
              </div>
            )}
          </AspectRatio>
          <div className="mt-3">
            <p className="font-body font-semibold text-foreground text-xs md:text-base">{member.name}</p>
            <p className="font-mono text-[10px] md:text-xs text-muted-foreground mt-0.5 uppercase tracking-[1px]">{member.title}</p>
          </div>
        </Link>
      ))}
    </div>
  );

  const isLoading = departments.isLoading || members.isLoading || gridSettings.isLoading;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <SEOHead {...pageMeta} />
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Team", path: "/team" },
        ]}
      />
      <style>{responsiveGridCSS}</style>

      <main className="flex-1 px-6 pt-28 pb-16 md:pt-44 md:pb-24 bg-background">
        <div className="mx-auto max-w-[1300px]">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-6 block">
            Our Team
          </span>
          <h1 className="font-headline font-light text-5xl leading-[0.95] text-foreground sm:text-6xl md:text-7xl mb-12">
            THE PEOPLE BEHIND<br />
            <span className="text-primary">THE WORK.</span>
          </h1>

          {isLoading ? (
            <p className="text-muted-foreground font-mono text-sm">Loading...</p>
          ) : loadError ? (
            <p className="text-muted-foreground font-body text-base">Unable to load the team right now.</p>
          ) : (
            <>
              {(() => {
                let runningIndex = 0;
                const sections: JSX.Element[] = [];

                if (deptData.length > 0) {
                  deptData.forEach((dept) => {
                    const deptMembers = memberData
                      .filter((m) => m.department_id === dept.id)
                      .sort((a, b) => a.sort_order - b.sort_order);
                    if (deptMembers.length === 0) return;
                    const startIndex = runningIndex;
                    runningIndex += deptMembers.length;
                    sections.push(
                      <section key={dept.id} className="mb-16">
                        <h2 className="font-headline text-2xl md:text-3xl text-foreground mb-6">{dept.name}</h2>
                        {renderResponsiveGrid(deptMembers, startIndex)}
                      </section>
                    );
                  });
                }

                const unassigned = memberData
                  .filter((m) => !m.department_id)
                  .sort((a, b) => a.sort_order - b.sort_order);
                if (unassigned.length > 0) {
                  const startIndex = runningIndex;
                  sections.push(
                    <section key="unassigned" className="mb-16">
                      {deptData.length > 0 && (
                        <h2 className="font-headline text-2xl md:text-3xl text-foreground mb-6">Team</h2>
                      )}
                      {renderResponsiveGrid(unassigned, startIndex)}
                    </section>
                  );
                }

                return sections;
              })()}

              {memberData.length === 0 && (
                <p className="text-muted-foreground font-body text-base">
                  No team members have been added yet.
                </p>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Team;
