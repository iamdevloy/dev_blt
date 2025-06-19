import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { InstagramGallery } from '../components/InstagramGallery';
import { StoriesBar } from '../components/StoriesBar';
import { StoriesViewer } from '../components/StoriesViewer';
import { MediaModal } from '../components/MediaModal';
import { LiveUserIndicator } from '../components/LiveUserIndicator';
import type { WeddingGallery } from '@shared/schema';
import type { MediaItem, Story, Comment, Like } from '../types/index';

const GalleryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentUser] = useState("Guest");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [modalIndex, setModalIndex] = useState(-1);
  const [storyViewerIndex, setStoryViewerIndex] = useState(-1);

  const { data: gallery, isLoading, error } = useQuery<WeddingGallery>({
    queryKey: ['/api/gallery', slug],
    queryFn: async () => {
      const response = await fetch(`/api/gallery/${slug}`);
      if (!response.ok) {
        throw new Error('Gallery not found');
      }
      return response.json();
    },
    enabled: !!slug
  });

  useEffect(() => {
    if (gallery?.mediaItems) {
      setMediaItems(Array.isArray(gallery.mediaItems) ? gallery.mediaItems : []);
    }
    
    // Apply custom branding
    if (gallery?.branding) {
      const branding = gallery.branding as any;
      if (branding.primaryColor) {
        document.documentElement.style.setProperty('--primary', branding.primaryColor);
      }
      if (branding.secondaryColor) {
        document.documentElement.style.setProperty('--secondary', branding.secondaryColor);
      }
      if (branding.accentColor) {
        document.documentElement.style.setProperty('--accent', branding.accentColor);
      }
    }
  }, [gallery]);

  const handleItemClick = (index: number) => {
    setModalIndex(index);
  };

  const handleAddComment = async (mediaId: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      mediaId,
      text,
      userName: currentUser,
      deviceId: 'guest-device',
      createdAt: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const handleToggleLike = (mediaId: string) => {
    setLikes(prev => {
      const existing = prev.find(l => l.mediaId === mediaId && l.userName === currentUser);
      if (existing) {
        return prev.filter(l => l.id !== existing.id);
      } else {
        return [...prev, {
          id: Date.now().toString(),
          mediaId,
          userName: currentUser,
          deviceId: 'guest-device',
          createdAt: new Date().toISOString()
        }];
      }
    });
  };

  const handleStoryViewed = () => {
    // Story viewing logic
  };

  const handleDeleteStory = () => {
    // Story deletion logic (admin only)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">Gallery Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The gallery you're looking for doesn't exist or has been removed.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  if (!gallery) return null;

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-black' : 'bg-white'}`}>
      {/* Custom Header */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 px-4 py-16 text-center">
          {gallery.profileImageUrl && (
            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img 
                src={gallery.profileImageUrl} 
                alt={gallery.coupleNames}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{gallery.title}</h1>
          <p className="text-xl md:text-2xl mb-2">{gallery.coupleNames}</p>
          {gallery.weddingDate && (
            <p className="text-lg opacity-90">{gallery.weddingDate}</p>
          )}
          {gallery.welcomeMessage && (
            <p className="text-lg mt-4 max-w-2xl mx-auto opacity-95">
              {gallery.welcomeMessage}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Live Users Indicator */}
        <div className="mb-6">
          <LiveUserIndicator 
            currentUser={currentUser}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Stories Section */}
        <div className="mb-8">
          <StoriesBar
            stories={stories}
            currentUser={currentUser}
            onAddStory={() => {}}
            onViewStory={setStoryViewerIndex}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Gallery Description */}
        {gallery.description && (
          <div className="mb-8 text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              {gallery.description}
            </p>
          </div>
        )}

        {/* Photo Gallery */}
        <InstagramGallery
          items={mediaItems}
          onItemClick={handleItemClick}
          isAdmin={false}
          comments={comments}
          likes={likes}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onToggleLike={handleToggleLike}
          userName={currentUser}
          isDarkMode={isDarkMode}
        />

        {/* No Content Message */}
        {mediaItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Photos Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The couple is still uploading their beautiful memories. Check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalIndex >= 0 && (
        <MediaModal
          isOpen={modalIndex >= 0}
          items={mediaItems}
          currentIndex={modalIndex}
          onClose={() => setModalIndex(-1)}
          onNext={() => setModalIndex((modalIndex + 1) % mediaItems.length)}
          onPrev={() => setModalIndex((modalIndex - 1 + mediaItems.length) % mediaItems.length)}
          comments={comments}
          likes={likes}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onToggleLike={handleToggleLike}
          userName={currentUser}
          isAdmin={false}
          isDarkMode={isDarkMode}
        />
      )}

      {storyViewerIndex >= 0 && (
        <StoriesViewer
          isOpen={storyViewerIndex >= 0}
          stories={stories}
          initialStoryIndex={storyViewerIndex}
          currentUser={currentUser}
          onClose={() => setStoryViewerIndex(-1)}
          onStoryViewed={handleStoryViewed}
          onDeleteStory={handleDeleteStory}
          isAdmin={false}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-4 right-4 p-3 bg-gray-800 dark:bg-gray-200 text-white dark:text-black rounded-full shadow-lg hover:scale-110 transition-transform z-50"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default GalleryPage;