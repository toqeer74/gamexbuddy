import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Rocket, Lightbulb } from "lucide-react";

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
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          GamexBuddy is built by a dedicated team of gamers and developers passionate about creating the best possible experience for you. More details about our team members coming soon!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;