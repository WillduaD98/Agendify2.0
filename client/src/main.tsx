import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'; // 
import { setContext } from '@apollo/client/link/context'; // Apollo Client
import { AuthProvider } from './context/AuthContext'; // 👈 Importa el proveedor

// Apollo setup con httpLink y authLink
const httpLink = createHttpLink({ uri: '/graphql' });
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

//  ApolloClient con authLink + cache
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

//  Crear constante `router = createBrowserRouter(...)` y definir rutas.
const router = createBrowserRouter([ // 
  {
    path: '*',
    element: <App />,
  },
]);

// Envolviendo con ApolloProvider y RouterProvider
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);
