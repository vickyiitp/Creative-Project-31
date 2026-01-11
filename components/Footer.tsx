import React from 'react';
import { Github, Twitter, Linkedin, Youtube, Instagram, Mail, Heart } from 'lucide-react';

interface FooterProps {
    onOpenModal: (title: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal }) => {
  const socialLinks = [
    { icon: Youtube, href: "https://youtube.com/@vickyiitp", label: "YouTube" },
    { icon: Linkedin, href: "https://linkedin.com/in/vickyiitp", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com/vickyiitp", label: "X (Twitter)" },
    { icon: Github, href: "https://github.com/vickyiitp", label: "GitHub" },
    { icon: Instagram, href: "https://instagram.com/vickyiitp", label: "Instagram" },
  ];

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Covalent Bonds</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Master the art of molecular assembly in this interactive scientific puzzle game.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-slate-600">
               <Mail size={16} />
               <a href="mailto:themvaplatform@gmail.com" className="hover:text-indigo-600">themvaplatform@gmail.com</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="font-semibold text-slate-900 mb-4">Game Resources</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-indigo-600">Play Now</button></li>
              <li><button onClick={() => onOpenModal('How to Play')} className="hover:text-indigo-600">How to Play</button></li>
              <li><a href="https://vickyiitp.tech" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">More Games</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-1">
            <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><button onClick={() => onOpenModal('Privacy Policy')} className="hover:text-indigo-600">Privacy Policy</button></li>
              <li><button onClick={() => onOpenModal('Terms of Service')} className="hover:text-indigo-600">Terms of Service</button></li>
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-1">
            <h4 className="font-semibold text-slate-900 mb-4">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>© 2025 Vickyiitp. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Made with <Heart size={14} className="text-red-400 fill-current" /> by Vicky Kumar
          </p>
        </div>
      </div>
    </footer>
  );
};