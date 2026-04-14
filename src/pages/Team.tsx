import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { usePageMeta } from "@/hooks/use-seo-data";
import { useTeamData, getOrderedMembers } from "@/hooks/use-team-data";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Team = () => {
  const pageMeta = usePageMeta("team");
  const { departments, members, gridSettings } = useTeamData();

  const deptData = departments.data ?? [];
  const memberData = members.data ?? [];
  const grid = gridSettings.data;

  const gridColsStyle = (cols: number) => ({
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
  });

  const desktopCols = grid?.desktop_columns ?? 4;
  const tabletCols = grid?.tablet_columns ?? 3;
  const mobileCols = grid?.mobile_columns ?? 2;

  const renderGrid = (filteredMembers: typeof memberData) => (
    <div
      className="grid gap-6"
      style={gridColsStyle(mobileCols)}
    >
      {filteredMembers.map((member) => (
        <Link
          key={member.id}
          to={`/team/${member.slug}`}
          className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
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
            <p className="font-body font-semibold text-foreground text-sm md:text-base">{member.name}</p>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">{member.title}</p>
          </div>
        </Link>
      ))}
    </div>
  );

  // CSS to handle responsive columns via media queries
  const responsiveGridCSS = `
    .team-grid { grid-template-columns: repeat(${mobileCols}, minmax(0, 1fr)); }
    @media (min-width: 768px) { .team-grid { grid-template-columns: repeat(${tabletCols}, minmax(0, 1fr)); } }
    @media (min-width: 1024px) { .team-grid { grid-template-columns: repeat(${desktopCols}, minmax(0, 1fr)); } }
  `;

  const renderResponsiveGrid = (filteredMembers: typeof memberData) => (
    <div className="team-grid grid gap-6">
      {filteredMembers.map((member) => (
        <Link
          key={member.id}
          to={`/team/${member.slug}`}
          className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
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
            <p className="font-body font-semibold text-foreground text-sm md:text-base">{member.name}</p>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">{member.title}</p>
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
      <style>{responsiveGridCSS}</style>

      <main className="flex-1 px-6 pt-28 pb-16 md:pt-44 md:pb-24 bg-black02">
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
          ) : (
            <>
              {deptData.length > 0 ? (
                deptData.map((dept) => {
                  const deptMembers = memberData
                    .filter((m) => m.department_id === dept.id)
                    .sort((a, b) => a.sort_order - b.sort_order);
                  if (deptMembers.length === 0) return null;
                  return (
                    <section key={dept.id} className="mb-16">
                      <h2 className="font-headline text-3xl text-foreground mb-6">{dept.name}</h2>
                      {renderResponsiveGrid(deptMembers)}
                    </section>
                  );
                })
              ) : null}

              {/* Unassigned members */}
              {(() => {
                const unassigned = memberData
                  .filter((m) => !m.department_id)
                  .sort((a, b) => a.sort_order - b.sort_order);
                if (unassigned.length === 0) return null;
                return (
                  <section className="mb-16">
                    {deptData.length > 0 && (
                      <h2 className="font-headline text-3xl text-foreground mb-6">Team</h2>
                    )}
                    {renderResponsiveGrid(unassigned)}
                  </section>
                );
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
