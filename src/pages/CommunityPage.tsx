import React from "react";
import CommunityContentCard from "@/components/common/CommunityContentCard";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const CommunityPage = () => {
  // Placeholder data for community content
  const communityContent = [
    {
      id: "meme1",
      title: "When the new patch drops...",
      description: "My face when the devs nerf my favorite character again. Share your pain!",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38148e7fd?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "#",
      type: "meme" as const,
      xp: 120,
      isTrending: true,
      authorName: "MemeLord42",
      authorAvatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=MemeLord42",
    },
    {
      id: "discussion1",
      title: "What's your most anticipated game of 2025?",
      description: "Let's discuss the upcoming titles! Any dark horses?",
      imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "#",
      type: "discussion" as const,
      xp: 85,
      isTrending: false,
      authorName: "GameTalker",
      authorAvatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=GameTalker",
    },
    {
      id: "quiz1",
      title: "How well do you know GTA lore?",
      description: "Take our ultimate quiz and prove your knowledge of the Grand Theft Auto universe!",
      imageUrl: "https://images.unsplash.com/photo-1612287235008-377e72169f46?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "#",
      type: "quiz" as const,
      xp: 200,
      isTrending: true,
      authorName: "QuizMaster",
      authorAvatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=QuizMaster",
    },
  ];

  return (
    <div className="container py-8 min-h-[calc(100vh-14rem)]">
      <h1 className="text-4xl font-bold mb-6 text-center neon-text-glow">Community Hub</h1>
      <p className="text-lg text-center text-muted-foreground mb-12">
        Connect with fellow gamers, share memes, and join discussions!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {communityContent.map((item) => (
          <CommunityContentCard
            key={item.id}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            link={item.link}
            type={item.type}
            xp={item.xp}
            isTrending={item.isTrending}
            authorAvatarUrl={item.authorAvatarUrl}
            authorName={item.authorName}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button variant="outline" className="px-8 py-3 rounded-full bg-white/20 text-white border-white/30 backdrop-blur-sm
                       hover:bg-primary hover:text-primary-foreground
                       hover:border-primary transition-all duration-300">
          View More Community Content
        </Button>
      </div>

      <div className="mt-16 text-center">
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
          <Button className="px-8 py-3 rounded-full bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition transform hover:scale-105 flex items-center gap-2
                             drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]">
            <MessageSquare className="h-5 w-5" /> Join our Discord
          </Button>
        </a>
      </div>
    </div>
  );
};

export default CommunityPage;