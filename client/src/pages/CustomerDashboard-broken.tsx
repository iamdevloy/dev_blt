import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Type, 
  Image, 
  Link, 
  Save, 
  Eye, 
  LogOut, 
  Settings,
  Upload,
  RefreshCw,
  Heart,
  Camera,
  Mail,
  Phone,
  MapPin,
  Images,
  Plus
} from 'lucide-react';

interface CustomerSettings {
  id: number;
  customerId: number;
  siteName: string;
  profileImageUrl: string | null;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  customTexts: any;
  socialLinks: any;
  contactInfo: any;
  themeId: string;
  updatedAt: string;
}

interface CustomerDashboardProps {
  customer: { id: number; username: string; email: string };
  initialSettings: CustomerSettings;
  onLogout: () => void;
  onViewGallery: () => void;
  isDarkMode: boolean;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  customer,
  initialSettings,
  onLogout,
  onViewGallery,
  isDarkMode
}) => {
  const [settings, setSettings] = useState<CustomerSettings>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  const [customTexts, setCustomTexts] = useState({
    welcomeMessage: settings.customTexts?.welcomeMessage || 'Welcome to our wedding gallery!',
    description: settings.customTexts?.description || 'Share in our special day by viewing and uploading photos.',
    footer: settings.customTexts?.footer || 'Thank you for celebrating with us!'
  });

  const [socialLinks, setSocialLinks] = useState({
    instagram: settings.socialLinks?.instagram || '',
    facebook: settings.socialLinks?.facebook || '',
    twitter: settings.socialLinks?.twitter || '',
    website: settings.socialLinks?.website || ''
  });

  const [contactInfo, setContactInfo] = useState({
    email: settings.contactInfo?.email || customer.email,
    phone: settings.contactInfo?.phone || '',
    address: settings.contactInfo?.address || ''
  });

  const handleSaveSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedSettings = {
        ...settings,
        customTexts,
        socialLinks,
        contactInfo
      };

      const response = await fetch(`/api/customer/${customer.id}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });

      const data = await response.json();

      if (response.ok) {
        setSettings(data.settings);
        setSuccess('Settings saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to save settings');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (colorType: string, color: string) => {
    setSettings(prev => ({
      ...prev,
      [colorType]: color
    }));
  };

  const handleImageUpload = async (type: 'profileImage' | 'logo', file: File) => {
    // In a real implementation, this would upload to Firebase/cloud storage
    // For now, we'll just show the functionality
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setSettings(prev => ({
        ...prev,
        [type === 'profileImage' ? 'profileImageUrl' : 'logoUrl']: dataUrl
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gallery Customization
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Welcome, {customer.username} - Customize your wedding gallery
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={onViewGallery}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Gallery
            </Button>
            <Button 
              onClick={onLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertDescription className="text-red-700 dark:text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <AlertDescription className="text-green-700 dark:text-green-400">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="galleries" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="galleries" className="flex items-center gap-2">
                <Images className="h-4 w-4" />
                Wedding Galleries
              </TabsTrigger>
              <TabsTrigger value="customization" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Customization
              </TabsTrigger>
            </TabsList>

            {/* Gallery Management Tab */}
            <TabsContent value="galleries" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Images className="h-5 w-5" />
                    Wedding Galleries
                  </CardTitle>
                  <CardDescription>
                    Create and manage multiple wedding galleries with individual URLs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Images className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Gallery Management Coming Soon</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Create multiple wedding galleries with custom URLs for different events
                    </p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <p>• Create galleries like /gallery/sarah-and-michael</p>
                      <p>• Customize each gallery individually</p>
                      <p>• Share unique links with guests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customization Tab */}
            <TabsContent value="customization" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Customization Panel */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Customize Your Gallery
                      </CardTitle>
                      <CardDescription>
                        Personalize your wedding gallery to match your style and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="branding" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="branding">Branding</TabsTrigger>
                          <TabsTrigger value="colors">Colors</TabsTrigger>
                          <TabsTrigger value="content">Content</TabsTrigger>
                          <TabsTrigger value="contact">Contact</TabsTrigger>
                        </TabsList>

                  <TabsContent value="branding" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="siteName">Gallery Name</Label>
                        <Input
                          id="siteName"
                          value={settings.siteName}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            siteName: e.target.value
                          }))}
                          placeholder="Your Wedding Gallery Name"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Profile Image</Label>
                          <div className="mt-2 space-y-2">
                            {settings.profileImageUrl && (
                              <div className="w-24 h-24 rounded-full overflow-hidden">
                                <img 
                                  src={settings.profileImageUrl} 
                                  alt="Profile" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload('profileImage', file);
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Logo</Label>
                          <div className="mt-2 space-y-2">
                            {settings.logoUrl && (
                              <div className="w-24 h-16 border rounded overflow-hidden">
                                <img 
                                  src={settings.logoUrl} 
                                  alt="Logo" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload('logo', file);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={settings.primaryColor}
                            onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                            className="w-16 h-10"
                          />
                          <Input
                            value={settings.primaryColor}
                            onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                            placeholder="#8B5CF6"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            id="secondaryColor"
                            type="color"
                            value={settings.secondaryColor}
                            onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                            className="w-16 h-10"
                          />
                          <Input
                            value={settings.secondaryColor}
                            onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                            placeholder="#A855F7"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="accentColor">Accent Color</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            id="accentColor"
                            type="color"
                            value={settings.accentColor}
                            onChange={(e) => handleColorChange('accentColor', e.target.value)}
                            className="w-16 h-10"
                          />
                          <Input
                            value={settings.accentColor}
                            onChange={(e) => handleColorChange('accentColor', e.target.value)}
                            placeholder="#C084FC"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2">Color Preview</h4>
                      <div className="flex gap-2">
                        <div 
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: settings.primaryColor }}
                        />
                        <div 
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: settings.secondaryColor }}
                        />
                        <div 
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: settings.accentColor }}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="welcomeMessage">Welcome Message</Label>
                        <Textarea
                          id="welcomeMessage"
                          value={customTexts.welcomeMessage}
                          onChange={(e) => setCustomTexts(prev => ({
                            ...prev,
                            welcomeMessage: e.target.value
                          }))}
                          placeholder="Welcome message for your guests"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Gallery Description</Label>
                        <Textarea
                          id="description"
                          value={customTexts.description}
                          onChange={(e) => setCustomTexts(prev => ({
                            ...prev,
                            description: e.target.value
                          }))}
                          placeholder="Describe your wedding gallery"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="footer">Footer Message</Label>
                        <Textarea
                          id="footer"
                          value={customTexts.footer}
                          onChange={(e) => setCustomTexts(prev => ({
                            ...prev,
                            footer: e.target.value
                          }))}
                          placeholder="Thank you message"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label>Social Media Links</Label>
                        <div className="grid md:grid-cols-2 gap-4 mt-2">
                          <Input
                            placeholder="Instagram URL"
                            value={socialLinks.instagram}
                            onChange={(e) => setSocialLinks(prev => ({
                              ...prev,
                              instagram: e.target.value
                            }))}
                          />
                          <Input
                            placeholder="Facebook URL"
                            value={socialLinks.facebook}
                            onChange={(e) => setSocialLinks(prev => ({
                              ...prev,
                              facebook: e.target.value
                            }))}
                          />
                          <Input
                            placeholder="Twitter URL"
                            value={socialLinks.twitter}
                            onChange={(e) => setSocialLinks(prev => ({
                              ...prev,
                              twitter: e.target.value
                            }))}
                          />
                          <Input
                            placeholder="Website URL"
                            value={socialLinks.website}
                            onChange={(e) => setSocialLinks(prev => ({
                              ...prev,
                              website: e.target.value
                            }))}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="contactEmail" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Contact Email
                        </Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo(prev => ({
                            ...prev,
                            email: e.target.value
                          }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="contactPhone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo(prev => ({
                            ...prev,
                            phone: e.target.value
                          }))}
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div>
                        <Label htmlFor="contactAddress" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Address
                        </Label>
                        <Textarea
                          id="contactAddress"
                          value={contactInfo.address}
                          onChange={(e) => setContactInfo(prev => ({
                            ...prev,
                            address: e.target.value
                          }))}
                          placeholder="Wedding venue or contact address"
                          rows={3}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end pt-6 border-t">
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  See how your gallery will look to guests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mini preview */}
                <div 
                  className="border rounded-lg p-4 space-y-3"
                  style={{ 
                    borderColor: settings.primaryColor + '40',
                    backgroundColor: settings.primaryColor + '05'
                  }}
                >
                  <div className="flex items-center gap-3">
                    {settings.profileImageUrl && (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={settings.profileImageUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 
                        className="font-semibold"
                        style={{ color: settings.primaryColor }}
                      >
                        {settings.siteName}
                      </h4>
                      {settings.logoUrl && (
                        <div className="w-16 h-6 overflow-hidden">
                          <img 
                            src={settings.logoUrl} 
                            alt="Logo" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {customTexts.welcomeMessage}
                  </p>
                  
                  <div className="flex gap-1">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: settings.secondaryColor }}
                    />
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: settings.accentColor }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Badge variant="secondary" className="w-full justify-center">
                    <Heart className="h-3 w-3 mr-1" />
                    Gallery Theme: {settings.themeId}
                  </Badge>
                  
                  <Button 
                    onClick={onViewGallery}
                    className="w-full"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Open Full Gallery
                  </Button>
                </div>
              </CardContent>
            </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};