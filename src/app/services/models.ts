/**
 * Service-layer model surface.
 *
 * Re-exports the canonical, Wave-02-aligned domain models so existing
 * `import { ... } from '../models'` paths inside services keep working while
 * pointing at the single source of truth (`src/app/models`). A few rollup /
 * support shapes that are NOT Wave 02 entities are defined here and clearly
 * labeled as frontend-only.
 */
export * from '../models';

import { HealthRag, ProjectPhase, ProjectTier } from '../models';

/** Frontend-only portfolio rollup used by dashboard/registry summaries. */
export interface PortfolioHealth {
  totalProjects: number;
  projectsByTier: Record<ProjectTier, number>;
  projectsByRag: Record<HealthRag, number>;
  projectsByPhase: Record<ProjectPhase, number>;
}

/** Frontend-only registry KPI rollup. */
export interface ProjectRegistryKpis {
  totalProjects: number;
  tier1: number;
  tier2: number;
  tier3: number;
  overdueReports: number;
}
