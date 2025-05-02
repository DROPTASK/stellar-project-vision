
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppStore } from '../../store/appStore';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Share, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '../../hooks/use-mobile';
import { formatCompactNumber } from '../../lib/utils';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose }) => {
  const { projects } = useAppStore();
  const imageRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const handleDownload = async () => {
    if (imageRef.current) {
      try {
        const dataUrl = await toPng(imageRef.current, { 
          quality: 0.95,
          height: imageRef.current.scrollHeight,
          width: imageRef.current.scrollWidth,
          canvasHeight: imageRef.current.scrollHeight,
          canvasWidth: imageRef.current.scrollWidth,
          pixelRatio: 2,
          cacheBust: true, // Prevents caching issues
          skipAutoScale: true, // Prevents automatic scaling which can cause issues
          style: {
            // Force background colors to render properly
            backgroundColor: 'transparent',
          }
        });
        
        // Create an anchor element and trigger download
        const link = document.createElement('a');
        link.download = 'my-crypto-projects.png';
        link.href = dataUrl;
        document.body.appendChild(link); // Needed for Firefox
        link.click();
        document.body.removeChild(link);
        
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
          pixelRatio: 2,
          cacheBust: true,
          skipAutoScale: true,
          style: {
            backgroundColor: 'transparent',
          }
        });
        
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'my-crypto-projects.png', { type: 'image/png' });
        
        if (navigator.share) {
          await navigator.share({
            files: [file],
            title: 'My Crypto Projects',
            text: 'Hey! Have a look on my projects and to generate your same join @DropDeck1_bot!!'
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

  // Group projects into rows of 3 for consistent display
  const projectRows = [];
  for (let i = 0; i < projects.length; i += 3) {
    projectRows.push(projects.slice(i, i + 3));
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-accent/50 max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Share My Projects</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 flex flex-col items-center">
          <div 
            ref={imageRef} 
            className="w-full p-4 bg-gradient-to-b from-indigo-900 to-purple-900 rounded-lg max-h-[70vh] overflow-y-auto"
          >
            <h2 className="text-xl font-display text-white text-center mb-4">My Projects</h2>
            
            {projects.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {projects.map(project => (
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
                    {project.stats && project.stats.length > 0 && (
                      <div className="mt-1 flex flex-wrap justify-center gap-1">
                        {project.stats.map((stat, index) => (
                          <div key={index} className="text-xs text-white/90">
                            {formatCompactNumber(stat.amount)} {stat.type}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white text-center">No projects added yet</p>
            )}
            
            <div className="text-white text-xs text-center mt-4">
              Hey! Have a look on my projects and to generate your same join @DropDeck1_bot!!
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
