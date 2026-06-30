import { UserRole } from '../../models/user-session.model';

/**
 * Primary navigation model for the PMO Portal sidebar.
 *
 * `roles` declares which roles may SEE the item. This is convenience-only UI
 * gating — every route is independently protected by guards and, ultimately,
 * by .NET API authorization (Design Guide §8, App Guide §3.2). An item with no
 * `roles` is visible to all authenticated users.
 *
 * The role visibility here is kept in lock-step with the route guards in
 * `app.routes.ts` so the menu never offers a link that resolves to Access
 * Denied.
 */
export interface NavItem {
  label: string;
  route: string;
  /** Lucide-style SVG path(s) at 24px / 2px stroke. */
  iconPaths: string[];
  /** Roles allowed to see this item; omit/empty = all authenticated users. */
  roles?: UserRole[];
  /** Match exactly (used for list roots that have detail children). */
  exact?: boolean;
  /** Optional small pill (e.g. "New"). */
  badge?: string;
}

export interface NavGroup {
  heading: string;
  items: NavItem[];
}

const PMO_AND_BOARD = [UserRole.PMOLead, UserRole.PMOAnalyst, UserRole.GovernanceBoard];
const PMO_ONLY = [UserRole.PMOLead, UserRole.PMOAnalyst];

export const NAV_GROUPS: NavGroup[] = [
  {
    heading: 'General',
    items: [
      {
        label: 'Dashboard',
        route: '/dashboard',
        iconPaths: [
          'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
        ],
      },
      {
        label: 'My Projects',
        route: '/my-projects',
        iconPaths: [
          'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
        ],
      },
      {
        label: 'Project Registry',
        route: '/projects',
        exact: true,
        roles: PMO_AND_BOARD,
        iconPaths: [
          'M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5',
        ],
      },
      {
        label: 'Template Library',
        route: '/templates',
        iconPaths: [
          'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
        ],
      },
      {
        label: 'Submissions Queue',
        route: '/submissions',
        roles: PMO_ONLY,
        badge: 'PMO',
        iconPaths: [
          'M9 12h3.75M9 15h3.375M9 18h3.375m1.875-12h7.5M12 3h7.5M12 6H4.5A2.25 2.25 0 002.25 8.25v10.5A2.25 2.25 0 004.5 21h7.5M13.5 6L9 3',
        ],
      },
    ],
  },
  {
    heading: 'Governance & Resources',
    items: [
      {
        label: 'Governance Board',
        route: '/governance-board',
        roles: PMO_AND_BOARD,
        iconPaths: [
          'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
        ],
      },
      {
        label: 'Learning & Resources',
        route: '/learning',
        iconPaths: [
          'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-16.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-16.25v16.25',
        ],
      },
      {
        label: 'Podcast',
        route: '/podcast',
        iconPaths: [
          'M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z',
        ],
      },
      {
        label: 'PMO Newsletter',
        route: '/newsletters',
        iconPaths: [
          'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z',
        ],
      },
      {
        label: 'Notifications',
        route: '/inbox',
        iconPaths: [
          'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
        ],
      },
    ],
  },
  {
    heading: 'Administration',
    items: [
      {
        label: 'System Admin',
        route: '/admin',
        roles: [UserRole.PMOLead],
        iconPaths: [
          'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.241.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z',
          'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
        ],
      },
    ],
  },
];
