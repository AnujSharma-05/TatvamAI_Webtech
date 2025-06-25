import { MotionCard } from '../components/MotionProvider';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const navigate = useNavigate();

  const recentRecordings = [
    {
      id: 1,
      text: 'नमस्ते, मैं हिंदी बोल रहा हूं',
      domain: 'Healthcare',
      language: 'Hindi',
      date: '2024-03-15',
      status: 'Approved',
      tokens: 80
    },
    {
      id: 2,
      text: 'வணக்கம், நான் தமிழ் பேசுகிறேன்',
      domain: 'Retail',
      language: 'Tamil',
      date: '2024-03-14',
      status: 'Pending',
      tokens: 0
    },
    {
      id: 3,
      text: 'నమస్కారం, నేను తెలుగు మాట్లాడుతున్నాను',
      domain: 'Finance',
      language: 'Telugu',
      date: '2024-03-13',
      status: 'Approved',
      tokens: 72
    },
    {
      id: 4,
      text: 'Hello, I am speaking in English.',
      domain: 'Education',
      language: 'English',
      date: '2024-03-12',
      status: 'Approved',
      tokens: 60
    },
    {
      id: 5,
      text: 'હેલો, હું ગુજરાતીમાં બોલી રહ્યો છું',
      domain: 'Legal',
      language: 'Gujarati',
      date: '2024-03-11',
      status: 'Approved',
      tokens: 55
    },
    {
      id: 6,
      text: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ਪੰਜਾਬੀ ਬੋਲ ਰਿਹਾ ਹਾਂ',
      domain: 'Transportation',
      language: 'Punjabi',
      date: '2024-03-10',
      status: 'Pending',
      tokens: 0
    },
    {
      id: 7,
      text: 'ନମସ୍କାର, ମୁଁ ଓଡ଼ିଆ କଥା ହେଉଛି',
      domain: 'Healthcare',
      language: 'Odia',
      date: '2024-03-09',
      status: 'Approved',
      tokens: 90
    },
    {
      id: 8,
      text: 'ನಮಸ್ಕಾರ, ನಾನು ಕನ್ನಡ ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ',
      domain: 'Retail',
      language: 'Kannada',
      date: '2024-03-08',
      status: 'Approved',
      tokens: 66
    },
    {
      id: 9,
      text: 'হ্যালো, আমি বাংলা বলছি',
      domain: 'Education',
      language: 'Bengali',
      date: '2024-03-07',
      status: 'Pending',
      tokens: 0
    },
    {
      id: 10,
      text: 'ഹലോ, ഞാൻ മലയാളം സംസാരിക്കുന്നു',
      domain: 'Legal',
      language: 'Malayalam',
      date: '2024-03-06',
      status: 'Approved',
      tokens: 78
    },
  ];

  // Derived Stats
  const totalRecordings = recentRecordings.length;
  const minsContributed = totalRecordings * 2;
  const uniqueLanguages = new Set(recentRecordings.map(r => r.language)).size;
  const totalTokens = recentRecordings
    .filter(r => r.status === 'Approved')
    .reduce((sum, r) => sum + r.tokens, 0);

  const stats = [
    { label: 'Total Recordings', value: totalRecordings.toString() },
    { label: 'Mins Contributed', value: minsContributed.toString() },
    { label: 'Languages', value: uniqueLanguages.toString() },
    { label: 'Tokens', value: totalTokens.toString() },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            <p className="text-slate-300">Welcome back! Here's your contribution summary.</p>
          </div>
          <button
            onClick={() => navigate('/qr-recording')}
            className="mt-4 lg:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            New Recording
          </button>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <MotionCard key={index} className="bg-slate-800 p-6 rounded-xl">
              <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </MotionCard>
          ))}
        </div>

        {/* Recent Recordings Table */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Recent Recordings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-700">
                  <th className="pb-4">Text</th>
                  <th className="pb-4">Domain</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Language</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Tokens Earned</th>
                </tr>
              </thead>
              <tbody>
                {recentRecordings.map((recording) => (
                  <tr key={recording.id} className="border-b border-slate-700">
                    <td className="py-4">{recording.text}</td>
                    <td className="py-4">{recording.domain}</td>
                    <td className="py-4">{recording.date}</td>
                    <td className="py-4">{recording.language}</td>
                    <td className="py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          recording.status === 'Approved'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}
                      >
                        {recording.status}
                      </span>
                    </td>
                    <td className="py-4">
                      {recording.status === 'Approved' ? recording.tokens : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
