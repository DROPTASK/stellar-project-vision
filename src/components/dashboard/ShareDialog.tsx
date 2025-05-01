
import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppStore } from '../../store/appStore';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Share, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '../../hooks/use-mobile';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose }) => {
  const { projects } = useAppStore();
  const imageRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9; // 3 columns × 3 rows
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const isMobile = useIsMobile();
  
  const paginatedProjects = projects.slice(
    (currentPage - 1) * projectsPerPage, 
    currentPage * projectsPerPage
  );

  useEffect(() => {
    // Reset to page 1 when dialog opens
    if (isOpen) {
      setCurrentPage(1);
    }
  }, [isOpen]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(p => p + 1);
    }
  };
  
  const handleDownload = async () => {
    if (imageRef.current) {
      try {
        const dataUrl = await toPng(imageRef.current, { 
          quality: 0.95,
          height: imageRef.current.scrollHeight,
          width: imageRef.current.scrollWidth,
          canvasHeight: imageRef.current.scrollHeight,
          canvasWidth: imageRef.current.scrollWidth,
          pixelRatio: 2
        });
        const link = document.createElement('a');
        link.download = 'my-crypto-projects.png';
        link.href = dataUrl;
        link.click();
        toast.success('Image downloaded successfully');
      } catch (error) {
        console.error('Error generating image:', error);
        toast.error('Failed to generate image');
      }
    }
  };
  
  const handleShare = async () => {
    if (imageRef.current) {
      try {
        const dataUrl = await toPng(imageRef.current, { 
          quality: 0.95,
          height: imageRef.current.scrollHeight,
          width: imageRef.current.scrollWidth,
          canvasHeight: imageRef.current.scrollHeight,
          canvasWidth: imageRef.current.scrollWidth,
          pixelRatio: 2
        });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'my-crypto-projects.png', { type: 'image/png' });
        
        if (navigator.share) {
          await navigator.share({
            files: [file],
            title: 'My Crypto Projects',
            text: 'Generated using @dropdeck1_bot in Telegram'
          });
        } else {
          toast.error('Sharing not supported on this browser');
          // Fallback to download
          handleDownload();
        }
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error('Failed to share image');
      }
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-accent/50 max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Share My Projects</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 flex flex-col items-center">
          <div 
            ref={imageRef} 
            className="w-full p-4 bg-gradient-to-b from-indigo-900 to-purple-900 rounded-lg"
          >
            <h2 className="text-xl font-display text-white text-center mb-4">My Projects</h2>
            
            {projects.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {paginatedProjects.map(project => (
                    <div key={project.id} className="bg-black/30 backdrop-blur-sm p-3 rounded-lg flex flex-col items-center">
                      <div className="w-full aspect-square mb-2 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
                        {project.logo ? (
                          <img 
                            src={project.logo} 
                            alt={`${project.name} logo`}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-indigo-700">
                            {project.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium text-white text-sm text-center truncate w-full">{project.name}</h3>
                    </div>
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4 text-white">
                    <button 
                      onClick={handlePreviousPage} 
                      disabled={currentPage === 1}
                      className={`flex items-center ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button 
                      onClick={handleNextPage} 
                      disabled={currentPage === totalPages}
                      className={`flex items-center ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-white text-center">No projects added yet</p>
            )}
            
            <div className="text-white text-xs text-center mt-4">
              Generated using @dropdeck1_bot in Telegram
            </div>
          </div>
          
          <div className="flex gap-3 mt-4 w-full">
            <Button onClick={handleDownload} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={handleShare} className="flex-1 btn-gradient">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
