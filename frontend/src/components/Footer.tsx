import type { FC } from "react"
// import { cn } from "../../lib/utils"
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa"
import { Link } from "react-router-dom"

const Footer: FC = () => {
  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo and Description */}
        <div>
          <h2 className="text-xl font-bold text-primary bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            TatvamAI
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Empowering voice AI for 22+ Indic languages and dialects.
          </p>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Products</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/asr" className="hover:underline">ASR Tools</Link></li>
            <li><Link to="/tts" className="hover:underline">TTS Models</Link></li>
            <li><Link to="/datasets" className="hover:underline">Speech Datasets</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/docs" className="hover:underline">Documentation</Link></li>
            <li><Link to="/blog" className="hover:underline">Blog</Link></li>
            <li><Link to="/faq" className="hover:underline">FAQs</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/careers" className="hover:underline">Careers</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
      </div>

      {/* Social Icons & Bottom Strip */}
      <div className="border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} TatvamAI. All rights reserved.</p>
          <div className="flex gap-4 text-muted-foreground text-xl">
            <a href="https://github.com/tatvam-ai" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><FaGithub /></a>
            <a href="https://twitter.com/tatvam_ai" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><FaTwitter /></a>
            <a href="https://linkedin.com/company/tatvam-ai" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><FaLinkedin /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
