import React, { useState, useEffect } from 'react';
import { color, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { COLORS } from '@/config/theme';
import { ListChecks, Clock, Languages, Coins, Plus } from 'lucide-react';

// --- Main Dashboard Component ---
const Dashboard = () => {
  const navigate = useNavigate();
  
  // --- ALL STATE AND LOGIC REMAINS UNCHANGED ---
  const [recordings, setRecordings] = useState([]);
  const [incentives, setIncentives] = useState([]);
  const [stats, setStats] = useState({ totalRecordings: 0, minsContributed: 0, languages: 0, totalTokens: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecordings = () => axios.get('/users/recordings').then(res => res.data.data);
    const fetchContributionStats = () => axios.get('/users/contribution-stats').then(res => res.data.data);
    const fetchIncentives = () => axios.get('/users/incentives').then(res => res.data.data);

    const secondsToMinutes = (seconds) => {
        if (!seconds || seconds === 0) return 0;
        return Math.round(seconds / 60);
    };

    const calculateStats = (recordingsData, contributionData, incentivesData) => {
        const totalRecordings = contributionData.totalRecordings || recordingsData.length;
        const totalSecondsContributed = recordingsData.reduce((sum, r) => sum + (r.duration || 0), 0);
        const minsContributed = secondsToMinutes(totalSecondsContributed);
        const uniqueLanguages = new Set(recordingsData.map(r => r.language)).size;
        return {
            totalRecordings,
            minsContributed,
            languages: uniqueLanguages,
            totalTokens: incentivesData.totalTokens || 0
        };
    };

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [recordingsData, contributionData, incentivesResponse] = await Promise.all([
          fetchRecordings(),
          fetchContributionStats(),
          fetchIncentives()
        ]);
        setRecordings(recordingsData);
        setIncentives(incentivesResponse.tokens || []);
        const calculatedStats = calculateStats(recordingsData, contributionData, incentivesResponse);
        setStats(calculatedStats);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const secondsToMMSS = (seconds) => {
    if (!seconds || seconds === 0) return '0:00';
    return `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}`;
  };
  const getTokensForRecording = (recordingId) => {
    const tokenDoc = incentives.find((t) => t.recordingId?.toString() === recordingId?.toString());
    return tokenDoc ? tokenDoc.amount : '--';
  };

  if (loading) {
    return (
      <div style={{ background: 'transparent' }} className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: COLORS.teaGreen}}></div>
          <p style={{color: COLORS.cadetGray}}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: 'transparent' }} className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md p-8 rounded-2xl" style={{background: `linear-gradient(145deg, #ff000010, #ff000005)`, border: `1px solid #ff000020`}}>
          <p className="text-red-400 mb-4 font-semibold">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 text-lg font-semibold rounded-full transition-all group" style={{ background: COLORS.teaGreen, color: COLORS.midnightGreen }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statsArray = [
    { label: 'Total Recordings', value: stats.totalRecordings, icon: <ListChecks size={24} /> },
    { label: 'Minutes Contributed', value: stats.minsContributed, icon: <Clock size={24} /> },
    { label: 'Languages', value: stats.languages, icon: <Languages size={24} /> },
    { label: 'Total Tokens', value: stats.totalTokens, icon: <Coins size={24} /> },
  ];

  return (
    <div style={{ background: 'transparent' }} className="relative min-h-screen p-8 md:p-16 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto my-10">
        
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between md:items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <h1 className="text-5xl font-extrabold" style={{ color: COLORS.nyanza }}>Dashboard</h1>
            <p className="text-lg mt-2" style={{ color: COLORS.cadetGray }}>Welcome back! Here's your contribution summary.</p>
          </div>
          <button onClick={() => navigate('/qr-recording')} className="mt-6 md:mt-0 inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full transition-all group" style={{ background: COLORS.teaGreen, color: COLORS.midnightGreen }}>
            <Plus className="w-5 h-5 mr-2" />
            New Recording
          </button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsArray.map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="p-6 rounded-2xl"
              style={{ background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`, border: `1px solid ${COLORS.cadetGray}20` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium" style={{ color: COLORS.cadetGray }}>{stat.label}</p>
                <span style={{ color: COLORS.teaGreen }}>{stat.icon}</span>
              </div>
              <p className="text-4xl font-bold" style={{ color: COLORS.nyanza }}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Recordings List */}
        <motion.div 
          className="p-6 md:p-8 rounded-2xl"
          style={{ background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`, border: `1px solid ${COLORS.cadetGray}20` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.nyanza }}>Recent Recordings</h2>
          {recordings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg mb-6" style={{ color: COLORS.cadetGray }}>You haven't made any recordings yet.</p>
              <button onClick={() => navigate('/qr-recording')} className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full transition-all group" style={{ background: COLORS.teaGreen, color: COLORS.midnightGreen }}>
                Make Your First Recording
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-7 gap-4 px-4 py-2 text-xs font-bold uppercase" style={{color: COLORS.cadetGray}}>
                <div className="col-span-1">Domain</div>
                <div className="col-span-1">Language</div>
                <div className="col-span-1">Source</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1 text-center">Duration</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-1 text-right">Tokens</div>
              </div>
              {/* Table Body */}
              {recordings.map((rec: any, index) => (
                <motion.div 
                  key={rec._id}
                  className="grid grid-cols-2 md:grid-cols-7 gap-4 items-center p-4 rounded-lg"
                  style={{ background: `${COLORS.midnightGreen}30` }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.05 }}
                >
                  <div className="md:col-span-1"><span className="md:hidden font-bold text-xs uppercase" style={{color: COLORS.cadetGray}}>Domain: </span>{rec.domain}</div>
                  <div className="md:col-span-1"><span className="md:hidden font-bold text-xs uppercase" style={{color: COLORS.cadetGray}}>Language: </span>{rec.language}</div>
                  <div className="md:col-span-1 capitalize"><span className="md:hidden font-bold text-xs uppercase" style={{color: COLORS.cadetGray}}>Source: </span>{rec.recordedVia}</div>
                  <div className="md:col-span-1"><span className="md:hidden font-bold text-xs uppercase" style={{color: COLORS.cadetGray}}>Date: </span>{formatDate(rec.createdAt)}</div>
                  <div className="md:col-span-1 text-left md:text-center"><span className="md:hidden font-bold text-xs uppercase" style={{color: COLORS.cadetGray}}>Duration: </span>{secondsToMMSS(rec.duration)}</div>
                  <div className="md:col-span-1 text-left md:text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{background: `${COLORS.teaGreen}10`, color: COLORS.teaGreen}}>Pending</span>
                  </div>
                  <div className="md:col-span-1 text-left md:text-right font-bold" style={{color: COLORS.nyanza}}><span className="md:hidden font-bold text-xs uppercase" style={{color: COLORS.cadetGray}}>Tokens: </span>{getTokensForRecording(rec._id)}</div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;