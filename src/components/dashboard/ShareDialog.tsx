
import React, { useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppStore } from '../../store/appStore';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Share, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose }) => {
  const { projects } = useAppStore();
  const imageRef = useRef<HTMLDivElement>(null);
  
  const handleDownload = async () => {
    if (imageRef.current) {
      try {
        const dataUrl = await toPng(imageRef.current, { quality: 0.95 });
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
        const dataUrl = await toPng(imageRef.current, { quality: 0.95 });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'my-crypto-projects.png', { type: 'image/png' });
        
        if (navigator.share) {
          await navigator.share({
            files: [file],
            title: 'My Crypto Projects',
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
      <DialogContent className="glass-card border-accent/50 max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">Share My Projects</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 flex flex-col items-center">
          <div 
            ref={imageRef} 
            className="w-full max-h-[70vh] overflow-y-auto p-4 bg-gradient-to-b from-indigo-900 to-purple-900 rounded-lg"
          >
            <h2 className="text-xl font-display text-white text-center mb-4">My Projects</h2>
            
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.map(project => (
                  <div key={project.id} className="bg-black/30 backdrop-blur-sm p-3 rounded-lg flex justify-between">
                    <div>
                      <h3 className="font-medium text-white">{project.name}</h3>
                      <div className="grid grid-cols-3 gap-1 mt-1">
                        <div className="text-left">
                          <p className="text-xs text-gray-300">Invested</p>
                          <p className="text-sm text-white">${project.investedAmount?.toLocaleString() || 0}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-gray-300">Expected</p>
                          <p className="text-sm text-white">${project.expectedAmount?.toLocaleString() || 0}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-gray-300">Earned</p>
                          <p className="text-sm text-white">${project.earnedAmount?.toLocaleString() || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white text-center">No projects added yet</p>
            )}
          </div>
          
          <div className="flex gap-3 mt-4">
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
