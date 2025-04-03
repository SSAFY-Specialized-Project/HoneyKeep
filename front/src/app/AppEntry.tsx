import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router/dom';
import AppRouter from './AppRouter';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { useFCMStore } from '@/shared/store';

registerSW();

useFCMStore.getState().initializeFCM();

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={AppRouter} />
    </QueryClientProvider>
  </StrictMode>,
);
