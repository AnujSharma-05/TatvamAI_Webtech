import type { FC } from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const COLORS = {
  lightYellow: '#ffffe3',
  midnightGreen: '#003642',
  teaGreen: '#d0e6a5',
  nyanza: '#f1ffe3',
  cadetGray: '#83a0a0',
};

const Footer: FC = () => (
  <footer
    className="py-12 px-6"
    style={{
      background: "rgba(0,54,66,0.85)", // Glassy midnight green
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      color: COLORS.cadetGray,
      borderTop: `1px solid ${COLORS.cadetGray}20`,
    }}
  >
    <div className="max-w-6xl mx-auto text-center">
      <p
        className="font-bold text-lg mb-4"
        style={{
          color: COLORS.nyanza,
          letterSpacing: "0.05em",
        }}
      >
        TatvamAI
      </p>
      <div className="flex justify-center gap-6 mb-8">

        {/* Commenting the Privacy and terms page for now and adding new route to the main page */}

        <Link to="/about" className="hover:text-white transition font-medium">About</Link>
        <Link to="/" className="hover:text-white transition font-medium">Home</Link>
        {/* <Link to="/blogs" className="hover:text-white transition font-medium">Blog</Link> */}
        <Link to="/contact" className="hover:text-white transition font-medium">Contact</Link>
        {/* <Link to="/privacy" className="hover:text-white transition font-medium">Privacy</Link> */}
        {/* <Link to="/terms" className="hover:text-white transition font-medium">Terms</Link> */}
      </div>
      <div className="flex justify-center gap-6 mb-8 text-xl">
        <a
          href="https://github.com/tatvam-ai"
          target="_blank"
          rel="noreferrer"
          className="hover:text-teaGreen transition-colors duration-300"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://twitter.com/tatvam_ai"
          target="_blank"
          rel="noreferrer"
          className="hover:text-teaGreen transition-colors duration-300"
          aria-label="Twitter"
        >
          <FaTwitter />
        </a>
        <a
          href="https://linkedin.com/company/tatvam-ai"
          target="_blank"
          rel="noreferrer"
          className="hover:text-teaGreen transition-colors duration-300"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>
      </div>
      <p style={{ color: COLORS.cadetGray }}>
        © {new Date().getFullYear()} TatvamAI. All rights reserved.
      </p>
    </div>
  </footer>
);

export { Footer };