import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { Mic, Clock, Shield, FileText, CheckCircle, X, Play, Pause, Square, RotateCcw } from "lucide-react";

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
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused && recordingTime < 120) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (recordingTime >= 120) {
      stopRecording();
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused, recordingTime]);

  const handleConsentChange = (key: keyof typeof consent, value: boolean) => {
    setConsent(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = Object.values(consent).every(Boolean);

  const startRecording = async () => {
    try {
      // Request microphone permission with better error handling
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });
      
      setStream(mediaStream);
      
      // Check for supported MIME types
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = ''; // Let browser choose
          }
        }
      }
      
      const options = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(mediaStream, options);
      setMediaRecorder(recorder);
      
      const chunks: Blob[] = [];
      setAudioChunks(chunks);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          setAudioChunks([...chunks, event.data]);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType || 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setStep(4); // Move to review step
        
        // Log for debugging
        console.log('Recording stopped:', {
          size: blob.size,
          type: blob.type,
          duration: recordingTime
        });
      };

      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        alert('Recording error occurred. Please try again.');
      };

      // Start recording with timeslice for better data handling
      recorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setStep(3);
      setAudioBlob(null);
      setAudioUrl(null);
      
      console.log('Recording started with MIME type:', mimeType || 'default');
      
    } catch (err) {
      console.error('Microphone access error:', err);
      
      let errorMessage = "Unable to access microphone. ";
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage += "Please allow microphone access and try again.";
        } else if (err.name === 'NotFoundError') {
          errorMessage += "No microphone found. Please connect a microphone.";
        } else if (err.name === 'NotSupportedError') {
          errorMessage += "Recording not supported in this browser.";
        } else {
          errorMessage += err.message;
        }
      }
      
      alert(errorMessage);
      setStep(2);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsRecording(false);
    setIsPaused(false);
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
    setIsPaused(false);
    setRecordingTime(0);
    setIsComplete(false);
    setAudioBlob(null);
    setAudioUrl(null);
    setMediaRecorder(null);
    setAudioChunks([]);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleClose = () => {
    // Clean up audio URL to prevent memory leaks
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    // Stop any active recording
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    resetFlow();
    onClose();
  };

  const handleUpload = async () => {
    if (!audioBlob) return;
    
    // Placeholder: Replace with your API call to upload audioBlob
    // Example:
    // const formData = new FormData();
    // formData.append('audio', audioBlob, `recording-${Date.now()}.webm`);
    // await fetch('/api/your-upload-endpoint', { method: 'POST', body: formData });
    
    alert("Upload API call goes here!");
    setStep(5);
  };

  const handleRecordAgain = () => {
    // Clean up current audio and stream
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
    setMediaRecorder(null);
    setAudioChunks([]);
    setStep(2); // Go back to consent step
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [mediaRecorder, stream, audioUrl]);

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
            </div>
          </div>
        )}

        {/* Step 2: Consent */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Privacy & Consent</h3>
              <p className="text-primary/70">
                Please review and accept our terms before proceeding
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="dataUsage"
                  checked={consent.dataUsage}
                  onCheckedChange={(checked) => handleConsentChange('dataUsage', checked as boolean)}
                />
                <label htmlFor="dataUsage" className="text-sm text-primary/80 leading-relaxed">
                  I consent to the use of my voice data for improving AI speech recognition systems
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="recording"
                  checked={consent.recording}
                  onCheckedChange={(checked) => handleConsentChange('recording', checked as boolean)}
                />
                <label htmlFor="recording" className="text-sm text-primary/80 leading-relaxed">
                  I understand that my voice will be recorded and stored securely
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={consent.terms}
                  onCheckedChange={(checked) => handleConsentChange('terms', checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-primary/80 leading-relaxed">
                  I agree to the <a href="/terms" className="text-accent hover:underline">Terms of Service</a> and <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>
                </label>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-full"
              >
                Back
              </Button>
              <Button
                onClick={startRecording}
                disabled={!canProceed}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white px-8 py-3 rounded-full"
              >
                Start Recording
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Recording */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isPaused 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                : 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse'
            }`}>
              <Mic className="w-12 h-12 text-white" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                {isPaused ? 'Recording Paused' : 'Recording in Progress'}
              </h3>
              <p className="text-4xl font-mono text-accent mb-4">
                {formatTime(recordingTime)}
              </p>
              <p className="text-primary/70">
                {isPaused 
                  ? 'Recording is paused. You can resume or stop the recording.'
                  : 'Please speak clearly and naturally. You can pause or stop anytime.'
                }
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              {!isPaused ? (
                <Button
                  onClick={pauseRecording}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full flex items-center space-x-2"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </Button>
              ) : (
                <Button
                  onClick={resumeRecording}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </Button>
              )}
              
              <Button
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full flex items-center space-x-2"
              >
                <Square className="w-4 h-4" />
                <span>Stop</span>
              </Button>
            </div>

            <div className="text-sm text-primary/60">
              <p>Maximum recording time: 2 minutes</p>
              <p>Recording will automatically stop when time is up</p>
              {isPaused && <p className="text-yellow-600 font-medium">Timer is paused</p>}
            </div>
          </div>
        )}

        {/* Step 4: Review & Upload */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Recording Complete!
              </h3>
              <p className="text-primary/70">
                Review your recording and choose what to do next
              </p>
            </div>

            {audioUrl && (
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-medium text-primary">Your Recording</span>
                  </div>
                  <span className="text-sm text-primary/60 bg-white px-2 py-1 rounded-full">
                    {formatTime(recordingTime)}
                  </span>
                </div>
                
                <audio controls className="w-full mb-4" src={audioUrl}>
                  Your browser does not support the audio element.
                </audio>
                
                <p className="text-sm text-primary/70 text-center">
                  🎧 Listen to your recording above to review the quality
                </p>
              </Card>
            )}

            <div className="flex justify-center space-x-4 flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleRecordAgain}
                className="px-6 py-3 rounded-full flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Record Again</span>
              </Button>
              <Button
                onClick={handleUpload}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white px-8 py-3 rounded-full flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Submit Recording</span>
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">Thank You!</h3>
              <p className="text-primary/70">
                Your voice contribution has been successfully uploaded. You're helping make AI more inclusive for everyone.
              </p>
            </div>

            <Card className="p-4 glass border-0 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center justify-between">
                <span className="text-primary/70">Contribution Points</span>
                <span className="font-bold text-accent text-xl">+10 Points</span>
              </div>
            </Card>

            <Button
              onClick={handleClose}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white px-8 py-3 rounded-full"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRContribution;