import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Trash2, Edit, Plus, Eye, Globe, Settings } from 'lucide-react';
import type { WeddingGallery, InsertWeddingGallery } from '@shared/schema';
import { apiRequest } from '../lib/queryClient';

interface GalleryManagerProps {
  customerId: number;
  isDarkMode: boolean;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({ customerId, isDarkMode }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<WeddingGallery | null>(null);
  const [formData, setFormData] = useState<Partial<InsertWeddingGallery>>({
    slug: '',
    title: '',
    description: '',
    weddingDate: '',
    coupleNames: '',
    welcomeMessage: '',
    isPublished: false
  });

  const queryClient = useQueryClient();

  const { data: galleries = [], isLoading } = useQuery<WeddingGallery[]>({
    queryKey: ['/api/customer', customerId, 'galleries'],
    queryFn: () => apiRequest(`/api/customer/${customerId}/galleries`)
  });

  const createGalleryMutation = useMutation({
    mutationFn: (data: InsertWeddingGallery) => 
      apiRequest(`/api/customer/${customerId}/galleries`, { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customer', customerId, 'galleries'] });
      resetForm();
      setIsCreateModalOpen(false);
    }
  });

  const updateGalleryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<WeddingGallery> }) =>
      apiRequest(`/api/galleries/${id}`, { method: 'PUT', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customer', customerId, 'galleries'] });
      resetForm();
      setEditingGallery(null);
    }
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/galleries/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customer', customerId, 'galleries'] });
    }
  });

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      description: '',
      weddingDate: '',
      coupleNames: '',
      welcomeMessage: '',
      isPublished: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGallery) {
      updateGalleryMutation.mutate({
        id: editingGallery.id,
        data: formData
      });
    } else {
      createGalleryMutation.mutate({
        ...formData,
        customerId
      } as InsertWeddingGallery);
    }
  };

  const handleEdit = (gallery: WeddingGallery) => {
    setEditingGallery(gallery);
    setFormData({
      slug: gallery.slug,
      title: gallery.title,
      description: gallery.description || '',
      weddingDate: gallery.weddingDate || '',
      coupleNames: gallery.coupleNames,
      welcomeMessage: gallery.welcomeMessage || '',
      isPublished: gallery.isPublished
    });
  };

  const handleDelete = (gallery: WeddingGallery) => {
    if (confirm(`Are you sure you want to delete "${gallery.title}"? This action cannot be undone.`)) {
      deleteGalleryMutation.mutate(gallery.id);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Wedding Galleries</h2>
          <p className="text-gray-600 dark:text-gray-400">Create and manage your wedding photo galleries</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Gallery
        </Button>
      </div>

      {/* Gallery Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {galleries.map((gallery) => (
          <Card key={gallery.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{gallery.title}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {gallery.coupleNames}
                  </p>
                </div>
                <Badge variant={gallery.isPublished ? "default" : "secondary"}>
                  {gallery.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {gallery.weddingDate && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {gallery.weddingDate}
                </p>
              )}
              
              {gallery.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {gallery.description}
                </p>
              )}

              <div className="text-xs text-gray-500 dark:text-gray-400">
                URL: /gallery/{gallery.slug}
              </div>

              <div className="flex gap-2 pt-2">
                {gallery.isPublished && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/gallery/${gallery.slug}`, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(gallery)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(gallery)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {galleries.length === 0 && (
        <Card className="text-center p-8">
          <div className="text-4xl mb-4">📸</div>
          <h3 className="text-lg font-semibold mb-2">No Galleries Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first wedding gallery to start sharing your special moments
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create Your First Gallery
          </Button>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen || !!editingGallery} onOpenChange={(open) => {
        if (!open) {
          setIsCreateModalOpen(false);
          setEditingGallery(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGallery ? 'Edit Gallery' : 'Create New Gallery'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Gallery Title</label>
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Our Wedding Day"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Couple Names</label>
              <Input
                value={formData.coupleNames}
                onChange={(e) => setFormData(prev => ({ ...prev, coupleNames: e.target.value }))}
                placeholder="e.g., Sarah & Michael"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="e.g., sarah-and-michael"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Gallery will be available at: /gallery/{formData.slug}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Wedding Date</label>
              <Input
                type="date"
                value={formData.weddingDate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, weddingDate: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Share a brief description of your special day..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Welcome Message</label>
              <Textarea
                value={formData.welcomeMessage || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                placeholder="Welcome friends and family to view your photos..."
                rows={2}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="isPublished" className="text-sm font-medium">
                Publish gallery (make it publicly accessible)
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingGallery(null);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createGalleryMutation.isPending || updateGalleryMutation.isPending}
                className="flex-1"
              >
                {createGalleryMutation.isPending || updateGalleryMutation.isPending
                  ? 'Saving...'
                  : editingGallery ? 'Update' : 'Create'
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryManager;