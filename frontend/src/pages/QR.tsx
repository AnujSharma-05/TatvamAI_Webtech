import { useState, useRef, useEffect, useCallback } from 'react';
import { MotionDiv } from '../components/MotionProvider';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

const QR = () => {
  const [qrData, setQrData] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const mobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(mobile);
      // Set rear camera for mobile, front camera for desktop
      setFacingMode(mobile ? 'environment' : 'user');
    };
    checkMobile();
  }, []);

  // Simple QR code detection
  const detectQR = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);
    
    return code;
  }, []);

  // Enhanced cleanup function
  const forceStopScanning = useCallback(() => {
    console.log('Force stopping QR scanner...');
    
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setIsScanning(false);
    setError('');
  }, []);

  // Enhanced scanning effect
  useEffect(() => {
    const scan = () => {
      if (
        webcamRef.current &&
        canvasRef.current &&
        isScanning
      ) {
        const canvas = canvasRef.current;
        const video = webcamRef.current.video;

        if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
          // Set canvas size to match video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Draw current video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Detect QR code
          const code = detectQR(canvas);

          if (code) {
            setQrData(code.data);
            forceStopScanning();
            return;
          }
        }
      }

      if (isScanning) {
        animationFrameRef.current = requestAnimationFrame(scan);
      }
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
  }, [isScanning, forceStopScanning, detectQR]);

  // Handle page visibility changes
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

  // Handle beforeunload - stop camera when leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isScanning) {
        forceStopScanning();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isScanning, forceStopScanning]);

  // Handle component unmount
  useEffect(() => {
    return () => {
      console.log('QR component unmounting, cleaning up...');
      forceStopScanning();
    };
  }, [forceStopScanning]);

  const startScanning = () => {
    try {
      setError('');
      console.log('Starting camera...');
      setIsScanning(true);
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError('Failed to start camera');
    }
  };

  const stopScanning = () => {
    console.log('Stopping camera...');
    forceStopScanning();
  };

  // Enhanced navigation with cleanup
  const handleNavigateToRecording = () => {
    if (isScanning) {
      forceStopScanning();
    }
    navigate('/qr-recording');
  };

  // Handle webcam errors
  const handleWebcamError = (error: string | DOMException) => {
    console.error('Webcam error:', error);
    let errorMessage = 'Unknown camera error';
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof DOMException) {
      errorMessage = error.message;
    }
    
    // Provide more specific error messages
    if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
      errorMessage = 'Camera permission denied. Please allow camera access and try again.';
    } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('not found')) {
      errorMessage = 'No camera found on this device.';
    } else if (errorMessage.includes('NotSupportedError') || errorMessage.includes('not supported')) {
      errorMessage = 'Camera not supported on this device.';
    }
    
    setError(errorMessage);
    setIsScanning(false);
  };

  // Webcam video constraints
  const videoConstraints = {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: facingMode
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <MotionDiv className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">QR Scanner</h1>
          <p className="text-xl text-slate-300 mb-12">
            Scan QR codes to quickly access voice recording tasks and contribute to our dataset.
          </p>

          <div className="bg-slate-800 p-6 rounded-xl mb-8">
            {/* Camera preview area */}
            <div className="relative bg-black rounded-lg mb-6 overflow-hidden" style={{ aspectRatio: '4/3' }}>
              {isScanning ? (
                <>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    onUserMediaError={handleWebcamError}
                    className="w-full h-full object-cover"
                    style={{ transform: !isMobile && facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">
                      Scanning... {isMobile ? '📱 Rear Camera' : '💻 Front Camera'}
                    </div>
                    
                    {/* Scanning frame */}
                    <div className="absolute inset-8 border-2 border-white/50 rounded-lg">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="text-4xl mb-4">📷</div>
                  <p className="text-center">Click "Start Scanning" to begin</p>
                  <p className="text-sm text-slate-500 mt-2">
                    {isMobile ? 'Will use rear camera' : 'Will use front camera'}
                  </p>
                </div>
              )}
            </div>

            {/* Error display */}
            {error && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span className="font-medium">Error:</span>
                </div>
                <p className="mt-1 text-sm">{error}</p>
                <button
                  onClick={() => setError('')}
                  className="mt-2 text-xs text-red-300 hover:text-red-100 underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Control buttons */}
            <div className="space-y-3">
              {!isScanning ? (
                <button
                  onClick={startScanning}
                  disabled={!!error}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105 text-white px-6 py-3 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📷 Start Scanning
                </button>
              ) : (
                <button
                  onClick={stopScanning}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 font-semibold rounded-xl transition-all duration-300"
                >
                  ⏹️ Stop Scanning
                </button>
              )}

              <Button
                onClick={handleNavigateToRecording}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
              >
                🎤 Start Voice Contribution
              </Button>
            </div>
          </div>

          {/* QR Code result */}
          {qrData && (
            <div className="bg-green-500/10 text-green-400 p-4 rounded-lg mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span>✅</span>
                <span className="font-medium">QR Code Detected!</span>
              </div>
              <p className="text-sm mt-2 break-all bg-green-500/20 p-2 rounded">{qrData}</p>
              <button
                onClick={() => setQrData('')}
                className="mt-2 text-xs text-green-300 hover:text-green-100 underline"
              >
                Clear Result
              </button>
            </div>
          )}

          {/* Instructions */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">How to Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-800 rounded-xl">
                <div className="text-2xl mb-2">1️⃣</div>
                <h3 className="font-bold mb-2">Find QR Code</h3>
                <p className="text-slate-300 text-sm">Locate a TatvamAI QR code in your materials</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-xl">
                <div className="text-2xl mb-2">2️⃣</div>
                <h3 className="font-bold mb-2">Scan It</h3>
                <p className="text-slate-300 text-sm">Point your camera at the QR code</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-xl">
                <div className="text-2xl mb-2">3️⃣</div>
                <h3 className="font-bold mb-2">Record</h3>
                <p className="text-slate-300 text-sm">Complete your voice recording task</p>
              </div>
            </div>
          </div>

          {/* Debug info */}
          <div className="mt-8 p-4 bg-slate-800 rounded-lg text-sm">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <div className="grid grid-cols-2 gap-4 text-slate-300">
              <div>
                <p>Device: {isMobile ? 'Mobile' : 'Desktop'}</p>
                <p>Scanning: {isScanning ? 'Active' : 'Inactive'}</p>
              </div>
              <div>
                <p>Camera: {facingMode === 'environment' ? 'Rear' : 'Front'}</p>
                <p>Animation: {animationFrameRef.current ? 'Running' : 'Stopped'}</p>
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};

export default QR;