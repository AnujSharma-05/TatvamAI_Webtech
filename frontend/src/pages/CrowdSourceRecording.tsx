import { useState, useEffect, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import {
  Mic, Clock, Shield, FileText, CheckCircle, Pause, Play, Square, RotateCcw,
  Volume2, Download, Upload, ArrowLeft, ArrowRight, Loader2
} from "lucide-react";
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import axios from '../config/axios';

const QRRecording = () => {
  const [step, setStep] = useState(1);
  const [consent, setConsent] = useState({
    dataUsage: false,
    recording: false,
    terms: false
  });

  const domains = ['healthcare', 'education', 'fmcg', 'telecom', 'retail', 'technology'];
  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Gujarati', 'Punjabi', 'Odia', 'Kannada', 'Bengali', 'Malayalam'];

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recorder, setRecorder] = useState<any>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState("");
  const [language, setLanguage] = useState("");
  const [promptText, setPromptText] = useState("Please read the following text clearly and at a natural pace: 'The quick brown fox jumps over the lazy dog.'");
  const canProceedPrompt = domain && language && promptText.trim();

  useEffect(() => {
    if (stream && isRecording && !isPaused) {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setAudioLevel(average);

        if (isRecording && !isPaused) {
          requestAnimationFrame(updateAudioLevel);
        }
      };

      updateAudioLevel();

      return () => {
        audioContext.close();
      };
    }
  }, [stream, isRecording, isPaused]);

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

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [stream, audioUrl]);

  const handleConsentChange = (key: keyof typeof consent, value: boolean) => {
    setConsent(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = Object.values(consent).every(Boolean);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    console.log("Starting recording...");
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
          channelCount: 1,
        }
      });

      setStream(mediaStream);

      const newRecorder = new RecordRTC(mediaStream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: StereoAudioRecorder,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
      });

      newRecorder.startRecording();
      setRecorder(newRecorder);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setAudioBlob(null);
      if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(null);
      setStep(5);
    } catch (err) {
      setError("Microphone access denied or not available. Please check your browser permissions.");
      console.error("Recording error:", err);
    }
  };

  const pauseRecording = () => {
    if (recorder) {
      recorder.pauseRecording();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (recorder) {
      recorder.resumeRecording();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
            // Use Math.round to avoid long decimals
            setRecordingTime(Math.round(audio.duration)); 
        };
        // The step is now 6 for Review & Submit
        setStep(6);
      });
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setIsPaused(false);
    setAudioLevel(0);
  };
  
  const resetFlow = useCallback(() => {
    setStep(1);
    setConsent({ dataUsage: false, recording: false, terms: false });
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setAudioBlob(null);
    setAudioLevel(0);
    setError(null);
    setIsUploading(false);
    setUploadProgress(0);
    setDomain("");
    setLanguage("");
    setPromptText("Please read the following text clearly and at a natural pace: 'The quick brown fox jumps over the lazy dog.'");


    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    setRecorder(null);
  }, [audioUrl, stream]);

  const handleUpload = async () => {
    if (!audioBlob) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("audio", audioBlob, `recording-${Date.now()}.wav`);
    formData.append("duration", recordingTime.toFixed(2));
    formData.append("language", language);
    formData.append("domain", domain);
    formData.append("recordedVia", "web");

    try {
      // The endpoint might need adjustment based on your actual API
      const response = await axios.post("/recordings/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total ?? 1; // Use a default value if total is null
          const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(percentCompleted);
        }
      });
      // The step is now 7 for Contribution Complete
      setStep(7);
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRecordAgain = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
    setRecorder(null);
    setError(null);
    // Go back to the prompt step to start a new recording
    setStep(4); 
  };

  const downloadAudio = () => {
    if (audioBlob && audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `voice-recording-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Voice Contribution";
      case 2: return "Terms & Consent";
      case 3: return "Pick Domain & Language";
      case 4: return "Speaking Prompt";
      case 5: return "Recording Session";
      case 6: return "Review & Submit";
      case 7: return "Contribution Complete";
      default: return "Voice Contribution";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{getStepTitle()}</h1>
            <div className="flex justify-center items-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step === num 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : step > num 
                        ? 'bg-green-500 text-white' 
                        : 'bg-slate-700 text-slate-400'
                  }`}>
                    {step > num ? <CheckCircle className="w-4 h-4" /> : num}
                  </div>
                   {num < 7 && (
                    <div className={`w-8 h-0.5 transition-all duration-300 ${
                      step > num ? 'bg-green-500' : 'bg-slate-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="bg-slate-800 p-8 rounded-xl text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mic className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Welcome to TatvamAI</h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Help us build more inclusive AI systems by contributing your voice. 
                Your recordings will be used to train AI models that better understand diverse speech patterns.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-slate-700 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-400 mb-2 mx-auto" />
                  <p className="text-sm text-slate-300">2 minutes max</p>
                </div>
                <div className="p-4 bg-slate-700 rounded-lg">
                  <Shield className="w-6 h-6 text-green-400 mb-2 mx-auto" />
                  <p className="text-sm text-slate-300">Secure & Private</p>
                </div>
                <div className="p-4 bg-slate-700 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-400 mb-2 mx-auto" />
                  <p className="text-sm text-slate-300">Easy Process</p>
                </div>
              </div>
              <Button 
                onClick={() => setStep(2)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105 transition-all duration-300 px-8 py-3"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Consent */}
          {step === 2 && (
            <div className="bg-slate-800 p-8 rounded-xl">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold">Consent & Privacy</h2>
              </div>
              
              <div className="space-y-6 mb-8">
                {[
                  { key: "dataUsage", text: "I consent to the use of my voice data for AI training purposes", icon: <Mic className="w-5 h-5 text-blue-400" /> },
                  { key: "recording", text: "I understand that my voice will be securely recorded and processed", icon: <Shield className="w-5 h-5 text-green-400" /> },
                  { key: "terms", text: "I agree to the Terms of Service and Privacy Policy", icon: <FileText className="w-5 h-5 text-purple-400" /> }
                ].map(({ key, text, icon }) => (
                  <div key={key} className="flex items-start space-x-4 p-4 bg-slate-700 rounded-lg">
                    <div className="flex-shrink-0 mt-1">{icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={key}
                          checked={consent[key as keyof typeof consent]}
                          onCheckedChange={(val) => handleConsentChange(key as keyof typeof consent, val as boolean)}
                          className="border-slate-500"
                        />
                        <label htmlFor={key} className="text-slate-300 cursor-pointer">{text}</label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button 
                  disabled={!canProceed} 
                  onClick={() => setStep(3)} // Corrected: Go to step 3
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Pick Domain & Language */}
          {step === 3 && (
            <Card className="p-8 space-y-6 bg-slate-800 border-slate-700">
              <select className="w-full p-2 bg-slate-700 text-white rounded" value={domain} onChange={e => setDomain(e.target.value)}>
                <option value="">Select Domain</option>
                {domains.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select className="w-full p-2 bg-slate-700 text-white rounded" value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="">Select Language</option>
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button disabled={!domain || !language} onClick={() => setStep(4)} className="bg-gradient-to-r from-blue-600 to-purple-600 disabled:opacity-50">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          )}

          {/* Step 4: Speaking Prompt */}
          {step === 4 && (
            <Card className="p-8 space-y-6 bg-slate-800 border-slate-700">
              <textarea
                className="w-full p-4 bg-slate-700 text-white rounded min-h-[150px]"
                placeholder="Paste or write your speaking prompt here..."
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
              />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(3)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={startRecording} disabled={!canProceedPrompt} className="bg-gradient-to-r from-green-600 to-emerald-500 disabled:opacity-50">
                  Start Recording <Mic className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          )}

          {/* Step 5: Recording */}
          {step === 5 && (
            <div className="bg-slate-800 p-8 rounded-xl text-center">
               <div className="relative mb-8">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                  isPaused 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                    : 'bg-gradient-to-r from-red-500 to-pink-500'
                } ${!isPaused ? 'animate-pulse' : ''}`}>
                  <Mic className="w-12 h-12 text-white" />
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-full h-full rounded-full border-4 border-slate-700"
                      style={{
                        transform: `scale(${1 + audioLevel / 500})`,
                        opacity: 0.8 - audioLevel / 300,
                        transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
                      }}
                    />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-4">
                {isPaused ? "Recording Paused" : "Recording in Progress"}
              </h2>
              
              <div className="text-5xl font-mono mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {formatTime(recordingTime)}
              </div>
              
              <div className="text-slate-400 mb-8">
                {recordingTime < 120 ? `${120 - recordingTime}s remaining` : 'Maximum duration reached'}
              </div>
              
              <div className="flex justify-center space-x-4">
                {!isPaused ? (
                  <Button onClick={pauseRecording} className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3">
                    <Pause className="w-4 h-4 mr-2" /> Pause
                  </Button>
                ) : (
                  <Button onClick={resumeRecording} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3">
                    <Play className="w-4 h-4 mr-2" /> Resume
                  </Button>
                )}
                <Button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3">
                  <Square className="w-4 h-4 mr-2" /> Stop
                </Button>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && audioUrl && (
            <div className="bg-slate-800 p-8 rounded-xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Review Your Recording</h2>
                <p className="text-slate-300">Listen to your recording and choose to submit or record again</p>
              </div>
              
              <div className="bg-slate-700 p-6 rounded-lg mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Volume2 className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">Duration: {formatTime(recordingTime)}</span>
                </div>
                <audio controls src={audioUrl} className="w-full" />
              </div>
              
              <div className="flex justify-center space-x-4 flex-wrap gap-2">
                <Button onClick={handleRecordAgain} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <RotateCcw className="w-4 h-4 mr-2" /> Record Again
                </Button>
                <Button onClick={downloadAudio} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
                <Button onClick={handleUpload} disabled={isUploading} className="bg-gradient-to-r from-green-600 to-emerald-500 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading... {Math.round(uploadProgress)}%
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Recording
                    </>
                  )}
                </Button>
              </div>
              
              {isUploading && (
                <div className="mt-6">
                  <div className="bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-600 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 7: Success */}
          {step === 7 && (
            <div className="bg-slate-800 p-8 rounded-xl text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Your voice contribution has been successfully submitted. 🎉<br />
                You're helping build more inclusive AI systems for everyone.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-slate-700 rounded-lg">
                      <h3 className="font-semibold mb-2">Recording Info</h3>
                      <p className="text-slate-300">{language} / {domain}</p>
                      <p className="text-slate-300 mt-1">Duration: {formatTime(recordingTime)}</p>
                  </div>
                  <div className="p-4 bg-slate-700 rounded-lg">
                      <h3 className="font-semibold mb-2">Contribution ID</h3>
                      <p className="text-slate-300 font-mono text-sm">#{Math.random().toString(36).substring(2, 9).toUpperCase()}</p>
                  </div>
              </div>
              <Button 
                onClick={resetFlow}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105 transition-all duration-300 px-8 py-3"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Make Another Contribution
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRRecording;