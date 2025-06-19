import React, { useState, useEffect } from 'react';
import { LandingPage } from '../pages/LandingPage';
import { AdminDashboard } from '../pages/AdminDashboard';
import { CustomerDashboard } from '../pages/CustomerDashboard';
import { useDarkMode } from '../hooks/useDarkMode';
import App from '../App';

interface UserSession {
  type: 'admin' | 'customer' | null;
  data: any;
}

interface CustomerData {
  customer: {
    id: number;
    username: string;
    email: string;
  };
  settings: any;
}

export const MultiTenantWrapper: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [userSession, setUserSession] = useState<UserSession>({ type: null, data: null });
  const [showGallery, setShowGallery] = useState(false);

  // Handle admin login
  const handleAdminLogin = (adminData: any) => {
    setUserSession({
      type: 'admin',
      data: adminData
    });
  };

  // Handle customer login
  const handleCustomerLogin = (customerData: CustomerData) => {
    setUserSession({
      type: 'customer',
      data: customerData
    });
  };

  // Handle logout
  const handleLogout = () => {
    setUserSession({ type: null, data: null });
    setShowGallery(false);
  };

  // Handle viewing customer gallery
  const handleViewGallery = () => {
    setShowGallery(true);
  };

  const handleBackToDashboard = () => {
    setShowGallery(false);
  };

  // If no user is logged in, show landing page
  if (!userSession.type) {
    return (
      <LandingPage
        onAdminLogin={handleAdminLogin}
        onCustomerLogin={handleCustomerLogin}
        isDarkMode={isDarkMode}
      />
    );
  }

  // If admin is logged in, show admin dashboard
  if (userSession.type === 'admin') {
    return (
      <AdminDashboard
        admin={userSession.data}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
      />
    );
  }

  // If customer is logged in and viewing gallery, show customized gallery
  if (userSession.type === 'customer' && showGallery) {
    return (
      <div className="relative">
        {/* Custom header with customer's branding */}
        <div 
          className="bg-gradient-to-r p-4 text-white shadow-lg"
          style={{ 
            backgroundColor: userSession.data.settings?.primaryColor || '#8B5CF6',
            background: `linear-gradient(135deg, ${userSession.data.settings?.primaryColor || '#8B5CF6'}, ${userSession.data.settings?.secondaryColor || '#A855F7'})`
          }}
        >
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              {userSession.data.settings?.profileImageUrl && (
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                  <img 
                    src={userSession.data.settings.profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">
                  {userSession.data.settings?.siteName || `${userSession.data.customer.username}'s Wedding Gallery`}
                </h1>
                <p className="text-white/80">
                  {userSession.data.settings?.customTexts?.welcomeMessage || 'Welcome to our wedding gallery!'}
                </p>
              </div>
            </div>
            {userSession.data.settings?.logoUrl && (
              <div className="w-24 h-12 overflow-hidden">
                <img 
                  src={userSession.data.settings.logoUrl} 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Back to dashboard button */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleBackToDashboard}
            className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white px-4 py-2 rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Original gallery app with customer's customizations */}
        <div 
          style={{
            '--primary-color': userSession.data.settings?.primaryColor || '#8B5CF6',
            '--secondary-color': userSession.data.settings?.secondaryColor || '#A855F7',
            '--accent-color': userSession.data.settings?.accentColor || '#C084FC'
          } as React.CSSProperties}
        >
          <App />
        </div>

        {/* Custom footer */}
        {userSession.data.settings?.customTexts?.footer && (
          <footer 
            className="text-center py-8 text-white"
            style={{ backgroundColor: userSession.data.settings?.primaryColor || '#8B5CF6' }}
          >
            <div className="container mx-auto px-4">
              <p>{userSession.data.settings.customTexts.footer}</p>
              
              {/* Social links */}
              {userSession.data.settings?.socialLinks && (
                <div className="flex justify-center gap-4 mt-4">
                  {userSession.data.settings.socialLinks.instagram && (
                    <a 
                      href={userSession.data.settings.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {userSession.data.settings.socialLinks.facebook && (
                    <a 
                      href={userSession.data.settings.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      Facebook
                    </a>
                  )}
                  {userSession.data.settings.socialLinks.website && (
                    <a 
                      href={userSession.data.settings.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      Website
                    </a>
                  )}
                </div>
              )}
            </div>
          </footer>
        )}
      </div>
    );
  }

  // If customer is logged in but not viewing gallery, show customer dashboard
  if (userSession.type === 'customer') {
    return (
      <CustomerDashboard
        customer={userSession.data.customer}
        initialSettings={userSession.data.settings}
        onLogout={handleLogout}
        onViewGallery={handleViewGallery}
        isDarkMode={isDarkMode}
      />
    );
  }

  return null;
};