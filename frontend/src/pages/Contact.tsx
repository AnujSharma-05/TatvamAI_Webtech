import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "../components/ui/sonner";
import emailjs from "@emailjs/browser";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import { InView } from "react-intersection-observer";

const SERVICE_ID = "service_iknpru9";
const TEMPLATE_ID = "template_l7hnfuo";
const PUBLIC_KEY = "aYn2S4Cy8WRnXVJ40";

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (formData: any) => {
    const now = new Date();
    const data = {
      ...formData,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, data, PUBLIC_KEY);
      toast.success("✨ Message beamed successfully!");
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("EmailJS Error:", err);
      toast.error("⚠️ Signal lost. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(circle_at_20%_20%,#0f172a,transparent)] text-white py-20 px-6 flex items-center justify-center">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">

        {/* Left Panel: Info */}
        <InView triggerOnce threshold={0.1}>
          {({ ref, inView }) => (
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="bg-[#101729]/80 rounded-3xl p-10 shadow-2xl backdrop-blur-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              <h2 className="text-4xl font-bold text-gradient bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent mb-4">
                Let’s Talk.
              </h2>
              <p className="text-slate-400 mb-8">
                Whether you’re a contributor, enterprise, or just curious — we’re listening.
              </p>

              <div className="space-y-4 text-slate-300">
                <div className="flex items-center gap-3 text-lg">
                  <FaEnvelope className="text-blue-400" />
                  <span>tatvamai.official@gmail.com</span>
                </div>
                <div className="flex gap-6 mt-6 text-2xl">
                  <a
                    href="https://github.com/tatvam-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition hover:scale-110"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/tatvamai/posts/?feedView=all"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 transition hover:scale-110"
                  >
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </InView>

        {/* Right Panel: Form */}
        <InView triggerOnce threshold={0.1}>
          {({ ref, inView }) => (
            <motion.form
              ref={ref}
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="bg-[#101729]/80 rounded-3xl p-10 shadow-2xl backdrop-blur-lg hover:shadow-purple-500/20 transition-all duration-300"
            >
              <h3 className="text-3xl font-bold mb-6 text-white">Send a Message</h3>

              {["name", "email", "subject", "message"].map((field) => (
                <div key={field} className="mb-6">
                  <label className="block text-slate-300 mb-1 capitalize">{field}</label>
                  {field === "message" ? (
                    <textarea
                      {...register(field, { required: `${field} is required` })}
                      placeholder={`Enter your ${field}`}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#181f36] border border-slate-700 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    />
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      {...register(field, {
                        required: `${field} is required`,
                        ...(field === "email" && {
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email",
                          },
                        }),
                      })}
                      placeholder={`Enter your ${field}`}
                      className="w-full px-4 py-3 bg-[#181f36] border border-slate-700 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                disabled={isSubmitting}
                className={`w-full mt-4 py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
                  submitted
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                }`}
              >
                {isSubmitting ? "Transmitting..." : submitted ? "Sent ✓" : "Send Message"}
              </button>
            </motion.form>
          )}
        </InView>
      </div>
    </div>
  );
}
