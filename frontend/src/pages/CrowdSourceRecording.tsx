import { useState, useEffect, useCallback } from "react";
import { Configuration, OpenAIApi } from "openai";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import {
  Mic, Clock, Shield, FileText, CheckCircle,
  Pause, Play, Square, RotateCcw,
  Volume2, Download, Upload, ArrowLeft, ArrowRight, Loader2
} from "lucide-react";

const domains = ['healthcare','education','fmcg','telecom','retail','technology'];
const languages = ['English','Hindi','Tamil','Telugu','Gujarati','Punjabi','Odia','Kannada','Bengali','Malayalam'];

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
}));

const Recording = () => {
  const [step, setStep] = useState(1);
  const [consent, setConsent] = useState({dataUsage:false, recording:false, terms:false});
  const [domain, setDomain] = useState("");
  const [language, setLanguage] = useState("");
  const [promptText, setPromptText] = useState("");
  const [generating, setGenerating] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const canProceedConsent = Object.values(consent).every(Boolean);

  useEffect(() => {
    if (stream && isRecording && !isPaused) {
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((s,v)=>s+v,0)/data.length;
        setAudioLevel(avg);
        if (isRecording && !isPaused) requestAnimationFrame(updateLevel);
      };
      updateLevel();
      return () => ctx.close();
    }
  }, [stream, isRecording, isPaused]);

  useEffect(() => {
    if (isRecording && !isPaused && recordingTime < 120) {
      const id = setInterval(() => setRecordingTime(t=>t+1), 1000);
      return () => clearInterval(id);
    }
    if (recordingTime >= 120) stopRecording();
  }, [isRecording, isPaused, recordingTime]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach(t=>t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [stream, audioUrl]);

  const formatTime = (s:number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  const handleConsentChange = (k:keyof typeof consent, v:boolean) => {
    setConsent(prev=>({ ...prev, [k]: v }));
  };

  const generateParagraph = async () => {
    setGenerating(true);
    try {
      const res = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Generate a title and a ~500 word informative passage in ${language}, about ${domain}.`,
        max_tokens: 900,
        temperature: 0.7
      });
      setPromptText(res.data.choices[0].text?.trim() || "");
      setStep(4);
    } catch (err) {
      console.error(err);
      setPromptText("Error generating content. Please try again.");
    }
    setGenerating(false);
  };

  const startRecording = async () => {
    setError(null);
    try {
      const ms = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation:true, noiseSuppression:true, sampleRate:44100 } });
      setStream(ms);
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
      const mr = new MediaRecorder(ms, { mimeType });
      const chunks:Blob[] = [];
      mr.ondataavailable = e => e.data.size && chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: mime });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setStep(6);
      };
      mr.start(100);
      setMediaRecorder(mr);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setStep(5);
    } catch (err:any) {
      setError("Microphone access denied. Please check permissions.");
      console.error(err);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder?.state === "recording") {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder?.state === "paused") {
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    mediaRecorder?.state !== "inactive" && mediaRecorder?.stop();
    stream?.getTracks().forEach(t=>t.stop());
    setIsRecording(false);
    setIsPaused(false);
    setAudioLevel(0);
  };

  const resetFlow = useCallback(() => {
    setStep(1); setConsent({dataUsage:false, recording:false, terms:false});
    setDomain(""); setLanguage(""); setPromptText("");
    setIsRecording(false); setIsPaused(false); setRecordingTime(0);
    setAudioBlob(null); setAudioUrl(null); setError(null);
    setIsUploading(false); setUploadProgress(0);
    mediaRecorder && mediaRecorder.stream.getTracks().forEach(t=>t.stop());
    setMediaRecorder(null);
  }, [mediaRecorder]);

  const handleUpload = () => {
    if (!audioBlob) return;
    setIsUploading(true);
    const id = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(id);
          setIsUploading(false);
          setStep(7);
          return 100;
        }
        return p + Math.random()*20;
      });
    },200);
  };

  const downloadAudio = () => {
    if (audioBlob && audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
    }
  };

  const getTitle = () => ({
    1: "Welcome to TatvamAI",
    2: "Consent & Privacy",
    3: "Pick Domain & Language",
    4: "Generated Speaking Prompt",
    5: "Recording Session",
    6: "Review & Submit",
    7: "Thank You!"
  } as any)[step];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full space-y-8">
        <h1 className="text-3xl font-bold text-center">{getTitle()}</h1>
        {step === 1 && (
          <Card className="p-8 space-y-6 text-center">
            <Clock className="mx-auto w-12 h-12 text-blue-400" />
            <p>2 minutes max • Secure & Private • Easy Process</p>
            <Button onClick={() => setStep(2)}>Get Started →</Button>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-6 space-y-6">
            {[
              {k:'dataUsage', t:"I consent to use of my voice data", i:<Mic className="w-5 h-5 text-blue-400"/>},
              {k:'recording', t:"I understand recording & storage", i:<Shield className="w-5 h-5 text-green-400"/>},
              {k:'terms', t:"I agree to Terms & Privacy", i:<FileText className="w-5 h-5 text-purple-400"/>}
            ].map(o => (
              <div key={o.k} className="flex items-center space-x-3">
                {o.i}
                <Checkbox checked={consent[o.k as any]} onCheckedChange={v=>handleConsentChange(o.k as any, v as boolean)} />
                <label className="text-slate-300">{o.t}</label>
              </div>
            ))}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
              <Button disabled={!canProceedConsent} onClick={() => setStep(3)}>Next →</Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="p-6 space-y-6">
            <select className="w-full p-2 bg-slate-700" value={domain} onChange={e=>setDomain(e.target.value)}>
              <option>Select Domain</option>
              {domains.map(d=><option key={d}>{d}</option>)}
            </select>
            <select className="w-full p-2 bg-slate-700" value={language} onChange={e=>setLanguage(e.target.value)}>
              <option>Select Language</option>
              {languages.map(l=><option key={l}>{l}</option>)}
            </select>
            <Button disabled={!domain||!language} onClick={generateParagraph}>
              {generating ? <Loader2 className="animate-spin mr-2"/> : "Generate Prompt"}
            </Button>
          </Card>
        )}

        {step === 4 && (
          <Card className="p-6 space-y-4 max-h-[60vh] overflow-auto">
            <pre className="whitespace-pre-wrap">{promptText}</pre>
            <Button onClick={() => setStep(5)}>Proceed to Recording</Button>
          </Card>
        )}

        {step === 5 && (
          <Card className="p-6 text-center">
            <div className={`mx-auto w-24 h-24 rounded-full ${
              isPaused ? "bg-yellow-500" : "bg-red-500 animate-pulse"
            } flex items-center justify-center`}>
              <Mic className="w-12 h-12 text-white"/>
            </div>
            <p className="text-4xl font-mono">{formatTime(recordingTime)}</p>
            <div className="mt-4 space-x-4">
              {!isPaused ? (
                <Button onClick={pauseRecording} className="bg-yellow-500">Pause</Button>
              ) : (
                <Button onClick={resumeRecording} className="bg-green-500">Resume</Button>
              )}
              <Button onClick={stopRecording} className="bg-red-600">Stop</Button>
            </div>
            {error && <p className="text-red-400 mt-4">{error}</p>}
          </Card>
        )}

        {step === 6 && audioUrl && (
          <Card className="p-6 space-y-4">
            <CheckCircle className="mx-auto w-10 h-10 text-green-400"/>
            <audio controls src={audioUrl} className="w-full"/>
            <div className="flex space-x-4">
              <Button onClick={downloadAudio} variant="outline">Download</Button>
              <Button onClick={handleUpload} disabled={isUploading} className="bg-green-500">
                {isUploading ? `Uploading ${Math.round(uploadProgress)}%` : "Submit Recording"}
              </Button>
            </div>
          </Card>
        )}

        {step === 7 && (
          <Card className="p-6 space-y-4 text-center">
            <CheckCircle className="mx-auto w-12 h-12 text-green-400"/>
            <p>Thank you! Your voice recording has been submitted.</p>
            <Button onClick={resetFlow} className="bg-blue-600">Make Another Contribution</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Recording;
