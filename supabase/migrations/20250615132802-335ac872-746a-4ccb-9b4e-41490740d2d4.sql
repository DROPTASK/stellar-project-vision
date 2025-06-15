
-- Table for home banners with claim link, project references, type (recent/hot)
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  type TEXT, -- e.g., 'recent', 'hot'
  image TEXT,     -- could be banner background or a big logo
  project_ids UUID[], -- array of project IDs featured on this banner
  avg_reward TEXT,
  claim_link TEXT,  -- claim page/link (optional for admin or anyone to set)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- No RLS for now (public feature); you may choose to add policy later.

