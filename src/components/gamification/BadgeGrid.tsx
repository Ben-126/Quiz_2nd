import type { BadgeDebloque } from "@/types";
import type { BadgeInfo } from "@/lib/gamification";

interface BadgeGridProps {
  allBadges: BadgeInfo[];
  debloques: BadgeDebloque[];
}

export default function BadgeGrid({ allBadges, debloques }: BadgeGridProps) {
  const debloquesSet = new Set(debloques.map((b) => b.id));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 12 }}>
      {allBadges.map((badge) => {
        const debloque = debloquesSet.has(badge.id);
        return (
          <div
            key={badge.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: 12,
              borderRadius: "var(--r-md)",
              border: "1px solid",
              textAlign: "center",
              transition: "all 0.15s",
              ...(debloque
                ? { background: "rgba(77,94,232,0.08)", borderColor: "rgba(77,94,232,0.25)" }
                : { background: "rgba(255,255,255,0.03)", borderColor: "var(--border)", opacity: 0.4, filter: "grayscale(1)" })
            }}
            title={debloque ? badge.description : `🔒 ${badge.description}`}
          >
            <span style={{ fontSize: 24 }}>{debloque ? badge.emoji : "🔒"}</span>
            <span style={{ fontSize: 11, fontWeight: 500, lineHeight: 1.2, color: debloque ? "var(--indigo-l)" : "var(--text3)" }}>
              {badge.nom}
            </span>
          </div>
        );
      })}
    </div>
  );
}
