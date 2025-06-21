import { MotionDiv, MotionCard } from '../components/MotionProvider';

const Contributor = () => {
  const benefits = [
    {
      title: 'Earn Rewards',
      description: 'Get paid for your voice contributions and help build better technology.',
      icon: '💰',
    },
    {
      title: 'Flexible Hours',
      description: 'Contribute whenever its convenient for you, from anywhere.',
      icon: '⏰',
    },
    {
      title: 'Make an Impact',
      description: 'Help make technology accessible in your native language.',
      icon: '🌟',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <MotionDiv className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-6">Become a Voice Contributor</h1>
          <p className="text-xl text-slate-300">
            Join our community of voice contributors and help make technology accessible in Indian languages.
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <MotionCard
              key={index}
              className="bg-slate-800 p-8 rounded-xl text-center"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-slate-300">{benefit.description}</p>
            </MotionCard>
          ))}
        </div>

        <MotionDiv className="max-w-2xl mx-auto">
          <div className="bg-slate-800 p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Sign Up as a Contributor</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="languages" className="block text-sm font-medium mb-2">
                  Languages You Speak
                </label>
                <input
                  type="text"
                  id="languages"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Hindi, Tamil, Telugu"
                />
              </div>
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Join as Contributor
              </button>
            </form>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};

export default Contributor; 