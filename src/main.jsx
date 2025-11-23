import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = "dev-gileny.us.auth0.com";
const clientId = "XY0YKuMcV5ExX0dumKreQYmCuiaSzKop";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: 'http://localhost:5173' }}

    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
