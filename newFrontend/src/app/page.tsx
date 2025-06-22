import Hero from './components/Hero';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              TatvamAI
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-slate-300 hover:text-blue-400 transition-colors">Dashboard</Link>
              <Link href="/contributor" className="text-slate-300 hover:text-blue-400 transition-colors">Contribute</Link>
              <Link href="/products" className="text-slate-300 hover:text-blue-400 transition-colors">Products</Link>
              <Link href="/about" className="text-slate-300 hover:text-blue-400 transition-colors">About</Link>
            </nav>
            <Link href="/auth/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero />

      {/* Main Content - Three Column Layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar - Language Categories */}
          <aside className="lg:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-blue-400 mb-6">Voice Categories</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🇮🇳</span>
                    <span>Hindi</span>
                  </span>
                  <span className="text-sm text-slate-400">2.3k</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🇧🇩</span>
                    <span>Bengali</span>
                  </span>
                  <span className="text-sm text-slate-400">1.8k</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🇹🇳</span>
                    <span>Tamil</span>
                  </span>
                  <span className="text-sm text-slate-400">1.5k</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🇹🇪</span>
                    <span>Telugu</span>
                  </span>
                  <span className="text-sm text-slate-400">1.2k</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🇬🇯</span>
                    <span>Gujarati</span>
                  </span>
                  <span className="text-sm text-slate-400">956</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🇵🇰</span>
                    <span>Punjabi</span>
                  </span>
                  <span className="text-sm text-slate-400">1.1k</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🇰🇦</span>
                    <span>Kannada</span>
                  </span>
                  <span className="text-sm text-slate-400">892</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-2 space-y-6">
            
            {/* Compose Box */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <textarea
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-400 resize-none"
                rows={4}
                placeholder="Share your voice recording experience or contribute to Indian language technology..."
              ></textarea>
              <div className="flex justify-between items-center mt-4">
                <select className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg">
                  <option>🎤 Voice Recording</option>
                  <option>🗣️ Language Learning</option>
                  <option>💬 Conversation</option>
                  <option>📚 Educational</option>
                  <option>🎵 Music & Songs</option>
                  <option>📖 Storytelling</option>
                </select>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                  Share Voice
                </button>
              </div>
            </div>

            {/* Voice Post Cards */}
            <article className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl">
                  🎤
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">Priya Sharma</div>
                  <div className="text-sm text-slate-400">Hindi Contributor • 127 recordings</div>
                </div>
                <div className="text-sm text-slate-500">2h ago</div>
              </div>
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm inline-block mb-3">
                🎤 Voice Recording
              </div>
              <div className="text-slate-300 mb-4 leading-relaxed">
                Just completed my 50th Hindi voice recording session! The quality is getting better with each recording. 
                Love contributing to make technology more accessible for Hindi speakers. 🇮🇳
              </div>
              <div className="flex gap-6 pt-4 border-t border-slate-700">
                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <span>👏</span>
                  <span>Support (234)</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <span>💬</span>
                  <span>Comment (89)</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <span>🔊</span>
                  <span>Listen (12)</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <span>📤</span>
                  <span>Share</span>
                </button>
              </div>
            </article>

            <article className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-xl">
                  🗣️
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">Rajesh Kumar</div>
                  <div className="text-sm text-slate-400">Bengali Expert • 89 recordings</div>
                </div>
                <div className="text-sm text-slate-500">4h ago</div>
              </div>
              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm inline-block mb-3">
                🗣️ Language Learning
              </div>
              <div className="text-slate-300 mb-4 leading-relaxed">
                Recorded traditional Bengali folk songs today. The dialect variations are fascinating! 
                Helping preserve our cultural heritage through voice technology. 🎵
              </div>
              <div className="flex gap-6 pt-4 border-t border-slate-700">
                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <span>👏</span>
                  <span>Support (567)</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <span>💬</span>
                  <span>Comment (201)</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <span>🔊</span>
                  <span>Listen (45)</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <span>📤</span>
                  <span>Share</span>
                </button>
              </div>
            </article>

            <article className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-xl">
                  📚
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">Anjali Patel</div>
                  <div className="text-sm text-slate-400">Tamil Teacher • 156 recordings</div>
                </div>
                <div className="text-sm text-slate-500">6h ago</div>
              </div>
              <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm inline-block mb-3">
                📚 Educational
              </div>
              <div className="text-slate-300 mb-4 leading-relaxed">
                Created educational content in Tamil for children. The pronunciation guides are helping 
                students learn better. Voice technology is truly revolutionizing education! 📖
              </div>
              <div className="flex gap-6 pt-4 border-t border-slate-700">
                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <span>👏</span>
                  <span>Support (892)</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <span>💬</span>
                  <span>Comment (334)</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <span>🔊</span>
                  <span>Listen (78)</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <span>📤</span>
                  <span>Share</span>
                </button>
              </div>
            </article>
          </main>

          {/* Right Sidebar - Trending */}
          <aside className="lg:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-blue-400 mb-6">Trending Voices</h3>
              <div className="space-y-4">
                <div className="p-3 border-b border-slate-700 last:border-b-0">
                  <div className="text-white font-medium">#HindiVoices</div>
                  <div className="text-sm text-slate-400">2.3k recordings shared</div>
                </div>
                <div className="p-3 border-b border-slate-700 last:border-b-0">
                  <div className="text-white font-medium">#BengaliFolk</div>
                  <div className="text-sm text-slate-400">1.8k cultural recordings</div>
                </div>
                <div className="p-3 border-b border-slate-700 last:border-b-0">
                  <div className="text-white font-medium">#TamilEducation</div>
                  <div className="text-sm text-slate-400">3.2k learning voices</div>
                </div>
                <div className="p-3 border-b border-slate-700 last:border-b-0">
                  <div className="text-white font-medium">#TeluguStories</div>
                  <div className="text-sm text-slate-400">4.1k storytelling</div>
                </div>
                <div className="p-3 border-b border-slate-700 last:border-b-0">
                  <div className="text-white font-medium">#GujaratiMusic</div>
                  <div className="text-sm text-slate-400">5.7k musical voices</div>
                </div>
                <div className="p-3 border-b border-slate-700 last:border-b-0">
                  <div className="text-white font-medium">#IndianLanguages</div>
                  <div className="text-sm text-slate-400">8.9k total contributions</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
} 