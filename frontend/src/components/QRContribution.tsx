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
      <DialogContent className="w-[95vw] max-w-[400px] sm:max-w-md md:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6 mx-auto">

        {/* Steps Progression Line - Enhanced Mobile Responsiveness */}
        <div className="flex items-center justify-center mb-4 sm:mb-6 px-2">
          <div className="flex items-center justify-between w-full max-w-[280px] sm:max-w-[400px]">
            {[1,2,3,4,5].map((s, idx) => (
              <div key={s} className="flex items-center">
                <div
                  className={`
                    w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 
                    rounded-full flex items-center justify-center
                    text-xs sm:text-sm font-semibold
                    ${step === s 
                      ? 'bg-accent text-white shadow-lg scale-110' 
                      : step > s 
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-200 text-primary/60'
                    }
                    transition-all duration-300 ease-in-out
                  `}
                >
                  {step > s ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : s}
                </div>
                {idx < 4 && (
                  <div 
                    className={`
                      h-[2px] flex-1 mx-1 sm:mx-2 rounded-full transition-colors duration-300
                      ${step > s ? 'bg-green-500' : 'bg-slate-300'}
                    `} 
                    style={{ 
                      width: 'clamp(20px, 5vw, 40px)' 
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <Card className="p-4 sm:p-6 border-0 bg-gradient-to-r from-primary to-accent w-full mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Mic className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary mb-2 sm:mb-3">Welcome to TatvamAI</h3>
                <p className="text-primary/70 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base leading-relaxed px-2">
                  Your voice contribution will help build more inclusive AI systems that understand diverse languages and accents.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-primary/60">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    2 minutes
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Secure & Private
                  </div>
                </div>
              </div>
            </Card>

            <div className="px-4 sm:px-0">
              <Button 
                onClick={() => setStep(2)}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full w-full sm:w-auto font-medium"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Consent */}
        {step === 2 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary mb-2 sm:mb-3">Privacy & Consent</h3>
              <p className="text-primary/70 text-xs sm:text-sm md:text-base px-2">
                Please review and accept our terms before proceeding
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 px-2">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="dataUsage"
                  checked={consent.dataUsage}
                  onCheckedChange={(checked) => handleConsentChange('dataUsage', checked as boolean)}
                  className="mt-0.5 flex-shrink-0"
                />
                <label htmlFor="dataUsage" className="text-xs sm:text-sm text-primary/80 leading-relaxed cursor-pointer">
                  I consent to the use of my voice data for improving AI speech recognition systems
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="recording"
                  checked={consent.recording}
                  onCheckedChange={(checked) => handleConsentChange('recording', checked as boolean)}
                  className="mt-0.5 flex-shrink-0"
                />
                <label htmlFor="recording" className="text-xs sm:text-sm text-primary/80 leading-relaxed cursor-pointer">
                  I understand that my voice will be recorded and stored securely
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={consent.terms}
                  onCheckedChange={(checked) => handleConsentChange('terms', checked as boolean)}
                  className="mt-0.5 flex-shrink-0"
                />
                <label htmlFor="terms" className="text-xs sm:text-sm text-primary/80 leading-relaxed cursor-pointer">
                  I agree to the <a href="/terms" className="text-accent hover:underline font-medium">Terms of Service</a> and <a href="/privacy" className="text-accent hover:underline font-medium">Privacy Policy</a>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-2 px-4 sm:px-0">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="px-6 py-2.5 sm:py-3 rounded-full w-full sm:w-auto order-2 sm:order-1"
              >
                Back
              </Button>
              <Button
                onClick={startRecording}
                disabled={!canProceed}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full w-full sm:w-auto font-medium order-1 sm:order-2 disabled:opacity-50"
              >
                Start Recording
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Recording */}
        {step === 3 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in text-center">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 ${
              isPaused 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                : 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse'
            }`}>
              <Mic className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
            </div>

            <div className="px-2">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-2">
                {isPaused ? 'Recording Paused' : 'Recording in Progress'}
              </h3>
              <p className="text-2xl sm:text-3xl md:text-4xl font-mono text-accent mb-3 sm:mb-4">
                {formatTime(recordingTime)}
              </p>
              <p className="text-primary/70 text-xs sm:text-sm md:text-base leading-relaxed px-2">
                {isPaused 
                  ? 'Recording is paused. You can resume or stop the recording.'
                  : 'Please speak clearly and naturally. You can pause or stop anytime.'
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-2 px-4 sm:px-0">
              {!isPaused ? (
                <Button
                  onClick={pauseRecording}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </Button>
              ) : (
                <Button
                  onClick={resumeRecording}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </Button>
              )}
              
              <Button
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <Square className="w-4 h-4" />
                <span>Stop</span>
              </Button>
            </div>

            <div className="text-xs sm:text-sm text-primary/60 space-y-1 px-2">
              <p>Maximum recording time: 2 minutes</p>
              <p>Recording will automatically stop when time is up</p>
              {isPaused && <p className="text-yellow-600 font-medium">Timer is paused</p>}
            </div>
          </div>
        )}

        {/* Step 4: Review & Upload */}
        {step === 4 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary mb-2 sm:mb-3">
                Recording Complete!
              </h3>
              <p className="text-primary/70 text-xs sm:text-sm md:text-base px-2">
                Review your recording and choose what to do next
              </p>
            </div>

            {audioUrl && (
              <Card className="p-3 sm:p-4 md:p-6 border border-blue-200 bg-white mx-2 sm:mx-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <span className="font-medium text-primary text-sm sm:text-base">Your Recording</span>
                  </div>
                  <span className="text-xs sm:text-sm text-primary/60 bg-slate-100 px-2 py-1 rounded-full self-start sm:self-auto">
                    {formatTime(recordingTime)}
                  </span>
                </div>
                
                <audio controls className="w-full mb-3 sm:mb-4 h-8 sm:h-10" src={audioUrl}>
                  Your browser does not support the audio element.
                </audio>
                
                <p className="text-xs sm:text-sm text-primary/70 text-center leading-relaxed">
                  🎧 Listen to your recording above to review the quality
                </p>
              </Card>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-2 px-4 sm:px-0">
              <Button
                variant="outline"
                onClick={handleRecordAgain}
                className="px-6 py-2.5 sm:py-3 rounded-full flex items-center justify-center space-x-2 w-full sm:w-auto order-2 sm:order-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Record Again</span>
              </Button>
              <Button
                onClick={handleUpload}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full flex items-center justify-center space-x-2 w-full sm:w-auto font-medium order-1 sm:order-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Submit Recording</span>
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            
            <div className="px-2">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-2">Thank You!</h3>
              <p className="text-primary/70 text-xs sm:text-sm md:text-base leading-relaxed">
                Your voice contribution has been successfully uploaded. You're helping make AI more inclusive for everyone.
              </p>
            </div>

            <Card className="p-3 sm:p-4 border-0 bg-gradient-to-r from-green-50 to-blue-50 mx-2 sm:mx-0">
              <div className="flex items-center justify-between">
                <span className="text-primary/70 text-xs sm:text-sm md:text-base">Contribution Points</span>
                <span className="font-bold text-accent text-lg sm:text-xl">+10 Points</span>
              </div>
            </Card>

            <div className="px-4 sm:px-0">
              <Button
                onClick={handleClose}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary-800 hover:to-accent-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full w-full sm:w-auto font-medium"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRContribution;