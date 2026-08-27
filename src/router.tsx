import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Skeletons: only show after 120ms of waiting (fast loads never flash),
    // then stay at least 500ms so the swap never strobes.
    defaultPendingMs: 120,
    defaultPendingMinMs: 500,
  });

  return router;
};
