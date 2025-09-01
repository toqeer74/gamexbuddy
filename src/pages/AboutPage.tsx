import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Rocket, Lightbulb, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  return (
    <div className="container py-16 min-h-[calc(100vh-14rem)]"> {/* Adjusted min-height to account for Navbar and Footer */}
      <h1 className="text-5xl font-extrabold text-center mb-12 text-primary drop-shadow-lg">
        About GamexBuddy
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg
                       hover:shadow-purple-500/70 hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.9)] transition-all duration-300">
          <CardHeader className="flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-purple-400 mb-4 neon-glow" />
            <CardTitle className="text-2xl font-bold">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-300">
            To create the ultimate community hub for gamers, providing the latest news, tools, and a vibrant space for discussion and connection.
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg
                       hover:shadow-pink-500/70 hover:drop-shadow-[0_0_20px_rgba(236,72,153,0.9)] transition-all duration-300">
          <CardHeader className="flex flex-col items-center text-center">
            <Rocket className="h-12 w-12 text-pink-400 mb-4 neon-glow" />
            <CardTitle className="text-2xl font-bold">Our Vision</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-300">
            To be the go-to platform for all things gaming, fostering a passionate and engaging environment for players worldwide.
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg
                       hover:shadow-cyan-500/70 hover:drop-shadow-[0_0_20px_rgba(0,255,255,0.9)] transition-all duration-300">
          <CardHeader className="flex flex-col items-center text-center">
            <Lightbulb className="h-12 w-12 text-cyan-400 mb-4 neon-glow" />
            <CardTitle className="text-2xl font-bold">Our Values</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-300">
            Community, Innovation, Passion, and Inclusivity. We believe gaming is for everyone.
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-6 text-primary drop-shadow-lg">Meet the Team</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          GamexBuddy is built by a dedicated team of gamers and developers passionate about creating the best possible experience for you.
        </p>
        <div className="flex justify-center gap-8 flex-wrap">
          {/* Placeholder Team Member 1 */}
          <div className="flex flex-col items-center">
            <img
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=Buddy&flip=true"
              alt="Team Member Buddy"
              className="w-24 h-24 rounded-full object-cover border-4 border-purple-500 shadow-lg mb-2"
            />
            <p className="font-semibold text-white">Buddy</p>
            <p className="text-sm text-gray-400">Founder & Lead Dev</p>
          </div>
          {/* Placeholder Team Member 2 */}
          <div className="flex flex-col items-center">
            <img
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=Gamer&flip=true"
              alt="Team Member Gamer"
              className="w-24 h-24 rounded-full object-cover border-4 border-pink-500 shadow-lg mb-2"
            />
            <p className="font-semibold text-white">Gamer</p>
            <p className="text-sm text-gray-400">Community Manager</p>
          </div>
        </div>
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

export default AboutPage;