import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { GalleryImage } from '@shared/schema';

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  const { data: galleryImages, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-[var(--pink-dark)] mb-4">Our Cake Gallery</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse through our collection of beautiful cakes created with love for our wonderful customers.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--pink-dark)]" />
        </div>
      ) : galleryImages && galleryImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryImages.map((image) => (
            <div 
              key={image.id} 
              className="overflow-hidden rounded-lg shadow-md cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative h-60 bg-gray-100">
                <img 
                  src={image.imageUrl} 
                  alt={image.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {image.featured && (
                  <div className="absolute top-2 right-2 bg-[var(--pink-dark)] text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-4 bg-white">
                <h3 className="text-lg font-medium text-gray-900">{image.title}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-xl font-medium text-gray-900">No images yet</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Our gallery is currently being updated. Please check back soon for beautiful cake photos!
          </p>
        </div>
      )}
      
      {/* Image Detail Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          {selectedImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative rounded-lg overflow-hidden h-72 md:h-auto">
                <img 
                  src={selectedImage.imageUrl} 
                  alt={selectedImage.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[var(--pink-dark)] mb-2">{selectedImage.title}</h2>
                <p className="text-gray-700 mb-4">{selectedImage.description}</p>
                <div className="mt-auto pt-4 border-t">
                  <a 
                    href="https://wa.me/1234567890?text=Hello,%20I'd%20like%20to%20order%20a%20cake%20like%20the%20one%20I%20saw%20in%20your%20gallery!" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-[var(--pink-dark)] text-white rounded-md hover:bg-[var(--pink)] transition-colors"
                  >
                    Order a cake like this
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}