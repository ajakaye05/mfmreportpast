// src/components/AppContent.tsx
import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { ServiceForm } from './ServiceForm';
import { Routes, Route, useNavigate, useLocation, Navigate, Outlet } from 'react-router-dom';
import { ServicesList } from './ServicesList';
import { ReportsView } from './ReportsView';
import { Service } from '../types';
import LoginForm from './LoginForm';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../firebase';
import { ref, onValue, remove } from 'firebase/database';

const ProtectedRoute: React.FC<{ user: User | null; isLoading: boolean }> = ({ user, isLoading }) => {
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authIsLoading, setAuthIsLoading] = useState(true);

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch services grouped by year/month
  useEffect(() => {
    if (!user) {
      setServices([]);
      setIsLoading(false);
      return;
    }

    const servicesRef = ref(db, 'services');
    const unsubscribe = onValue(
      servicesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const servicesList: Service[] = [];

          Object.keys(data).forEach((year) => {
            Object.keys(data[year]).forEach((month) => {
              Object.keys(data[year][month]).forEach((id) => {
                servicesList.push({
                  id,
                  ...data[year][month][id],
                });
              });
            });
          });

          setServices(servicesList);
        } else {
          setServices([]);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Firebase read failed: ', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleAddNewServiceClick = () => {
    setEditingService(undefined);
    navigate('/add-service');
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    navigate('/add-service');
  };

  const handleCancelEdit = () => {
    setEditingService(undefined);
    navigate('/reports');
  };

  const handleDeleteService = async (service: Service) => {
    if (window.confirm('Are you sure you want to delete this service record?')) {
      try {
        const serviceDate = new Date(service.date);
        const year = serviceDate.getFullYear();
        const month = String(serviceDate.getMonth() + 1).padStart(2, '0');
        const serviceRef = ref(db, `services/${year}/${month}/${service.id}`);
        await remove(serviceRef);
      } catch (error) {
        console.error('Failed to delete service', error);
      }
    }
  };

  const sortedServices = [...services].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (authIsLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authIsLoading ? 'Authenticating...' : 'Loading your church services...'}
          </p>
        </div>
      </div>
    );
  }

  const mainContainerClass =
    location.pathname === '/login'
      ? ''
      : 'max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8 max-w-full overflow-hidden';


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {location.pathname !== '/login' && user && (
        <Header onAddNewServiceClick={handleAddNewServiceClick} user={user} />
      )}

      <main className={mainContainerClass}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />

          <Route
            element={<ProtectedRoute user={user} isLoading={authIsLoading} />}
          >
            <Route
              path="/"
              element={
                <div className="space-y-8">
                  <div className="text-center px-4 sm:px-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                      Church Service Management
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                      Track your church services, manage attendance and finances,
                      and generate comprehensive monthly reports for your
                      congregation and administrative purposes.
                    </p>
                  </div>
                  <ServicesList
                    services={sortedServices}
                    onDeleteService={handleDeleteService}
                    onEditService={handleEditService}
                  />
                </div>
              }
            />
            <Route
              path="/add-service"
              element={
                <div className="max-w-4xl mx-auto px-4">
                  <ServiceForm
                    onCancel={handleCancelEdit}
                    editingService={editingService}
                  />
                </div>
              }
            />
            <Route
              path="/reports"
              element={
                <ReportsView
                  services={services}
                  onEditService={handleEditService}
                />
              }
            />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

