import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is TatvamAI?",
    answer:
      "TatvamAI is a voice AI company focused on collecting, processing, and delivering high-quality Indian language voice datasets and solutions like ASR and TTS to power next-generation applications.",
  },
  {
    question: "What is ASR (Automatic Speech Recognition)?",
    answer:
      "ASR converts spoken language into text. It enables real-time transcription, voice commands, call analytics, and automation of manual entry tasks—boosting productivity across domains like customer support, healthcare, and education.",
  },
  {
    question: "What is TTS (Text-to-Speech)?",
    answer:
      "TTS converts written text into natural-sounding audio. Use it for multilingual IVRs, accessibility tools, learning content, dynamic announcements, and voice-enabling apps at scale.",
  },
  {
    question: "How can TatvamAI help my business?",
    answer:
      "We provide domain-tuned datasets, ASR/TTS models, and easy APIs so you can add multilingual voice features fast—reducing support load, increasing reach, and automating workflows.",
  },
  {
    question: "Do you support Indian regional languages?",
    answer:
      "Yes—Hindi, Gujarati, Tamil, Telugu, Bengali, Marathi, and more. Accent and domain adaptation options available.",
  },
  {
    question: "Can I integrate your voice services into my app?",
    answer:
      "Yes. Our RESTful APIs (and SDKs coming soon) let you add ASR or TTS to mobile, web, IVR, and enterprise tools with minimal setup.",
  },
  {
    question: "Do you offer custom voice dataset collection?",
    answer:
      "Absolutely. We can crowdsource, QR-on-location capture, or remote contributor flows to collect speech in specific domains (e.g., healthcare, retail) with consent and labeling.",
  },
  {
    question: "Is my data safe and private?",
    answer:
      "We honor explicit consent windows, anonymize speech, and follow strict data governance. Enterprise agreements available.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex((curr) => (curr === i ? null : i));
  };

  return (
    <div className="min-h-screen bg-[#101729] text-white py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h1>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  // slight glow tint when open
                  boxShadow: isOpen
                    ? "0 0 24px rgba(59,130,246,0.25)" // blue-500/25
                    : "0 0 0 rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl"
              >
                {/* Header */}
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none select-none"
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-blue-400 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-blue-400 transition-transform duration-200" />
                  )}
                </button>

                {/* Collapsible Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 },
                      }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-slate-300 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
