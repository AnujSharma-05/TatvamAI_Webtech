import { useState } from 'react';
import { RecordingTimer } from '../components/RecordingTimer';
import { MotionDiv } from '../components/MotionProvider';

const Demo = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [recordingComplete, setRecordingComplete] = useState(false);

  const languages = [
    { id: 'hindi', name: 'Hindi' },
    { id: 'tamil', name: 'Tamil' },
    { id: 'telugu', name: 'Telugu' },
    { id: 'kannada', name: 'Kannada' },
    { id: 'malayalam', name: 'Malayalam' },
    { id: 'bengali', name: 'Bengali' },
  ];

  const handleRecordingComplete = () => {
    setRecordingComplete(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <MotionDiv className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">Try Our Voice Technology</h1>
          <p className="text-xl text-slate-300 mb-12">
            Experience our voice technology firsthand. Select a language and record your voice to see it in action.
          </p>

          <div className="mb-12">
            <label htmlFor="language" className="block text-sm font-medium mb-2">
              Select Language
            </label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full max-w-xs px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-800 p-8 rounded-xl mb-12">
            <RecordingTimer maxDuration={30} onComplete={handleRecordingComplete} />
          </div>

          {recordingComplete && (
            <MotionDiv
              className="bg-green-500/10 text-green-400 p-4 rounded-lg"
              delay={200}
            >
              Recording complete! Our AI is processing your voice...
            </MotionDiv>
          )}
        </MotionDiv>
      </div>
    </div>
  );
};

export default Demo; 