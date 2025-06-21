import { MotionCard } from '../components/MotionProvider';

const Blogs = () => {
  const blogs = [
    {
      title: 'The Future of Voice Technology in India',
      excerpt: 'Exploring how voice technology is transforming digital interactions in India...',
      author: 'Rahul Kumar',
      date: 'March 15, 2024',
      category: 'Technology',
    },
    {
      title: 'Building Inclusive Voice Datasets',
      excerpt: 'Understanding the importance of diverse voice data collection...',
      author: 'Priya Singh',
      date: 'March 12, 2024',
      category: 'Research',
    },
    {
      title: 'Voice AI in Regional Languages',
      excerpt: 'Breaking down language barriers with advanced voice recognition...',
      author: 'Arun Patel',
      date: 'March 10, 2024',
      category: 'Innovation',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-12 text-center">Latest Blog Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <MotionCard
              key={index}
              className="bg-slate-800 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 bg-slate-700" />
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-sm text-blue-400">{blog.category}</span>
                  <span className="mx-2 text-slate-600">•</span>
                  <span className="text-sm text-slate-400">{blog.date}</span>
                </div>
                <h2 className="text-xl font-bold mb-3">{blog.title}</h2>
                <p className="text-slate-300 mb-4">{blog.excerpt}</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-600 mr-3" />
                  <span className="text-sm text-slate-400">{blog.author}</span>
                </div>
              </div>
            </MotionCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs; 