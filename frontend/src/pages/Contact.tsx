import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { toast } from "../components/ui/sonner";
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    // Simulate API call or processing
    toast.success("Your message has been sent successfully!");
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-950 py-16 px-4 flex items-center justify-center">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 animate-in fade-in duration-500">
        {/* Contact Form */}
        <Card className="shadow-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition hover:scale-[1.01] duration-300">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-2">
              Get in Touch
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Fill out the form and we’ll get back to you soon.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <Input
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name.message as string}</span>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <Input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email.message as string}</span>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Subject</label>
                <Input
                  {...register("subject", { required: "Subject is required" })}
                  placeholder="Message subject"
                />
                {errors.subject && (
                  <span className="text-red-500 text-sm">{errors.subject.message as string}</span>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Message</label>
                <Textarea
                  {...register("message", { required: "Message is required" })}
                  placeholder="Write your message here..."
                  rows={4}
                />
                {errors.message && (
                  <span className="text-red-500 text-sm">{errors.message.message as string}</span>
                )}
              </div>
              <Button
                type="submit"
                className="w-full text-base font-semibold tracking-wide"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="shadow-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col justify-center transition hover:scale-[1.01] duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              Connect with Us
            </CardTitle>
            <p className="text-muted-foreground">
              Reach out via email or follow us on social media.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-3 text-lg text-slate-700 dark:text-slate-300">
                <FaEnvelope className="text-blue-600 dark:text-blue-400" />
                <span>support@tatvam.ai</span>
              </div>
              <div className="flex items-center gap-3 text-lg text-slate-700 dark:text-slate-300">
                <FaPhone className="text-green-600 dark:text-green-400" />
                <span>+91-9876543210</span>
              </div>
              <div className="flex gap-6 mt-8 text-2xl text-slate-600 dark:text-slate-300">
                <a
                  href="https://github.com/tatvam-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black dark:hover:text-white transition-transform hover:scale-110"
                >
                  <FaGithub />
                </a>
                <a
                  href="https://twitter.com/tatvam_ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-transform hover:scale-110"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://linkedin.com/company/tatvam-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-700 transition-transform hover:scale-110"
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
