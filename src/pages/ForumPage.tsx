import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { supabase } from "@/lib/supabaseClient";
import CommentList from "@/components/community/CommentList";

type ForumPost = {
  id: string;
  title: string;
  body: string;
  author_id: string;
  created_at: string;
  replies_count: number;
};

const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          id,
          title,
          body,
          author_id,
          created_at,
          forum_replies(count)
        `)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setPosts(data.map((p: any) => ({ ...p, replies_count: p.forum_replies?.length || 0 })));
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="wrap" style={{padding:20}}>Loading forums...</div>;

  return (
    <>
      <Helmet>
        <title>Gaming Community Forums | GameXBuddy</title>
        <link rel="canonical" href={canonical("/forum")} />
        <meta name="description" content="Join the ultimate gaming community forums. Discuss GTA 6, share tips, and connect with fellow gamers." />
      </Helmet>
      <div className="wrap" style={{ padding: 20 }}>
        <h1 className="h1">Community Forums</h1>
        <p className="text-muted-foreground mb-8">
          Discuss gaming topics, share strategies, and connect with other players.
        </p>
        <div className="space-y-4">
          {/* Placeholder for forums - integrate with Supabase tables for posts and replies */}
          <div className="card-glass" style={{ padding: 16 }}>
            <h2 className="h3">GTA 6 Discussions</h2>
            <div className="mt-4 space-y-2">
              <div className="p-4 bg-white/5 rounded">
                <h3 className="font-semibold">Welcome to GTA 6 Forum</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Share your thoughts on GTA 6 release, characters, and predictions.
                </p>
                <div className="flex gap-4 mt-2 text-xs">
                  <span>Posts: 42</span>
                  <span>Last post: 2 hours ago</span>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded">
                <h3 className="font-semibold">Cheats and Tips</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Post your GTA 6 cheats, secrets, and pro tips.
                </p>
                <div className="flex gap-4 mt-2 text-xs">
                  <span>Posts: 28</span>
                  <span>Last post: 5 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForumPage;