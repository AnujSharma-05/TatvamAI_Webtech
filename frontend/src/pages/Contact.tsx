import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { toast } from "sonner"; 
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send } from 'lucide-react';
import { COLORS } from '@/config/theme'; 
// --- EmailJS Configuration ---
const SERVICE_ID = "service_iknpru9";
const TEMPLATE_ID = "template_l7hnfuo";
const PUBLIC_KEY = "aYn2S4Cy8WRnXVJ40";


// --- Main Contact Page Component ---
export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [submitted, setSubmitted] = useState(false);

  // --- DEBUGGED onSubmit FUNCTION ---
  const onSubmit = async (formData: any) => {
    const now = new Date();
    
    // This data object now contains BOTH key formats.
    // This ensures that your EmailJS template will find the variables it needs,
    // whether it's looking for {{name}} or {{from_name}}.
    const data = {
      name: formData.name,         // For templates using {{name}}
      email: formData.email,       // For templates using {{email}}
      from_name: formData.name,    // For templates using {{from_name}} (often for Reply-To)
      from_email: formData.email,  // For templates using {{from_email}} (often for Reply-To)
      subject: formData.subject,
      message: formData.message,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, data, PUBLIC_KEY);
      toast.success("✨ Message beamed successfully!");
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error("EmailJS Error:", err);
      toast.error("⚠️ Signal lost. Please try again.");
    }
  };

  return (
    <div style={{ background: 'transparent' }} className="relative min-h-screen flex items-center justify-center p-8 hide-default-cursor overflow-hidden">


      <motion.div
        className="relative z-10 w-full max-w-6xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div 
          className="grid md:grid-cols-2 gap-px rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`,
            border: `1px solid ${COLORS.cadetGray}20`,
            backdropFilter: 'blur(12px)',
            boxShadow: `0 8px 32px 0 ${COLORS.midnightGreen}50`
          }}
        >
          {/* Left Panel: Info */}
          <div className="p-8 md:p-12 flex flex-col h-full justify-center">
            
            <h1 className="text-5xl md:text-6xl font-extrabold" style={{color: COLORS.nyanza}}>
              Let’s <span style={{ color: COLORS.teaGreen }}>Talk.</span>
            </h1>

            <div>
              <p className="text-lg text-slate-300 my-8">
                Cause Every Voice Matters!
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-lg">
                  <Mail style={{color: COLORS.teaGreen}} />
                  <span className="text-slate-300">tatvamai.official@gmail.com</span>
                </div>
                <div className="flex gap-6 pt-4 text-2xl">
                  <a
                    href="https://github.com/tatvam-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 transition-transform hover:scale-110 hover:text-white"
                  >
                    <Github />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/tatvamai/posts/?feedView=all"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 transition-transform hover:scale-110 hover:text-white"
                  >
                    <Linkedin />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 md:p-12"
            style={{background: `${COLORS.midnightGreen}30`}}
            noValidate
          >
            {["name", "email", "subject", "message"].map((field) => (
              <div key={field} className="mb-5">
                <label className="block text-sm font-medium mb-2 capitalize text-slate-300">{field}</label>
                {field === "message" ? (
                  <textarea
                    {...register(field, { required: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` })}
                    placeholder={`Your ${field}...`}
                    rows={4}
                    className="w-full px-4 py-3 bg-transparent border rounded-xl placeholder:text-slate-500 focus:outline-none focus:ring-2"
                    style={{borderColor: `${COLORS.cadetGray}30`, color: COLORS.nyanza, '--tw-ring-color': COLORS.teaGreen} as React.CSSProperties}
                  />
                ) : (
                  <input
                    type={field === "email" ? "email" : "text"}
                    {...register(field, {
                      required: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
                      ...(field === "email" && {
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      }),
                    })}
                    placeholder={`Your ${field}...`}
                    className="w-full px-4 py-3 bg-transparent border rounded-xl placeholder:text-slate-500 focus:outline-none focus:ring-2"
                    style={{borderColor: `${COLORS.cadetGray}30`, color: COLORS.nyanza, '--tw-ring-color': COLORS.teaGreen} as React.CSSProperties}
                  />
                )}
                {errors[field] && (
                  <p className="text-red-400 text-sm mt-1">
                    {(errors as any)[field]?.message}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting || submitted}
              className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed`}
              style={{
                background: submitted ? '#22c55e' : COLORS.teaGreen, // Emerald green for submitted state
                color: submitted ? 'white' : COLORS.midnightGreen
              }}
            >
              {isSubmitting ? "Transmitting..." : submitted ? "Sent ✓" : "Send Message"}
              {!isSubmitting && !submitted && <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}