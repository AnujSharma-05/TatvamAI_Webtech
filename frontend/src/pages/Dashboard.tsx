import { MotionCard } from '../components/MotionProvider';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../config/axios'; // Adjust the import path as necessary

const Dashboard = () => {
  const navigate = useNavigate();
  const [recordings, setRecordings] = useState([]);
  const [incentives, setIncentives] = useState([]);
  const [stats, setStats] = useState({
    totalRecordings: 0,
    minsContributed: 0,
    languages: 0,
    totalTokens: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user recordings
  const fetchRecordings = async () => {
    try {
      const response = await axios.get('/users/recordings');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recordings:', error);
      throw error;
    }
  };

  // Fetch contribution stats
  const fetchContributionStats = async () => {
    try {
      const response = await axios.get('/users/contribution-stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching contribution stats:', error);
      throw error;
    }
  };

  // Fetch total tokens and incentives
  const fetchIncentives = async () => {
    try {
      const response = await axios.get('/users/incentives');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching incentives:', error);
      throw error;
    }
  };

  // Convert seconds to minutes with proper formatting
  const secondsToMinutes = (seconds) => {
    if (!seconds || seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate derived stats from recordings and incentives
  const calculateStats = (recordingsData, contributionData, incentivesData) => {
    const totalRecordings = contributionData.totalRecordings || recordingsData.length;

    const totalSecondsContributed = recordingsData.reduce((sum, recording) => {
      return sum + (recording.duration || 0);
    }, 0);
    const minsContributed = Math.round(totalSecondsContributed / 60);

    const uniqueLanguages = new Set(recordingsData.map(r => r.language)).size;

    const totalTokens = incentivesData.reduce((sum, tokenDoc) => {
      return sum + (tokenDoc.amount || 0);
    }, 0);

    return {
      totalRecordings,
      minsContributed,
      languages: uniqueLanguages,
      totalTokens
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [recordingsData, contributionData, incentivesData] = await Promise.all([
          fetchRecordings(),
          fetchContributionStats(),
          fetchIncentives()
        ]);

        setRecordings(recordingsData);
        setIncentives(incentivesData);
        const calculatedStats = calculateStats(recordingsData, contributionData, incentivesData);
        setStats(calculatedStats);

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const statsArray = [
    { label: 'Total Recordings', value: stats.totalRecordings.toString() },
    { label: 'Mins Contributed', value: stats.minsContributed.toString() },
    { label: 'Languages', value: stats.languages.toString() },
    { label: 'Tokens', value: stats.totalTokens.toString() },
  ];

  const getTokensForRecording = (recordingId) => {
    const tokenDoc = incentives.find((t) => t.recordingId === recordingId);
    return tokenDoc ? tokenDoc.amount : '--';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">⚠️</div>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsArray.map((stat, index) => (
            <MotionCard key={index} className="bg-slate-800 p-6 rounded-xl">
              <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </MotionCard>
          ))}
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Recent Recordings</h2>
          {recordings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">No recordings found. Start by making your first recording!</p>
              <button
                onClick={() => navigate('/qr-recording')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Make First Recording
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-700">
                    <th className="pb-4">Domain</th>
                    <th className="pb-4">Language</th>
                    <th className="pb-4">Recorded Via</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Duration</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Tokens Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {recordings.map((recording) => (
                    <tr key={recording._id} className="border-b border-slate-700">
                      <td className="py-4">{recording.domain}</td>
                      <td className="py-4">{recording.language}</td>
                      <td className="py-4 capitalize">{recording.recordedVia}</td>
                      <td className="py-4">{formatDate(recording.createdAt)}</td>
                      <td className="py-4">{secondsToMinutes(recording.duration)}</td>
                      <td className="py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-sm bg-yellow-500/10 text-yellow-400">
                          Pending
                        </span>
                      </td>
                      <td className="py-4">{getTokensForRecording(recording._id)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
