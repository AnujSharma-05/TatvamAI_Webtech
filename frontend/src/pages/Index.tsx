import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Mic, Globe, Users, Award, ChevronRight, Play, QrCode } from "lucide-react";

const COLORS = {
  lightYellow: "#ffffe3",
  midnightGreen: "#003642",
  teaGreen: "#d0e6a5",
  nyanza: "#f1ffe3",
  cadetGray: "#83a0a0",
};

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    { icon: <Mic />, title: "Voice Contribution", description: "Contribute your voice in your native language." },
    { icon: <Globe />, title: "Multilingual Support", description: "Support for 100+ languages and dialects." },
    { icon: <Users />, title: "Community Driven", description: "Join thousands of contributors building the future." },
    { icon: <Award />, title: "Earn Rewards", description: "Get rewarded for your valuable contributions." },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: COLORS.midnightGreen, color: COLORS.nyanza }}>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen text-center px-6 pt-24 pb-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-teal-900 to-transparent opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-tl from-yellow-900 to-transparent opacity-10"></div>
        </div>

        <div className={`relative z-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight" style={{ color: COLORS.nyanza }}>
            Your Voice <span style={{ color: COLORS.teaGreen }}>Shapes AI</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto" style={{ color: COLORS.cadetGray }}>
            Join the world's largest voice contribution platform. Help build inclusive AI that understands everyone, in every language.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{ background: COLORS.teaGreen, color: COLORS.midnightGreen, border: "none" }}
              onClick={() => navigate("/qr-recording")}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Contributing
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              style={{ borderColor: COLORS.cadetGray, color: COLORS.cadetGray, background: "transparent" }}
              onClick={() => navigate("/qr")}
            >
              <QrCode className="w-5 h-5 mr-2" />
              Scan QR Code
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-opacity-5" style={{ backgroundColor: "rgba(0,0,0,0.2)"}}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <p className="text-5xl font-bold" style={{ color: COLORS.teaGreen }}>10M+</p>
              <p className="text-lg mt-2" style={{ color: COLORS.cadetGray }}>Voice Samples</p>
            </div>
            <div className="p-4">
              <p className="text-5xl font-bold" style={{ color: COLORS.teaGreen }}>100+</p>
              <p className="text-lg mt-2" style={{ color: COLORS.cadetGray }}>Languages</p>
            </div>
            <div className="p-4">
              <p className="text-5xl font-bold" style={{ color: COLORS.teaGreen }}>50K+</p>
              <p className="text-lg mt-2" style={{ color: COLORS.cadetGray }}>Contributors</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works / Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.nyanza }}>
              Why Contribute to TatvamAI?
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: COLORS.cadetGray }}>
              Be part of building AI that truly understands and represents everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-2xl hover:bg-white hover:bg-opacity-10 transition-all duration-300 transform hover:-translate-y-2">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto transition-all duration-300"
                  style={{ background: COLORS.teaGreen, color: COLORS.midnightGreen }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.nyanza }}>
                  {feature.title}
                </h3>
                <p style={{ color: COLORS.cadetGray }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card
            className="border-0 p-10 md:p-16 rounded-3xl"
            style={{
              background: `linear-gradient(135deg, ${COLORS.teaGreen} -20%, ${COLORS.midnightGreen} 50%)`,
              boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
            }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: COLORS.nyanza }}>
              Ready to Make a Difference?
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: COLORS.cadetGray }}>
              Your voice matters. Join our community and help build the future of AI.
            </p>
            <Button
              size="lg"
              className="px-10 py-6 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{
                background: COLORS.nyanza,
                color: COLORS.midnightGreen,
                border: "none",
              }}
              onClick={() => navigate("/qr-recording")}
            >
              Get Started Now
              <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;