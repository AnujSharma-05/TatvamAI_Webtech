import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Mic, Clock, Shield, FileText, CheckCircle, X } from "lucide-react";

interface QRContributionProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRContribution = ({ isOpen, onClose }: QRContributionProps) => {
  const [step, setStep] = useState(1);
  const [consent, setConsent] = useState({
    dataUsage: false,
    recording: false,
    terms: false
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && recordingTime < 120) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (recordingTime >= 120) {
      stopRecording();
    }
    return () => clearInterval(interval);
  }, [isRecording, recordingTime]);

  const handleConsentChange = (key: keyof typeof consent, value: boolean) => {
    setConsent(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = Object.values(consent).every(Boolean);

  const startRecording = async () => {
    setIsRecording(true);
    setRecordingTime(0);
    setStep(3);
    setAudioBlob(null);
    setAudioUrl(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks: Blob[] = [];
      setAudioChunks(chunks);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
    } catch (err) {
      alert("Microphone access denied or not available.");
      setIsRecording(false);
      setStep(1);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Don't set isComplete here - let the audio processing happen first
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetFlow = () => {
    setStep(1);
    setConsent({ dataUsage: false, recording: false, terms: false });
    setIsRecording(false);
    setRecordingTime(0);
    setIsComplete(false);
    setAudioBlob(null);
    setAudioUrl(null);
    setMediaRecorder(null);
    setAudioChunks([]);
  };

  const handleClose = () => {
    // Clean up audio URL to prevent memory leaks
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    resetFlow();
    onClose();
  };

  const handleUpload = async () => {
    if (!audioBlob) return;
    
    // Placeholder: Replace with your API call to upload audioBlob
    // Example:
    // const formData = new FormData();
    // formData.append('audio', audioBlob, `recording-${Date.now()}.wav`);
    // await fetch('/api/your-upload-endpoint', { method: 'POST', body: formData });
    
    alert("Upload API call goes here!");
    setIsComplete(true);
  };

  const handleRecordAgain = () => {
    // Clean up current audio
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsRecording(false);
    setMediaRecorder(null);
    setAudioChunks([]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [mediaRecorder, audioUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center">
            <Mic className="w-6 h-6 mr-2" />
            Voice Contribution
          </DialogTitle>
          <DialogDescription>
            Help improve AI by contributing your voice in just 2 minutes
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-6 glass border-0">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">Welcome to TatvamAI</h3>
                <p className="text-primary/70 mb-6">
                  Your voice contribution will help build more inclusive AI systems that understand diverse languages and accents.
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-primary/60">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    2 minutes
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Secure & Private
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => setStep(2)}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white px-8 py-3 rounded-full"
              >
                Continue
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Consent */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-6 glass border-0">
              <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Consent & Privacy
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    checked={consent.dataUsage}
                    onCheckedChange={(checked) => handleConsentChange('dataUsage', checked as boolean)}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <p className="text-primary font-medium">Data Usage Consent</p>
                    <p className="text-primary/70">
                      I consent to my voice data being used to improve AI systems. My data will be anonymized and used responsibly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox 
                    checked={consent.recording}
                    onCheckedChange={(checked) => handleConsentChange('recording', checked as boolean)}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <p className="text-primary font-medium">Recording Permission</p>
                    <p className="text-primary/70">
                      I give permission to record my voice for a maximum of 2 minutes for this contribution.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox 
                    checked={consent.terms}
                    onCheckedChange={(checked) => handleConsentChange('terms', checked as boolean)}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <p className="text-primary font-medium">Terms & Conditions</p>
                    <p className="text-primary/70">
                      I agree to the Terms of Service and Privacy Policy for voice contributions.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button 
                onClick={startRecording}
                disabled={!canProceed}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white px-8 py-3 rounded-full disabled:opacity-50"
              >
                Start Recording
              </Button>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Recording */}
        {step === 3 && !isComplete && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-8 glass border-0 text-center">
              <div className="relative">
                <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  isRecording ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' : 'bg-gradient-to-r from-primary to-accent'
                }`}>
                  <Mic className="w-12 h-12 text-white" />
                </div>
                {isRecording && (
                  <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-ping"></div>
                )}
              </div>

              <h3 className="text-2xl font-bold text-primary mb-2">
                {isRecording ? 'Recording...' : audioBlob ? 'Recording Complete' : 'Ready to Record'}
              </h3>
              <p className="text-lg text-primary/70 mb-6">
                {isRecording ? 'Speak clearly into your microphone' : audioBlob ? 'Review your recording below' : 'Click start to begin recording'}
              </p>
              <div className="text-4xl font-mono font-bold text-primary mb-6">
                {formatTime(recordingTime)} / 2:00
              </div>
              <div className="w-full bg-primary/20 rounded-full h-2 mb-6">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(recordingTime / 120) * 100}%` }}
                ></div>
              </div>

              {/* Recording Controls */}
              {!isRecording && !audioBlob && (
                <Button
                  onClick={startRecording}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-full"
                >
                  Start Recording
                </Button>
              )}

              {isRecording && (
                <Button
                  onClick={stopRecording}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50 px-8 py-3 rounded-full"
                >
                  Stop Recording
                </Button>
              )}

              {/* After Recording: Audio Player, Upload, Record Again */}
              {!isRecording && audioBlob && audioUrl && (
                <div className="space-y-4 mt-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <audio controls src={audioUrl} className="w-full">
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleUpload}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white px-8 py-3 rounded-full"
                    >
                      Upload Recording
                    </Button>
                    <Button
                      onClick={handleRecordAgain}
                      variant="outline"
                      className="px-8 py-3 rounded-full"
                    >
                      Record Again
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Step 4: Complete */}
        {isComplete && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-8 glass border-0 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-primary mb-3">
                Thank You!
              </h3>
              
              <p className="text-lg text-primary/70 mb-6">
                Your voice contribution has been successfully recorded and will help improve AI for everyone.
              </p>

              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-green-700 font-medium">
                  🎉 You've earned 10 contribution points!
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handleClose}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white px-8 py-3 rounded-full"
                >
                  Complete
                </Button>
                <Button
                  onClick={resetFlow}
                  variant="outline"
                  className="px-8 py-3 rounded-full"
                >
                  Contribute Again
                </Button>
              </div>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRContribution;