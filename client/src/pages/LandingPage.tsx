import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Camera, Users, Star, Shield, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onAdminLogin: (adminData: any) => void;
  onCustomerLogin: (customerData: any) => void;
  isDarkMode: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onAdminLogin,
  onCustomerLogin,
  isDarkMode
}) => {
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [customerCredentials, setCustomerCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminCredentials)
      });

      const data = await response.json();

      if (data.success) {
        onAdminLogin(data.admin);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerCredentials)
      });

      const data = await response.json();

      if (data.success) {
        onCustomerLogin({ customer: data.customer, settings: data.settings });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 min-h-screen">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Heart className="h-16 w-16 text-purple-600 dark:text-purple-400" fill="currentColor" />
                <Sparkles className="h-6 w-6 text-pink-500 absolute -top-1 -right-1" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Wedding Gallery
              <span className="block text-purple-600 dark:text-purple-400 text-2xl md:text-3xl font-normal mt-2">
                Share Your Special Moments
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Create beautiful, personalized wedding galleries for your guests to share photos, 
              leave comments, and celebrate your special day together.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <Camera className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Photo Sharing
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Let guests upload and share their favorite moments from your wedding day
              </p>
            </div>
            <div className="text-center p-6">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Guest Interaction
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enable comments, likes, and real-time interactions with your wedding photos
              </p>
            </div>
            <div className="text-center p-6">
              <Star className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Customizable
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Personalize your gallery with custom colors, themes, and branding
              </p>
            </div>
          </div>

          {/* Login Section */}
          <div className="max-w-md mx-auto">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Access Your Gallery
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Sign in to manage your wedding gallery or admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="customer" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="customer">Customer Login</TabsTrigger>
                    <TabsTrigger value="admin">
                      <Shield className="h-4 w-4 mr-1" />
                      Admin
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="customer" className="space-y-4">
                    <form onSubmit={handleCustomerLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="customer-username">Username</Label>
                        <Input
                          id="customer-username"
                          type="text"
                          placeholder="Enter your username"
                          value={customerCredentials.username}
                          onChange={(e) => setCustomerCredentials(prev => ({
                            ...prev,
                            username: e.target.value
                          }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer-password">Password</Label>
                        <Input
                          id="customer-password"
                          type="password"
                          placeholder="Enter your password"
                          value={customerCredentials.password}
                          onChange={(e) => setCustomerCredentials(prev => ({
                            ...prev,
                            password: e.target.value
                          }))}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={loading}
                      >
                        {loading ? 'Signing in...' : 'Sign In to Gallery'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="admin" className="space-y-4">
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-username">Admin Username</Label>
                        <Input
                          id="admin-username"
                          type="text"
                          placeholder="Admin username"
                          value={adminCredentials.username}
                          onChange={(e) => setAdminCredentials(prev => ({
                            ...prev,
                            username: e.target.value
                          }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-password">Admin Password</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="Admin password"
                          value={adminCredentials.password}
                          onChange={(e) => setAdminCredentials(prev => ({
                            ...prev,
                            password: e.target.value
                          }))}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-red-600 hover:bg-red-700"
                        disabled={loading}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        {loading ? 'Signing in...' : 'Admin Login'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {error && (
                  <Alert className="mt-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                    <AlertDescription className="text-red-700 dark:text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Demo credentials info */}
          <div className="mt-8 text-center">
            <Card className="max-w-md mx-auto bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Demo Credentials
                </h4>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <p><strong>Admin:</strong> username: admin, password: admin123</p>
                  <p><strong>Need a customer account?</strong> Ask an admin to create one for you</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};