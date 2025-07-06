import { useState, useRef, useEffect, useCallback } from 'react';
import { MotionDiv } from '../components/MotionProvider';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';

const QR = () => {
  const [qrData, setQrData] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // Check camera permission status
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if ('permissions' in navigator) {
          const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          setCameraPermission(permission.state);
          
          permission.onchange = () => {
            setCameraPermission(permission.state);
          };
        }
      } catch (err) {
        console.log('Permission API not supported, will check on getUserMedia');
      }
    };
    
    checkPermission();
  }, []);

  // Enhanced cleanup function
  const forceStopScanning = useCallback(() => {
    console.log('Force stopping QR scanner...');
    
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop video element
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    // Stop all media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      streamRef.current = null;
    }

    setIsScanning(false);
    setError('');
  }, []);

  // Enhanced scanning effect with better cleanup
  useEffect(() => {
    const scan = () => {
      if (
        videoRef.current &&
        canvasRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
      ) {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          setQrData(code.data);
          forceStopScanning(); // Use enhanced stop function
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(scan);
    };

    if (isScanning) {
      scan();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isScanning, forceStopScanning]);

  // Handle page visibility changes (tab switching, minimizing)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isScanning) {
        console.log('Page hidden, stopping scanner');
        forceStopScanning();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isScanning, forceStopScanning]);

  // Handle beforeunload (page refresh, tab close, navigation)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isScanning) {
        forceStopScanning();
        // Optional: Show confirmation dialog
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isScanning, forceStopScanning]);

  // Handle component unmount (React Router navigation)
  useEffect(() => {
    return () => {
      console.log('QR component unmounting, cleaning up...');
      forceStopScanning();
    };
  }, [forceStopScanning]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (isScanning) {
        console.log('Navigation detected, stopping scanner');
        forceStopScanning();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isScanning, forceStopScanning]);

  // Enhanced camera initialization with multiple fallback strategies
  const startScanning = async () => {
    try {
      setError('');
      setIsScanning(true);
      
      // Strategy 1: Try rear camera with high quality
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          aspectRatio: { ideal: 16/9 }
        }
      };

      let stream: MediaStream;
      
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        console.log('Rear camera failed, trying front camera...');
        
        // Strategy 2: Try front camera
        const frontCameraConstraints = {
          video: {
            facingMode: { ideal: 'user' },
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 }
          }
        };
        
        try {
          stream = await navigator.mediaDevices.getUserMedia(frontCameraConstraints);
        } catch (err2) {
          console.log('Front camera failed, trying basic constraints...');
          
          // Strategy 3: Try basic video constraints
          const basicConstraints = {
            video: true
          };
          
          try {
            stream = await navigator.mediaDevices.getUserMedia(basicConstraints);
          } catch (err3) {
            // Strategy 4: Try with audio (some devices require this)
            const audioVideoConstraints = {
              audio: false,
              video: {
                width: { ideal: 640 },
                height: { ideal: 480 }
              }
            };
            
            stream = await navigator.mediaDevices.getUserMedia(audioVideoConstraints);
          }
        }
      }

      streamRef.current = stream;
      setCameraPermission('granted');

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise((resolve, reject) => {
          video.onloadedmetadata = () => {
            console.log('Video metadata loaded:', {
              videoWidth: video.videoWidth,
              videoHeight: video.videoHeight,
              readyState: video.readyState
            });
            resolve(true);
          };
          
          video.onerror = (e) => {
            console.error('Video error:', e);
            reject(new Error('Video loading failed'));
          };
          
          // Timeout after 10 seconds
          setTimeout(() => {
            reject(new Error('Video loading timeout'));
          }, 10000);
        });

        // Start playing the video
        try {
          await video.play();
          console.log('Video playback started successfully');
        } catch (playError) {
          console.error('Error playing video:', playError);
          setError('Failed to start video playback. Please try again.');
          forceStopScanning();
          return;
        }
      }

    } catch (err) {
      console.error('Error accessing camera:', err);
      setIsScanning(false);
      
      let errorMessage = 'Could not access camera. ';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage += 'Camera access was denied. Please allow camera access in your browser settings and try again.';
          setCameraPermission('denied');
        } else if (err.name === 'NotFoundError') {
          errorMessage += 'No camera found. Please connect a camera and try again.';
        } else if (err.name === 'NotSupportedError') {
          errorMessage += 'Camera not supported in this browser. Please try a different browser.';
        } else if (err.name === 'NotReadableError') {
          errorMessage += 'Camera is already in use by another application. Please close other camera apps and try again.';
        } else if (err.name === 'OverconstrainedError') {
          errorMessage += 'Camera does not meet the required specifications. Please try a different camera.';
        } else if (err.name === 'TypeError') {
          errorMessage += 'Invalid camera constraints. Please refresh the page and try again.';
        } else {
          errorMessage += err.message;
        }
      } else {
        errorMessage += 'Unknown error occurred. Please try again.';
      }
      
      setError(errorMessage);
    }
  };

  const stopScanning = () => {
    forceStopScanning();
  };

  // Enhanced navigation with cleanup
  const handleNavigateToRecording = () => {
    if (isScanning) {
      forceStopScanning();
    }
    navigate('/qr-recording');
  };

  // Handle camera permission reset
  const handleResetPermission = () => {
    setError('');
    setCameraPermission('unknown');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <MotionDiv className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">QR Scanner</h1>
          <p className="text-xl text-slate-300 mb-12">
            Scan QR codes to quickly access voice recording tasks and contribute to our dataset.
          </p>

          <div className="bg-slate-800 p-8 rounded-xl mb-8">
            <div className="aspect-w-4 aspect-h-3 bg-black rounded-lg mb-6 overflow-hidden relative">
              {isScanning ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                    autoPlay
                    onError={(e) => {
                      console.error('Video error:', e);
                      setError('Video playback error');
                    }}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg">
                    <div className="absolute top-4 left-4 text-blue-400 text-sm font-medium">
                      Scanning...
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  {cameraPermission === 'denied' ? (
                    <div className="text-center">
                      <p className="mb-2">Camera access denied</p>
                      <p className="text-sm">Please allow camera access in your browser settings</p>
                    </div>
                  ) : (
                    'Click "Start Scanning" to begin'
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm">
                <p className="mb-2">{error}</p>
                {cameraPermission === 'denied' && (
                  <button
                    onClick={handleResetPermission}
                    className="text-red-300 hover:text-red-100 underline text-xs"
                  >
                    Reset Permission
                  </button>
                )}
              </div>
            )}

            <button
              onClick={isScanning ? stopScanning : startScanning}
              disabled={!!error && cameraPermission === 'denied'}
              className={`w-full px-6 py-3 font-semibold rounded-xl transition-all duration-300 mb-4 disabled:opacity-50 disabled:cursor-not-allowed ${
                isScanning
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-lg hover:scale-105'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105'
              }`}
            >
              {isScanning ? 'Stop Scanning' : 'Start Scanning'}
            </button>

            {/* Enhanced navigation button with cleanup */}
            <Button
              onClick={handleNavigateToRecording}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition-all duration-300"
            >
              Start Voice Contribution
            </Button>
          </div>

          {qrData && (
            <MotionDiv
              className="bg-green-500/10 text-green-400 p-4 rounded-lg"
              delay={200}
            >
              <p className="font-medium">QR Code Detected!</p>
              <p className="text-sm mt-2 break-all">{qrData}</p>
              <button
                onClick={() => setQrData('')}
                className="mt-2 text-xs text-green-300 hover:text-green-100 underline"
              >
                Clear Result
              </button>
            </MotionDiv>
          )}

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">How to Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-6 bg-slate-800 rounded-xl">
                <div className="text-2xl mb-4">1️⃣</div>
                <h3 className="font-bold mb-2">Find a QR Code</h3>
                <p className="text-slate-300">Locate a TatvamAI QR code in your task materials.</p>
              </div>
              <div className="p-6 bg-slate-800 rounded-xl">
                <div className="text-2xl mb-4">2️⃣</div>
                <h3 className="font-bold mb-2">Scan It</h3>
                <p className="text-slate-300">Click "Start Scanning" and point your camera at the QR code.</p>
              </div>
              <div className="p-6 bg-slate-800 rounded-xl">
                <div className="text-2xl mb-4">3️⃣</div>
                <h3 className="font-bold mb-2">Start Recording</h3>
                <p className="text-slate-300">Follow the instructions to complete your voice recording task.</p>
              </div>
            </div>
          </div>

          {/* Debug info (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-slate-800 rounded-lg text-left text-sm">
              <h3 className="font-bold mb-2">Debug Info:</h3>
              <p>Scanning: {isScanning ? 'Yes' : 'No'}</p>
              <p>Stream Active: {streamRef.current ? 'Yes' : 'No'}</p>
              <p>Animation Frame: {animationFrameRef.current ? 'Active' : 'Inactive'}</p>
              <p>Camera Permission: {cameraPermission}</p>
            </div>
          )}
        </MotionDiv>
      </div>
    </div>
  );
};

export default QR;
