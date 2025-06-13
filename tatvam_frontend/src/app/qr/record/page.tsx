// import { RecordingTimer } from '@/components/RecordingTimer';

export default function QRRecordPage() {
  const handleRecordingComplete = async () => {
    // Handle the recording completion
    console.log('Recording completed');
  };

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Voice Recording Session</h1>
      
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Please speak clearly and at a normal pace</li>
            <li>Stay in a quiet environment</li>
            <li>Keep the microphone at a consistent distance</li>
            <li>Recording will automatically stop after 2 minutes</li>
          </ul>
        </div>

        {/* <RecordingTimer 
          maxDuration={120} 
          onComplete={handleRecordingComplete}
        /> */}
      </div>
    </main>
  );
} 