import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3, 
  Calendar,
  Mail,
  Shield,
  LogOut,
  RefreshCw
} from 'lucide-react';

interface Customer {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stats?: {
    totalViews: number;
    uniqueVisitors: number;
    mediaUploads: number;
    lastActivity: string;
  };
}

interface AdminDashboardProps {
  admin: { id: number; username: string };
  onLogout: () => void;
  isDarkMode: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  onLogout,
  isDarkMode
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [createLoading, setCreateLoading] = useState(false);

  const loadCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });

      const data = await response.json();

      if (response.ok) {
        setCustomers(prev => [...prev, data.customer]);
        setNewCustomer({ username: '', email: '', password: '' });
        setShowCreateModal(false);
      } else {
        setError(data.message || 'Failed to create customer');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeactivateCustomer = async (customerId: number) => {
    if (!confirm('Are you sure you want to deactivate this customer?')) return;

    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCustomers(prev => prev.map(customer => 
          customer.id === customerId 
            ? { ...customer, isActive: false }
            : customer
        ));
      } else {
        setError('Failed to deactivate customer');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  const getTotalStats = () => {
    return customers.reduce((acc, customer) => {
      const stats = customer.stats || { totalViews: 0, uniqueVisitors: 0, mediaUploads: 0 };
      return {
        totalViews: acc.totalViews + stats.totalViews,
        uniqueVisitors: acc.uniqueVisitors + stats.uniqueVisitors,
        mediaUploads: acc.mediaUploads + stats.mediaUploads
      };
    }, { totalViews: 0, uniqueVisitors: 0, mediaUploads: 0 });
  };

  const totalStats = getTotalStats();

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Welcome back, {admin.username}
            </p>
          </div>
          <Button 
            onClick={onLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertDescription className="text-red-700 dark:text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="statistics" className="space-y-6">
            {/* Statistics Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStats.totalViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Across all galleries</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStats.uniqueVisitors.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total unique users</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Media Uploads</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStats.mediaUploads.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Photos and videos</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Customers Count */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Customers</span>
                    <Badge variant="secondary">{customers.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Customers</span>
                    <Badge variant="default">
                      {customers.filter(c => c.isActive).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Inactive Customers</span>
                    <Badge variant="destructive">
                      {customers.filter(c => !c.isActive).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            {/* Customer Management */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Customer Management
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Manage customer accounts and their gallery access
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setLoading(true);
                    loadCustomers();
                  }}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Customer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Customer</DialogTitle>
                      <DialogDescription>
                        Add a new customer account with gallery access
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateCustomer} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-username">Username</Label>
                        <Input
                          id="new-username"
                          type="text"
                          placeholder="Customer username"
                          value={newCustomer.username}
                          onChange={(e) => setNewCustomer(prev => ({
                            ...prev,
                            username: e.target.value
                          }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-email">Email</Label>
                        <Input
                          id="new-email"
                          type="email"
                          placeholder="customer@example.com"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer(prev => ({
                            ...prev,
                            email: e.target.value
                          }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Temporary password"
                          value={newCustomer.password}
                          onChange={(e) => setNewCustomer(prev => ({
                            ...prev,
                            password: e.target.value
                          }))}
                          required
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button 
                          type="submit" 
                          disabled={createLoading}
                          className="flex-1"
                        >
                          {createLoading ? 'Creating...' : 'Create Customer'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setShowCreateModal(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Customers Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Customers</CardTitle>
                <CardDescription>
                  Overview of all customer accounts and their activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Loading customers...</p>
                  </div>
                ) : customers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No customers yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Get started by creating your first customer account
                    </p>
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Customer
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">
                            {customer.username}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              {customer.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={customer.isActive ? "default" : "destructive"}
                            >
                              {customer.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {new Date(customer.createdAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div>Views: {customer.stats?.totalViews || 0}</div>
                              <div>Uploads: {customer.stats?.mediaUploads || 0}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeactivateCustomer(customer.id)}
                                disabled={!customer.isActive}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};