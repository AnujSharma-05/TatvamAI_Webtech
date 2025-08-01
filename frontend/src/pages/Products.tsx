// import { MotionCard } from '../components/MotionProvider';

// const Products = () => {
//   const products = [
//     {
//       title: 'ASR Model',
//       description: 'Convert spoken language into written text with high accuracy, supporting Indian accents.',
//       features: [
//         'Multi-language recognition',
//         'Handles diverse accents',
//         'Noise-robust models',
//         'Real-time transcription',
//       ],
//     },
//     {
//       title: 'TTS Model',
//       description: 'Convert text to natural-sounding speech in multiple Indian languages and tones.',
//       features: [
//         'Natural prosody',
//         'Customizable voices',
//         'Multi-language support',
//         'Fast inference',
//       ],
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-900 text-white py-24">
//       <div className="max-w-7xl mx-auto px-6 lg:px-8">
//         <h1 className="text-4xl font-bold mb-8 text-center">Our Voice AI Models</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {products.map((product, index) => (
//             <MotionCard
//               key={index}
//               className="bg-slate-800 p-8 rounded-xl shadow-md transition duration-300 hover:shadow-blue-500/40 hover:shadow-lg hover:scale-[1.02]"
//             >
//               <h2 className="text-2xl font-bold mb-4">{product.title}</h2>
//               <p className="text-slate-300 mb-6">{product.description}</p>
//               <ul className="space-y-2">
//                 {product.features.map((feature, featureIndex) => (
//                   <li key={featureIndex} className="flex items-center text-slate-400">
//                     <svg
//                       className="w-5 h-5 mr-2 text-blue-500"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M5 13l4 4L19 7"
//                       />
//                     </svg>
//                     {feature}
//                   </li>
//                 ))}
//               </ul>
//             </MotionCard>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;
