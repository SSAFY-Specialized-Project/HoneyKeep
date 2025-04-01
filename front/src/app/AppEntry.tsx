import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router/dom";
import AppRouter from "./AppRouter";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

registerSW();

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={AppRouter} />
    </QueryClientProvider>
  </StrictMode>
);
