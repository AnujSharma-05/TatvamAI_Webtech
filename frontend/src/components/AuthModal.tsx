
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Mail, Globe, User, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    name: '',
    language: '',
    country: '',
    otp: ''
  });

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'bn', label: 'Bengali' },
    { value: 'te', label: 'Telugu' },
    { value: 'mr', label: 'Marathi' },
    { value: 'ta', label: 'Tamil' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'pa', label: 'Punjabi' },
    { value: 'or', label: 'Odia' },
    { value: 'as', label: 'Assamese' }
  ];

  const countries = [
    { value: 'in', label: 'India' },
    { value: 'us', label: 'United States' },
    { value: 'gb', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' }
  ];

  const handleSendOTP = async () => {
    setIsLoading(true);
    
    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setStep(2);
    toast.success(`OTP sent to your ${authMethod === 'phone' ? 'phone' : 'email'}`);
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (formData.otp === '1234') {
      setStep(3);
      toast.success('OTP verified successfully!');
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleCompleteProfile = async () => {
    setIsLoading(true);
    
    // Simulate profile completion
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setStep(4);
    toast.success('Profile completed successfully!');
  };

  const handleFinish = () => {
    onSuccess();
    onClose();
    // Reset form
    setStep(1);
    setFormData({
      phone: '',
      email: '',
      name: '',
      language: '',
      country: '',
      otp: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">
            {step === 1 ? 'Welcome to TatvamAI' : 
             step === 2 ? 'Verify Your Account' :
             step === 3 ? 'Complete Your Profile' :
             'You\'re All Set!'}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Auth Method */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as 'phone' | 'email')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="phone" className="flex items-center">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Phone
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="phone" className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleSendOTP}
              disabled={isLoading || (!formData.phone && !formData.email)}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white py-3 rounded-full"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <p className="text-primary/70">
                Enter the 4-digit OTP sent to your {authMethod === 'phone' ? 'phone' : 'email'}
              </p>
            </div>

            <div>
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="1234"
                value={formData.otp}
                onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value }))}
                className="mt-1 text-center text-2xl font-mono"
                maxLength={4}
              />
              <p className="text-xs text-primary/60 mt-1">
                Tip: Use "1234" for demo
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading || formData.otp.length !== 4}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white py-3 rounded-full"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-full"
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Profile Completion */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <p className="text-primary/70">
                Complete your profile to get started
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="language">Preferred Language</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleCompleteProfile}
              disabled={isLoading || !formData.name || !formData.language || !formData.country}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white py-3 rounded-full"
            >
              {isLoading ? 'Saving...' : 'Complete Profile'}
            </Button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-success to-success-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">Welcome aboard!</h3>
              <p className="text-primary/70">
                Your account has been created successfully. You can now start contributing your voice to help build better AI.
              </p>
            </div>

            <Card className="p-4 glass border-0">
              <div className="flex items-center justify-between">
                <span className="text-primary/70">Welcome Bonus</span>
                <span className="font-bold text-accent">+25 Points</span>
              </div>
            </Card>

            <Button
              onClick={handleFinish}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white py-3 rounded-full"
            >
              Start Contributing
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
