import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Mic, Globe, Users, Award, ChevronRight, Play, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
// import QRContribution from "../components/QRContribution";
// import AuthModal from "../components/AuthModal";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  // const [showQRModal, setShowQRModal] = useState(false);
  // const [showAuthModal, setShowAuthModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice Contribution",
      description: "Contribute your voice in your native language and help build inclusive AI systems.",
      color: "from-[#1e3a8a] to-[#6366f1]"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multilingual Support",
      description: "Support for 100+ languages and dialects, preserving linguistic diversity.",
      color: "from-[#1e3a8a] to-[#6366f1]"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Join thousands of contributors building the future of voice AI together.",
      color: "from-[#1e3a8a] to-[#6366f1]"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Earn Rewards",
      description: "Get rewarded for your contributions with tokens and recognition.",
      color: "from-[#1e3a8a] to-[#6366f1]"
    }
  ];

  return (
    <div className="min-h-screen bg-[#101729] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Voice
              <span className="block text-gradient">Shapes AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join the world's largest voice contribution platform. Help build inclusive AI that understands everyone, in every language.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#1e3a8a] to-[#6366f1] hover:from-[#1e40af] hover:to-[#818cf8] text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate("/qr-recording")}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Contributing
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>

              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate("/qr")}
              >
                <QrCode className="w-5 h-5 mr-2" />
                Scan QR Code
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10M+</div>
                <div className="text-slate-400">Voice Samples</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">100+</div>
                <div className="text-slate-400">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">50K+</div>
                <div className="text-slate-400">Contributors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Contribute to TatvamAI?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Be part of building AI that truly understands and represents everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-8 glass border-0 hover:scale-105 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 mx-auto`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 text-center">{feature.title}</h3>
                <p className="text-slate-300 text-center leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass border-0 p-12">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Your voice matters. Join our community and help build AI that understands everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#1e3a8a] to-[#6366f1] hover:from-[#1e40af] hover:to-[#818cf8] text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate("/qr-recording")}
              >
                Get Started Now
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg rounded-full transition-all duration-300"
                onClick={() => navigate("/about")}
              >
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Modals */}
      {/* 
      <QRContribution 
        isOpen={showQRModal} 
        onClose={() => setShowQRModal(false)} 
      />
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => console.log('Auth successful')}
      /> 
      */}
    </div>
  );
};

export default Index;
