import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
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

            <Button
              onClick={handleVerifyOTP}
              disabled={isLoading || formData.otp.length !== 4}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white py-3 rounded-full"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}

        {/* Step 3: Complete Profile */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <p className="text-primary/70">
                Let's complete your profile to get started
              </p>
            </div>

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="language">Preferred Language</Label>
              <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your preferred language" />
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

            <Button
              onClick={handleCompleteProfile}
              disabled={isLoading || !formData.name || !formData.language || !formData.country}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white py-3 rounded-full"
            >
              {isLoading ? 'Completing...' : 'Complete Profile'}
            </Button>

            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Welcome to TatvamAI!
              </h3>
              <p className="text-primary/70">
                Your account has been created successfully. You can now start contributing to our voice dataset.
              </p>
            </div>

            <Button
              onClick={handleFinish}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white py-3 rounded-full"
            >
              Get Started
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
