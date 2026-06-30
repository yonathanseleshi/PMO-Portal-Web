/**
 * Default (development) environment configuration.
 *
 * `apiBaseUrl` is the root of the Wave 02 .NET API. Feature services are wired
 * to construct real endpoint URLs from this base; until backend integration is
 * switched on (`useMockData: true`), they return contract-shaped mock data so
 * the portal is fully demonstrable offline.
 */
export const environment = {
  production: false,
  /** Root URL of the PMO Portal .NET API (Wave 02). */
  apiBaseUrl: 'https://localhost:5001/api',
  /** When true, feature services serve in-memory mock data instead of HTTP. */
  useMockData: true,
};
