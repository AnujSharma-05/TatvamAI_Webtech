import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import {
  Mic,
  Clock,
  Shield,
  FileText,
  CheckCircle,
  Pause,
  Play,
  Square,
  RotateCcw,
  Volume2,
  Download,
  Upload,
  ArrowLeft,
  ArrowRight,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import axios from "../config/axios";
import { COLORS } from "@/config/theme";

const QRRecording = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [consent, setConsent] = useState({
    dataUsage: false,
    recording: false,
    terms: false,
  });

  const domains = [
    "healthcare",
    "education",
    "fmcg",
    "telecom",
    "retail",
    "technology",
  ];
  const languages = [
    "English",
    "Hindi",
    "Tamil",
    "Telugu",
    "Gujarati",
    "Punjabi",
    "Odia",
    "Kannada",
    "Bengali",
    "Malayalam",
  ];

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
  const [promptText, setPromptText] = useState("");
  const [isGeneratingParagraph, setIsGeneratingParagraph] = useState(false);
  const [generatedParagraph, setGeneratedParagraph] = useState("");

  const canProceedPrompt = domain && language;

  // Generate paragraph when domain and language are selected
  const generateParagraph = async () => {
    if (!domain || !language) return;

    setIsGeneratingParagraph(true);
    setError(null);

    try {
      const response = await axios.post("/recordings/generate-paragraph", {
        language,
        domain,
      });

      // Handle the response structure properly
      let paragraph = "Default paragraph text";

      if (response.data && typeof response.data === "object") {
        // The API returns ApiResponse structure: {statusCode, data, message, success}
        if (response.data.data && typeof response.data.data === "string") {
          paragraph = response.data.data;
        } else if (
          response.data.message &&
          typeof response.data.message === "string"
        ) {
          paragraph = response.data.message;
        } else if (
          response.data.text &&
          typeof response.data.text === "string"
        ) {
          paragraph = response.data.text;
        } else {
          // Fallback: try to stringify the data if it's an object
          paragraph = JSON.stringify(response.data);
        }
      } else if (typeof response.data === "string") {
        paragraph = response.data;
      }

      // Ensure we always have a valid string
      if (typeof paragraph !== "string") {
        console.warn("Paragraph is not a string, converting:", paragraph);
        paragraph = String(paragraph);
      }

      // Additional safety check - if paragraph is too short or seems like an error, use fallback
      if (
        paragraph.length < 10 ||
        paragraph.includes("error") ||
        paragraph.includes("Error")
      ) {
        console.warn("Paragraph seems invalid, using fallback");
        paragraph = `Please read the following ${domain} related text in ${language}: 'The quick brown fox jumps over the lazy dog.'`;
      }

      setGeneratedParagraph(paragraph);
      setPromptText(paragraph);
    } catch (err) {
      setError("Failed to generate paragraph. Please try again.");
      console.error("Paragraph generation error:", err);
      // Fallback to default text
      const fallbackText = `Please read the following ${domain} related text in ${language}: 'The quick brown fox jumps over the lazy dog.'`;
      setGeneratedParagraph(fallbackText);
      setPromptText(fallbackText);
    } finally {
      setIsGeneratingParagraph(false);
    }
  };

  // Auto-generate paragraph when domain and language change
  useEffect(() => {
    if (domain && language && step === 3) {
      generateParagraph();
    }
  }, [domain, language, step]);

  useEffect(() => {
    if (stream && isRecording && !isPaused) {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average =
          dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
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
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else if (recordingTime >= 120) {
      stopRecording();
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused, recordingTime]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [stream, audioUrl]);

  const handleConsentChange = (key: keyof typeof consent, value: boolean) => {
    setConsent((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = Object.values(consent).every(Boolean);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
        },
      });

      setStream(mediaStream);

      const newRecorder = new RecordRTC(mediaStream, {
        type: "audio",
        mimeType: "audio/wav",
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
      setError(
        "Microphone access denied or not available. Please check your browser permissions."
      );
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
          setRecordingTime(Math.round(audio.duration));
        };
        setStep(6);
      });
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
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
    setPromptText("");
    setGeneratedParagraph("");
    setIsGeneratingParagraph(false);

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
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
    formData.append("paragraph", generatedParagraph);

    try {
      // 1. Upload the recording to /recordings (S3 upload)
      const uploadResponse = await axios.post("/recordings/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total ?? 1;
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / total
          );
          setUploadProgress(percentCompleted);
        },
      });

      const audioId = uploadResponse?.data?.data?._id;
      if (!audioId) throw new Error("Server didn't return a recording ID.");

      // 2. Show success message and redirect to dashboard immediately
      setStep(7);

      // Wait a moment to show the success screen, then redirect
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

      // 3. Make evaluation API call in the background (don't await)
      // This will happen asynchronously while user sees success message
      axios
        .post(`/recordings/${audioId}/evaluate`)
        .then((evaluateResponse) => {
          const { final_quality, amount, recordingId } =
            evaluateResponse.data.data;
          console.log("Background evaluation completed:", {
            final_quality,
            recordingId,
            amount,
          });

          // Optionally, you could dispatch a custom event or use a state management solution
          // to notify the dashboard component that evaluation is complete
          window.dispatchEvent(
            new CustomEvent("recordingEvaluated", {
              detail: { audioId, final_quality, amount },
            })
          );
        })
        .catch((evalError) => {
          console.error("Background evaluation failed:", evalError);
          // Evaluation failed, but upload was successful - user doesn't need to see this error
          // The recording will remain in "pending" status until manual evaluation or retry
        });
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Something went wrong while uploading. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRecordAgain = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
    setRecorder(null);
    setError(null);
    setStep(4);
  };

  const downloadAudio = () => {
    if (audioBlob && audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = `voice-recording-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Voice Contribution";
      case 2:
        return "Terms & Consent";
      case 3:
        return "Pick Domain & Language";
      case 4:
        return "Speaking Prompt";
      case 5:
        return "Recording Session";
      case 6:
        return "Review & Submit";
      case 7:
        return "Contribution Complete";
      default:
        return "Voice Contribution";
    }
  };

  return (
    <div
      style={{ background: "transparent", color: COLORS.nyanza }}
      className="relative min-h-screen flex items-center justify-center px-4"
    >
      {/* Exit Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 hover:scale-110"
        style={{
          background: `${COLORS.midnightGreen}80`,
          border: `1px solid ${COLORS.cadetGray}40`,
          backdropFilter: "blur(12px)",
          color: COLORS.cadetGray,
        }}
        title="Exit Recording"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto my-20">
          {/* Header */}
          <div className="text-center mb-12">
            <h1
              className="text-4xl font-bold mb-4"
              style={{ color: COLORS.nyanza }}
            >
              {getStepTitle()}
            </h1>
            <div className="flex justify-center items-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div key={num} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300`}
                    style={{
                      background:
                        step === num
                          ? COLORS.teaGreen
                          : step > num
                          ? COLORS.teaGreen
                          : `${COLORS.midnightGreen}40`,
                      color:
                        step === num || step > num
                          ? COLORS.midnightGreen
                          : COLORS.cadetGray,
                      border: `1px solid ${COLORS.cadetGray}20`,
                    }}
                  >
                    {step > num ? <CheckCircle className="w-4 h-4" /> : num}
                  </div>
                  {num < 7 && (
                    <div
                      className={`w-8 h-0.5 transition-all duration-300`}
                      style={{
                        background:
                          step > num
                            ? COLORS.teaGreen
                            : `${COLORS.cadetGray}20`,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div
              className="p-4 rounded-xl mb-6"
              style={{
                background: `linear-gradient(145deg, #ff000010, #ff000005)`,
                border: `1px solid #ff000020`,
              }}
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" style={{ color: "#ff6b6b" }} />
                <span className="font-medium" style={{ color: "#ff6b6b" }}>
                  Error
                </span>
              </div>
              <p className="mt-2 text-sm" style={{ color: "#ff6b6b" }}>
                {error}
              </p>
            </div>
          )}

          {/* Step 1: Welcome */}
          {step === 1 && (
            <div
              className="p-8 rounded-xl text-center"
              style={{
                background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`,
                border: `1px solid ${COLORS.cadetGray}20`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 8px 32px 0 ${COLORS.midnightGreen}50`,
              }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{
                  background: COLORS.teaGreen,
                  color: COLORS.midnightGreen,
                }}
              >
                <Mic className="w-10 h-10" />
              </div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: COLORS.nyanza }}
              >
                Welcome to TatvamAI
              </h2>
              <p
                className="text-lg mb-8 leading-relaxed"
                style={{ color: COLORS.cadetGray }}
              >
                Help us build more inclusive AI systems by contributing your
                voice. Your recordings will be used to train AI models that
                better understand diverse speech patterns.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div
                  className="p-4 rounded-lg"
                  style={{ background: `${COLORS.midnightGreen}30` }}
                >
                  <Clock
                    className="w-6 h-6 mb-2 mx-auto"
                    style={{ color: COLORS.teaGreen }}
                  />
                  <p className="text-sm" style={{ color: COLORS.cadetGray }}>
                    2 minutes max
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg"
                  style={{ background: `${COLORS.midnightGreen}30` }}
                >
                  <Shield
                    className="w-6 h-6 mb-2 mx-auto"
                    style={{ color: COLORS.teaGreen }}
                  />
                  <p className="text-sm" style={{ color: COLORS.cadetGray }}>
                    Secure & Private
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg"
                  style={{ background: `${COLORS.midnightGreen}30` }}
                >
                  <FileText
                    className="w-6 h-6 mb-2 mx-auto"
                    style={{ color: COLORS.teaGreen }}
                  />
                  <p className="text-sm" style={{ color: COLORS.cadetGray }}>
                    Easy Process
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setStep(2)}
                className="px-8 py-3 font-semibold rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  background: COLORS.teaGreen,
                  color: COLORS.midnightGreen,
                }}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Consent */}
          {step === 2 && (
            <div
              className="p-8 rounded-xl"
              style={{
                background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`,
                border: `1px solid ${COLORS.cadetGray}20`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 8px 32px 0 ${COLORS.midnightGreen}50`,
              }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Shield
                  className="w-6 h-6"
                  style={{ color: COLORS.teaGreen }}
                />
                <h2
                  className="text-xl font-semibold"
                  style={{ color: COLORS.nyanza }}
                >
                  Consent & Privacy
                </h2>
              </div>

              <div className="space-y-6 mb-8">
                {[
                  {
                    key: "dataUsage",
                    text: "I consent to the use of my voice data for AI training purposes",
                    icon: (
                      <Mic
                        className="w-5 h-5"
                        style={{ color: COLORS.teaGreen }}
                      />
                    ),
                  },
                  {
                    key: "recording",
                    text: "I understand that my voice will be securely recorded and processed",
                    icon: (
                      <Shield
                        className="w-5 h-5"
                        style={{ color: COLORS.teaGreen }}
                      />
                    ),
                  },
                  {
                    key: "terms",
                    text: "I agree to the Terms of Service and Privacy Policy",
                    icon: (
                      <FileText
                        className="w-5 h-5"
                        style={{ color: COLORS.teaGreen }}
                      />
                    ),
                  },
                ].map(({ key, text, icon }) => (
                  <div
                    key={key}
                    className="flex items-start space-x-4 p-4 rounded-lg"
                    style={{ background: `${COLORS.midnightGreen}30` }}
                  >
                    <div className="flex-shrink-0 mt-1">{icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={key}
                          checked={consent[key as keyof typeof consent]}
                          onCheckedChange={(val) =>
                            handleConsentChange(
                              key as keyof typeof consent,
                              val as boolean
                            )
                          }
                          className="border-slate-500"
                        />
                        <label
                          htmlFor={key}
                          className="cursor-pointer"
                          style={{ color: COLORS.cadetGray }}
                        >
                          {text}
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 font-semibold rounded-full transition-all"
                  style={{
                    border: `1px solid ${COLORS.cadetGray}80`,
                    color: COLORS.cadetGray,
                    background: `${COLORS.midnightGreen}30`,
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button
                  disabled={!canProceed}
                  onClick={() => setStep(3)}
                  className="px-6 py-3 font-semibold rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: COLORS.teaGreen,
                    color: COLORS.midnightGreen,
                  }}
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Pick Domain & Language */}
          {step === 3 && (
            <div
              className="p-8 space-y-6 rounded-xl"
              style={{
                background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`,
                border: `1px solid ${COLORS.cadetGray}20`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 8px 32px 0 ${COLORS.midnightGreen}50`,
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: COLORS.nyanza }}
                  >
                    Select Domain
                  </label>
                  <select
                    className="w-full p-3 rounded-lg border focus:outline-none focus:border-2 transition-colors"
                    style={{
                      background: `${COLORS.midnightGreen}30`,
                      color: COLORS.nyanza,
                      border: `1px solid ${COLORS.cadetGray}40`,
                    }}
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  >
                    <option value="">Choose a domain...</option>
                    {domains.map((d) => (
                      <option key={d} value={d} className="capitalize">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: COLORS.nyanza }}
                  >
                    Select Language
                  </label>
                  <select
                    className="w-full p-3 rounded-lg border focus:outline-none focus:border-2 transition-colors"
                    style={{
                      background: `${COLORS.midnightGreen}30`,
                      color: COLORS.nyanza,
                      border: `1px solid ${COLORS.cadetGray}40`,
                    }}
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="">Choose a language...</option>
                    {languages.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Enhanced Generated Paragraph Preview */}
              {domain && language && (
                <div
                  className="p-6 rounded-lg border-2"
                  style={{
                    background: `${COLORS.midnightGreen}30`,
                    border: `2px solid ${COLORS.teaGreen}30`,
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className="font-medium text-lg"
                      style={{ color: COLORS.nyanza }}
                    >
                      Generated Reading Text
                    </h3>
                    <Button
                      onClick={generateParagraph}
                      disabled={isGeneratingParagraph}
                      variant="outline"
                      size="sm"
                      className="font-semibold rounded-full transition-all"
                      style={{
                        border: `1px solid ${COLORS.cadetGray}80`,
                        color: COLORS.cadetGray,
                        background: `${COLORS.midnightGreen}30`,
                      }}
                    >
                      {isGeneratingParagraph ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      {isGeneratingParagraph ? " Generating..." : " Regenerate"}
                    </Button>
                  </div>

                  {isGeneratingParagraph ? (
                    <div
                      className="flex items-center space-x-3 p-4 rounded-lg"
                      style={{
                        background: `${COLORS.midnightGreen}40`,
                        color: COLORS.cadetGray,
                      }}
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <div>
                        <p className="font-medium">Generating paragraph...</p>
                        <p className="text-sm">
                          Creating {domain} content in {language}
                        </p>
                      </div>
                    </div>
                  ) : generatedParagraph ? (
                    <div
                      className="p-4 rounded border-l-4 shadow-lg"
                      style={{
                        background: `${COLORS.midnightGreen}40`,
                        borderLeftColor: COLORS.teaGreen,
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle
                          className="w-5 h-5"
                          style={{ color: COLORS.teaGreen }}
                        />
                        <span
                          className="font-medium"
                          style={{ color: COLORS.teaGreen }}
                        >
                          Text Ready!
                        </span>
                      </div>
                      <p
                        className="leading-relaxed text-lg"
                        style={{ color: COLORS.nyanza }}
                      >
                        {String(generatedParagraph)}
                      </p>
                    </div>
                  ) : (
                    <div
                      className="p-4 rounded border-l-4"
                      style={{
                        background: `${COLORS.midnightGreen}40`,
                        borderLeftColor: COLORS.teaGreen,
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <FileText
                          className="w-5 h-5"
                          style={{ color: COLORS.teaGreen }}
                        />
                        <span
                          className="font-medium"
                          style={{ color: COLORS.teaGreen }}
                        >
                          Ready to Generate
                        </span>
                      </div>
                      <p className="italic" style={{ color: COLORS.cadetGray }}>
                        Click the regenerate button to create reading text for{" "}
                        {domain} in {language}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 font-semibold rounded-full transition-all"
                  style={{
                    border: `1px solid ${COLORS.cadetGray}80`,
                    color: COLORS.cadetGray,
                    background: `${COLORS.midnightGreen}30`,
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button
                  disabled={
                    !canProceedPrompt ||
                    isGeneratingParagraph ||
                    !generatedParagraph
                  }
                  onClick={() => setStep(4)}
                  className="px-6 py-3 font-semibold rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  style={{
                    background: COLORS.teaGreen,
                    color: COLORS.midnightGreen,
                  }}
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Speaking Prompt */}
          {step === 4 && (
            <div
              className="p-8 space-y-6 rounded-xl"
              style={{
                background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`,
                border: `1px solid ${COLORS.cadetGray}20`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 8px 32px 0 ${COLORS.midnightGreen}50`,
              }}
            >
              <div>
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: COLORS.nyanza }}
                >
                  Reading Instructions
                </h3>
                <div
                  className="p-4 rounded-lg mb-4"
                  style={{ background: `${COLORS.midnightGreen}30` }}
                >
                  <p className="mb-2" style={{ color: COLORS.cadetGray }}>
                    <strong>Domain:</strong> {domain} |{" "}
                    <strong>Language:</strong> {language}
                  </p>
                  <p className="text-sm" style={{ color: COLORS.cadetGray }}>
                    Please read the following text clearly and at a natural
                    pace. You'll have up to 2 minutes to complete the recording.
                  </p>
                </div>

                {/* Enhanced Text Display */}
                <div
                  className="p-6 rounded-lg border-2"
                  style={{
                    background: `${COLORS.midnightGreen}30`,
                    border: `2px solid ${COLORS.teaGreen}30`,
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4
                      className="text-lg font-medium"
                      style={{ color: COLORS.teaGreen }}
                    >
                      Text to Read:
                    </h4>
                    <div
                      className="flex items-center space-x-2 text-sm"
                      style={{ color: COLORS.cadetGray }}
                    >
                      <Mic className="w-4 h-4" />
                      <span>Ready to record</span>
                    </div>
                  </div>
                  <div
                    className="p-6 rounded border-l-4 shadow-lg"
                    style={{
                      background: `${COLORS.midnightGreen}40`,
                      borderLeftColor: COLORS.teaGreen,
                    }}
                  >
                    <p
                      className="leading-relaxed text-lg font-medium"
                      style={{ color: COLORS.nyanza }}
                    >
                      {String(
                        generatedParagraph ||
                          promptText ||
                          "No text available. Please go back and generate text first."
                      )}
                    </p>
                  </div>
                  {!generatedParagraph && !promptText && (
                    <div
                      className="p-3 rounded mt-3"
                      style={{
                        background: `${COLORS.lightYellow}10`,
                        border: `1px solid ${COLORS.lightYellow}20`,
                      }}
                    >
                      <p
                        className="text-sm"
                        style={{ color: COLORS.lightYellow }}
                      >
                        ⚠️ No text available. Please go back and generate text
                        first.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="p-4 rounded-lg"
                style={{
                  background: `${COLORS.teaGreen}10`,
                  border: `1px solid ${COLORS.teaGreen}20`,
                }}
              >
                <div className="flex items-start space-x-3">
                  <Mic
                    className="w-5 h-5 mt-0.5"
                    style={{ color: COLORS.teaGreen }}
                  />
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: COLORS.teaGreen }}
                    >
                      Recording Tips:
                    </p>
                    <ul
                      className="text-sm mt-1 space-y-1"
                      style={{ color: COLORS.cadetGray }}
                    >
                      <li>• Speak clearly and at your natural pace</li>
                      <li>• Find a quiet environment</li>
                      <li>• Keep your device close to your mouth</li>
                      <li>• You can pause and resume if needed</li>
                      <li>• The text will be visible during recording</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 font-semibold rounded-full transition-all"
                  style={{
                    border: `1px solid ${COLORS.cadetGray}80`,
                    color: COLORS.cadetGray,
                    background: `${COLORS.midnightGreen}30`,
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button
                  onClick={startRecording}
                  disabled={!generatedParagraph && !promptText.trim()}
                  className="px-6 py-3 font-semibold rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  style={{
                    background: COLORS.teaGreen,
                    color: COLORS.midnightGreen,
                  }}
                >
                  Start Recording <Mic className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Recording */}
          {step === 5 && (
            <div
              className="p-6 rounded-xl"
              style={{
                background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`,
                border: `1px solid ${COLORS.cadetGray}20`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 8px 32px 0 ${COLORS.midnightGreen}50`,
              }}
            >
              {/* Text Display Section - Full Width */}
              <div className="mb-6">
                <div
                  className="p-4 rounded-lg border-2"
                  style={{
                    background: `${COLORS.midnightGreen}30`,
                    border: `2px solid ${COLORS.teaGreen}30`,
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: COLORS.teaGreen }}
                    >
                      Read This Text:
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isPaused ? "animate-pulse" : "animate-pulse"
                        }`}
                        style={{
                          backgroundColor: isPaused
                            ? "#fbbf24"
                            : COLORS.teaGreen,
                        }}
                      ></div>
                      <span
                        className="text-sm"
                        style={{ color: COLORS.cadetGray }}
                      >
                        {isPaused ? "Paused" : "Recording"}
                      </span>
                    </div>
                  </div>

                  <div
                    className="p-4 rounded border-l-4 max-h-64 overflow-y-auto shadow-lg"
                    style={{
                      background: `${COLORS.midnightGreen}40`,
                      borderLeftColor: COLORS.teaGreen,
                    }}
                  >
                    <p
                      className="leading-relaxed text-base sm:text-lg font-medium"
                      style={{ color: COLORS.nyanza }}
                    >
                      {String(
                        generatedParagraph || promptText || "No text available"
                      )}
                    </p>
                  </div>

                  <div
                    className="mt-3 p-3 rounded-lg"
                    style={{ background: `${COLORS.midnightGreen}30` }}
                  >
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span style={{ color: COLORS.cadetGray }}>Domain:</span>
                        <span
                          className="ml-2 font-medium capitalize"
                          style={{ color: COLORS.nyanza }}
                        >
                          {domain}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: COLORS.cadetGray }}>
                          Language:
                        </span>
                        <span
                          className="ml-2 font-medium"
                          style={{ color: COLORS.nyanza }}
                        >
                          {language}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recording Controls Section - Centered and Compact */}
              <div className="text-center">
                {/* Minimalist Recording Interface */}
                <div className="flex flex-col items-center space-y-4 mb-6">
                  {/* Compact Mic Icon */}
                  <div className="relative">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                        !isPaused ? "animate-pulse" : ""
                      }`}
                      style={{
                        background: isPaused ? "#fbbf24" : COLORS.teaGreen,
                      }}
                    >
                      <Mic
                        className="w-6 h-6 sm:w-8 sm:h-8"
                        style={{ color: COLORS.midnightGreen }}
                      />
                    </div>

                    {/* Subtle Audio Level Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-full h-full rounded-full border-2"
                        style={{
                          borderColor: `${COLORS.cadetGray}60`,
                          transform: `scale(${1 + audioLevel / 1000})`,
                          opacity: 0.6 - audioLevel / 500,
                          transition:
                            "transform 0.1s ease-out, opacity 0.1s ease-out",
                        }}
                      />
                    </div>
                  </div>

                  {/* Recording Status */}
                  <div className="text-center">
                    <h2
                      className="text-lg sm:text-xl font-bold mb-2"
                      style={{ color: COLORS.nyanza }}
                    >
                      {isPaused ? "Recording Paused" : "Recording in Progress"}
                    </h2>

                    <div
                      className="text-3xl sm:text-4xl font-mono mb-1"
                      style={{ color: COLORS.teaGreen }}
                    >
                      {formatTime(recordingTime)}
                    </div>

                    <div
                      className="text-sm"
                      style={{ color: COLORS.cadetGray }}
                    >
                      {recordingTime < 120
                        ? `${120 - recordingTime}s remaining`
                        : "Maximum duration reached"}
                    </div>
                  </div>
                </div>

                {/* Recording Controls */}
                <div className="flex justify-center space-x-3 sm:space-x-4">
                  {!isPaused ? (
                    <Button
                      onClick={pauseRecording}
                      className="px-4 py-2 sm:px-6 sm:py-3 text-sm font-semibold rounded-full transition-all"
                      style={{
                        background: "#fbbf24",
                        color: COLORS.midnightGreen,
                      }}
                    >
                      <Pause className="w-4 h-4 mr-2" /> Pause
                    </Button>
                  ) : (
                    <Button
                      onClick={resumeRecording}
                      className="px-4 py-2 sm:px-6 sm:py-3 text-sm font-semibold rounded-full transition-all"
                      style={{
                        background: COLORS.teaGreen,
                        color: COLORS.midnightGreen,
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" /> Resume
                    </Button>
                  )}
                  <Button
                    onClick={stopRecording}
                    className="px-4 py-2 sm:px-6 sm:py-3 text-sm font-semibold rounded-full transition-all"
                    style={{
                      background: "#ef4444",
                      color: "white",
                    }}
                  >
                    <Square className="w-4 h-4 mr-2" /> Stop
                  </Button>
                </div>

                {/* Recording Tips */}
                <div
                  className="mt-4 p-3 rounded-lg max-w-md mx-auto"
                  style={{
                    background: `${COLORS.teaGreen}10`,
                    border: `1px solid ${COLORS.teaGreen}20`,
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Mic
                      className="w-4 h-4"
                      style={{ color: COLORS.teaGreen }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: COLORS.teaGreen }}
                    >
                      {isPaused
                        ? "Recording paused - click Resume to continue"
                        : "Recording active - speak clearly"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && audioUrl && (
            <div
              className="p-8 rounded-xl"
              style={{
                background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`,
                border: `1px solid ${COLORS.cadetGray}20`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 8px 32px 0 ${COLORS.midnightGreen}50`,
              }}
            >
              <div className="text-center mb-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: COLORS.teaGreen,
                  }}
                >
                  <CheckCircle
                    className="w-8 h-8"
                    style={{ color: COLORS.midnightGreen }}
                  />
                </div>
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{ color: COLORS.nyanza }}
                >
                  Review Your Recording
                </h2>
                <p style={{ color: COLORS.cadetGray }}>
                  Listen to your recording and choose to submit or record again
                </p>
              </div>

              <div
                className="p-6 rounded-lg mb-8"
                style={{ background: `${COLORS.midnightGreen}30` }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Volume2
                    className="w-5 h-5"
                    style={{ color: COLORS.teaGreen }}
                  />
                  <span style={{ color: COLORS.cadetGray }}>
                    Duration: {formatTime(recordingTime)}
                  </span>
                </div>
                <audio controls src={audioUrl} className="w-full" />
              </div>

              <div className="flex justify-center space-x-4 flex-wrap gap-2">
                <Button
                  onClick={handleRecordAgain}
                  variant="outline"
                  className="px-6 py-3 font-semibold rounded-full transition-all"
                  style={{
                    border: `1px solid ${COLORS.cadetGray}80`,
                    color: COLORS.cadetGray,
                    background: `${COLORS.midnightGreen}30`,
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Record Again
                </Button>
                <Button
                  onClick={downloadAudio}
                  variant="outline"
                  className="px-6 py-3 font-semibold rounded-full transition-all"
                  style={{
                    border: `1px solid ${COLORS.cadetGray}80`,
                    color: COLORS.cadetGray,
                    background: `${COLORS.midnightGreen}30`,
                  }}
                >
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="px-6 py-3 font-semibold rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  style={{
                    background: COLORS.teaGreen,
                    color: COLORS.midnightGreen,
                  }}
                >
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
                  <div
                    className="rounded-full h-2"
                    style={{ background: `${COLORS.midnightGreen}30` }}
                  >
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${uploadProgress}%`,
                        background: COLORS.teaGreen,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 7: Success */}
          {step === 7 && (
            <div
              className="p-8 rounded-xl text-center"
              style={{
                background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`,
                border: `1px solid ${COLORS.cadetGray}20`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 8px 32px 0 ${COLORS.midnightGreen}50`,
              }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{
                  background: COLORS.teaGreen,
                }}
              >
                <CheckCircle
                  className="w-10 h-10"
                  style={{ color: COLORS.midnightGreen }}
                />
              </div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: COLORS.nyanza }}
              >
                Audio Uploaded Successfully!
              </h2>
              <p
                className="text-lg mb-8 leading-relaxed"
                style={{ color: COLORS.cadetGray }}
              >
                Your voice contribution has been uploaded and will be evaluated
                soon. 🎉
                <br />
                Check your dashboard in a few minutes to see your updated tokens
                and status.
                <br />
                You're helping build more inclusive AI systems for everyone.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div
                  className="p-4 rounded-lg"
                  style={{ background: `${COLORS.midnightGreen}30` }}
                >
                  <h3
                    className="font-semibold mb-2"
                    style={{ color: COLORS.nyanza }}
                  >
                    Recording Info
                  </h3>
                  <p style={{ color: COLORS.cadetGray }}>
                    {language} / {domain}
                  </p>
                  <p className="mt-1" style={{ color: COLORS.cadetGray }}>
                    Duration: {formatTime(recordingTime)}
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg"
                  style={{ background: `${COLORS.midnightGreen}30` }}
                >
                  <h3
                    className="font-semibold mb-2"
                    style={{ color: COLORS.nyanza }}
                  >
                    Contribution ID
                  </h3>
                  <p
                    className="font-mono text-sm"
                    style={{ color: COLORS.cadetGray }}
                  >
                    #{Math.random().toString(36).substring(2, 9).toUpperCase()}
                  </p>
                </div>
              </div>
              <Button
                onClick={resetFlow}
                className="px-8 py-3 font-semibold rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  background: COLORS.teaGreen,
                  color: COLORS.midnightGreen,
                }}
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
