import { MotionCard } from '../components/MotionProvider';

const Dashboard = () => {
  const stats = [
    { label: 'Total Recordings', value: '156' },
    { label: 'Hours Contributed', value: '12.5' },
    { label: 'Languages', value: '3' },
    { label: 'Earnings', value: '₹3,250' },
  ];

  const recentRecordings = [
    { id: 1, text: 'नमस्ते, मैं हिंदी बोल रहा हूं', language: 'Hindi', date: '2024-03-15', status: 'Approved' },
    { id: 2, text: 'வணக்கம், நான் தமிழ் பேசுகிறேன்', language: 'Tamil', date: '2024-03-14', status: 'Pending' },
    { id: 3, text: 'నమస్కారం, నేను తెలుగు మాట్లాడుతున్నాను', language: 'Telugu', date: '2024-03-13', status: 'Approved' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            <p className="text-slate-300">Welcome back! Here's your contribution summary.</p>
          </div>
          <button className="mt-4 lg:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
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

        {/* Recent Recordings */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Recent Recordings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-700">
                  <th className="pb-4">Text</th>
                  <th className="pb-4">Language</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRecordings.map((recording) => (
                  <tr key={recording.id} className="border-b border-slate-700">
                    <td className="py-4">{recording.text}</td>
                    <td className="py-4">{recording.language}</td>
                    <td className="py-4">{recording.date}</td>
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