import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MultiTenantWrapper } from './components/MultiTenantWrapper.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MultiTenantWrapper />
  </StrictMode>
);