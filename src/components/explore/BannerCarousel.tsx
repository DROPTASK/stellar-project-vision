import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type Banner = {
  id: string;
  title?: string | null;
  type?: string | null;
  image?: string | null;
  project_ids?: string[] | null;
  avg_reward?: string | null;
  claim_link?: string | null;
};

type Project = {
  id: string;
  name: string;
  logo?: string | null;
};

interface BannerCarouselProps {
  type: string; // e.g. 'recent', 'hot'
  projectsMap: Map<string, Project>;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ type, projectsMap }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("type", type)
        .order("created_at", { ascending: false });
      if (!error && data) setBanners(data);
    };
    fetchBanners();
  }, [type]);

  // Auto-slide every 5s
  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 5000);
    return () => clearInterval(t);
  }, [banners]);

  if (!banners.length)
    return (
      <div className="w-full max-w-3xl mx-auto my-5 rounded-2xl overflow-hidden shadow-lg bg-muted flex min-h-[110px] items-center justify-center px-6 py-8">
        <span className="text-center text-sm text-muted-foreground font-medium opacity-80">
          {/* Friendly placeholder, differs for hot/recent */}
          {type === "hot"
            ? "No Hot Banners have been added yet. (Admins can add banners in the admin panel.)"
            : "No Recent Banners have been added yet. (Admins can add banners in the admin panel.)"}
        </span>
      </div>
    );
  const banner = banners[current];

  // Projects for this banner
  const bannerProjects = (banner.project_ids || [])
    .map((id) => projectsMap.get(id))
    .filter(Boolean) as Project[];
    
  return (
    <div className="w-full max-w-3xl mx-auto my-5 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-primary/80 to-blue-400/80 relative min-h-[110px]">
      {banner.image && (
        <img
          src={banner.image}
          alt={banner.title || "Banner"}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          draggable={false}
        />
      )}
      <div className="relative px-6 py-5 flex flex-col sm:flex-row gap-3 items-center backdrop-blur">
        {/* Left: Logos */}
        <div className="flex -space-x-5">
          {bannerProjects.slice(0, 5).map((project) =>
            project?.logo ? (
              <img
                key={project.id}
                src={project.logo}
                alt={project.name}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            ) : (
              <div key={project.id} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-white text-lg font-bold text-primary">
                {project.name?.[0] || "?"}
              </div>
            )
          )}
        </div>
        {/* Center: Text */}
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="font-bold text-lg tracking-wide">{banner.title || (type === "hot" ? "Hot Projects" : type === "recent" ? "Recent Projects" : "Projects")}</div>
          {banner.avg_reward && (
            <div className="text-sm text-slate-700 dark:text-slate-200">
              <span className="font-semibold">Avg Reward: </span>
              {banner.avg_reward}
            </div>
          )}
          {banner.claim_link && (
            <a href={banner.claim_link} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="mt-1 btn-gradient">
                Claim Page <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </a>
          )}
        </div>
        {/* Right: Banner Navigation */}
        {banners.length > 1 ? (
          <div className="flex items-center gap-2 justify-center min-w-[70px]">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
              className="border-primary"
              aria-label="Previous banner"
            >
              <span className="sr-only">Prev</span>
              <svg width={20} height={20} className="rotate-180" viewBox="0 0 24 24"><path d="M10 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrent((c) => (c + 1) % banners.length)}
              className="border-primary"
              aria-label="Next banner"
            >
              <span className="sr-only">Next</span>
              <svg width={20} height={20} viewBox="0 0 24 24"><path d="M10 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BannerCarousel;
