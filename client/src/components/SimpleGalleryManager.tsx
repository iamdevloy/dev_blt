import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, ExternalLink } from 'lucide-react';

interface SimpleGallery {
  id: string;
  title: string;
  slug: string;
  coupleNames: string;
  description: string;
  weddingDate: string;
  isPublished: boolean;
  createdAt: string;
}

interface SimpleGalleryManagerProps {
  customerId: number;
  customerUsername: string;
  isDarkMode: boolean;
}

export const SimpleGalleryManager: React.FC<SimpleGalleryManagerProps> = ({ 
  customerId, 
  customerUsername, 
  isDarkMode 
}) => {
  const [galleries, setGalleries] = useState<SimpleGallery[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    coupleNames: '',
    description: '',
    weddingDate: '',
    isPublished: false
  });

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

  const handleCreateGallery = async () => {
    try {
      const response = await fetch(`/api/customer/${customerId}/galleries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          customerId
        }),
      });

      if (response.ok) {
        const newGallery = await response.json();
        setGalleries(prev => [...prev, newGallery]);
        setIsCreateModalOpen(false);
        setFormData({
          title: '',
          slug: '',
          coupleNames: '',
          description: '',
          weddingDate: '',
          isPublished: false
        });
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create gallery');
      }
    } catch (error) {
      alert('Error creating gallery. Please try again.');
    }
  };

  const handleDeleteGallery = async (galleryId: string) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return;

    try {
      const response = await fetch(`/api/galleries/${galleryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setGalleries(prev => prev.filter(g => g.id !== galleryId));
      }
    } catch (error) {
      alert('Error deleting gallery. Please try again.');
    }
  };

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
                  <h3 className="text-lg font-semibold">{gallery.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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
                    <ExternalLink className="h-3 w-3" />
                    View
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteGallery(gallery.id)}
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

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Gallery</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
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
                value={formData.weddingDate}
                onChange={(e) => setFormData(prev => ({ ...prev, weddingDate: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Share a brief description of your special day..."
                rows={3}
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
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateGallery}
                className="flex-1"
              >
                Create Gallery
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SimpleGalleryManager;