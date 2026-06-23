# Task: Implement Ventura County ITS PMO Portal Angular Application

## Phase 1: Foundation & Layout
- [ ] Create `task.md` and initialize planning (Done)
- [ ] Update `metadata.json` with descriptive name and description (Done)
- [ ] Define shared models and DTOs in `src/app/core/models/` and `src/app/core/dtos/`
- [ ] Create mock data service `src/app/core/services/pmo-mock.service.ts` providing realistic data for Projects, Status Reports, Submissions, and User Session
- [ ] Implement layout components:
  - [ ] `src/app/layout/sidebar/sidebar.component.ts` & `.html` & `.css`
  - [ ] `src/app/layout/header/header.component.ts` & `.html` & `.css`
  - [ ] `src/app/layout/copilot/copilot.component.ts` & `.html` & `.css`
  - [ ] `src/app/layout/shell/shell.component.ts` & `.html` & `.css`

## Phase 2: Shared & Reusable Components
- [ ] Implement reusable components:
  - [ ] `CardComponent` (with thin border, soft shadow, optionally RAG left-border)
  - [ ] `TableComponent` (with search, sort, filter support)
  - [ ] `BadgeComponent` / `RagIndicatorComponent` (for consistent status, gate, tier display)
  - [ ] `GateStepperComponent` (visualizing G1–G5 lifecycle stages)
  - [ ] `PageHeaderComponent` (civic strip + breadcrumbs + page title + actions)

## Phase 3: Feature Workspaces (Pages)
- [ ] Implement feature pages:
  - [ ] **Dashboard**: Portfolio summary metrics, Quick actions, My Projects list, Announcements
  - [ ] **Project Registry**: Rich sortable/filterable table of all projects, search, tier/phase filters
  - [ ] **Project Detail**: Header identity, gate stepper, summary, health panels, subprojects, milestones
  - [ ] **Template Library**: Downloadable templates, tier filtering, submit actions
  - [ ] **Submissions Queue**: Table view of submissions, status filtering, review actions
  - [ ] **Governance Board**: Read-only portfolio summary, high-level decisions
  - [ ] **Resources**: Policies, standards, worked examples
  - [ ] **Admin**: Role-based placeholder panel

## Phase 4: Routing & Integration
- [ ] Set up routing in `src/app/app.routes.ts`
- [ ] Configure active state and shell layout in `src/app/app.ts`
- [ ] Fine-tune design tokens in `src/styles.css` matching Public Sans typography and the defined palette
- [ ] Verify compilation and run linter to resolve any issues
