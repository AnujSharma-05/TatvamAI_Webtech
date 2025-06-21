import { useState } from 'react';
import { MotionDiv } from '../components/MotionProvider';

const QR = () => {
  const [qrData, setQrData] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = () => {
    setIsScanning(true);
    // Implement QR scanning logic here
  };

  const stopScanning = () => {
    setIsScanning(false);
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
            {isScanning ? (
              <div className="aspect-w-4 aspect-h-3 bg-slate-700 rounded-lg mb-6">
                {/* QR Scanner component would go here */}
                <div className="flex items-center justify-center">
                  <div className="animate-pulse text-slate-400">
                    Camera feed loading...
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-w-4 aspect-h-3 bg-slate-700 rounded-lg mb-6 flex items-center justify-center">
                <div className="text-slate-400">
                  Click "Start Scanning" to begin
                </div>
              </div>
            )}

            <button
              onClick={isScanning ? stopScanning : startScanning}
              className={`w-full px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                isScanning
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105'
              }`}
            >
              {isScanning ? 'Stop Scanning' : 'Start Scanning'}
            </button>
          </div>

          {qrData && (
            <MotionDiv
              className="bg-green-500/10 text-green-400 p-4 rounded-lg"
              delay={200}
            >
              <p className="font-medium">QR Code Detected!</p>
              <p className="text-sm mt-2">{qrData}</p>
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
        </MotionDiv>
      </div>
    </div>
  );
};

export default QR; 