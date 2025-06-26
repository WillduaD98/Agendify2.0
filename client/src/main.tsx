import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';

// 🔗 Enlace al servidor GraphQL (ajusta si estás desplegado en Render)
const httpLink = createHttpLink({
  uri: 'https://agendify-backend.onrender.com/graphql', // ✅ AJUSTA con tu URL real
});

// 🔐 Contexto de autenticación: agrega token a cada petición
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token'); // 🔄 CAMBIADO AQUÍ
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});


// 🚀 Cliente Apollo con autenticación
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// 🌐 Rutas de React Router
const router = createBrowserRouter([
  {
    path: '*',
    element: <App />,
  },
]);

// 🚀 Renderizar la app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);
