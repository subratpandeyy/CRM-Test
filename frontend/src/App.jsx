import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import Leads from './components/Leads.jsx';
import Contacts from './components/Contacts.jsx';
import Accounts from './components/Accounts.jsx';
import Deals from './components/Deals.jsx';
import Activities from './components/Activities.jsx';
import Members from './components/Members.jsx';
import Organizations from './components/Organizations.jsx';
import Layout from './components/Layout.jsx';
import CRMLandingPage from './components/CRMLandingPage.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner spinner-lg" />
      </div>
    );
  }
  
  return user ? children : <Navigate to="/home" />;
}

// Create router with future flags to suppress warnings
const router = createBrowserRouter([
  {
    path: "/home",
    element: <CRMLandingPage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register", 
    element: <Register />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/leads",
    element: (
      <ProtectedRoute>
        <Layout>
          <Leads />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/contacts",
    element: (
      <ProtectedRoute>
        <Layout>
          <Contacts />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/accounts",
    element: (
      <ProtectedRoute>
        <Layout>
          <Accounts />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/deals",
    element: (
      <ProtectedRoute>
        <Layout>
          <Deals />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/activities",
    element: (
      <ProtectedRoute>
        <Layout>
          <Activities />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/members",
    element: (
      <ProtectedRoute>
        <Layout>
          <Members />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/organizations",
    element: (
      <ProtectedRoute>
        <Layout>
          <Organizations />
        </Layout>
      </ProtectedRoute>
    )
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#111827',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

export default App;
