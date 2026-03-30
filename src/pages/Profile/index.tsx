import { Phone, MapPin, IdCard, GraduationCap, Mail, Copy, ExternalLink, FileText, BookOpen, Code2, PenTool } from 'lucide-react';
import { useState } from 'react';

const LINKS = [
  {
    title: 'smart_farm_final_report.pdf',
    icon: FileText,
    iconColor: '#e53e3e',
    subtitle: 'Báo cáo bài tập cuối kì - Phát triển ứng dụng IoT',
    href: '#',
  },
  {
    title: 'Github',
    icon: Code2,
    iconColor: '#1a202c',
    subtitle: 'Source code and project repository',
    href: '#',
  },
  {
    title: 'Swagger - API Documentation',
    icon: BookOpen,
    iconColor: '#38a169',
    subtitle: 'RESTful API endpoints & Swagger schemas',
    href: '#',
  },
  {
    title: 'Figma Design',
    icon: PenTool,
    iconColor: '#7c3aed',
    subtitle: 'High-fidelity UI/UX prototypes & wireframes',
    href: '#',
  },
];

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('dieuhieu10h@gmail.com').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      {/* Header banner */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 50%, #1a4a2a 100%)',
          minHeight: 200,
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-wrap items-center justify-between px-8 py-8 gap-6">
          {/* Left: avatar + info */}
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-full bg-green-500 border-4 border-white/30 flex items-center justify-center text-white text-3xl font-bold shrink-0">
              HD
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl">Đièu Chính Hiếu</h1>
              <div className="flex items-center gap-2 text-green-200 text-sm mt-1">
                <Phone size={13} />
                <span>+84 03 544 90 175</span>
              </div>
              <div className="flex items-center gap-2 text-green-200 text-sm mt-0.5">
                <MapPin size={13} />
                <span>Nguyen Van Loc, Ha Dong, Ha Noi</span>
              </div>
            </div>
          </div>
          {/* Right: pills */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white text-sm">
              <IdCard size={14} />
              <span>B22DCPT087</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white text-sm">
              <GraduationCap size={14} />
              <span>D22PTOPT02</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-4 w-80 shrink-0">
          {/* About me */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-l-4 border-green-600 p-4">
              <h3 className="font-semibold text-gray-800 mb-2">About me</h3>
              <p className="text-sm text-gray-600 mb-1">
                Final-year student at Posts and Telecommunications Institute of Technology
              </p>
              <p className="text-sm text-gray-600">Born November 24th, 2004</p>
            </div>
          </div>
          {/* Contact */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-l-4 border-blue-500 p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Contact</h3>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-2"
              >
                <ExternalLink size={15} className="text-blue-600" />
                <span>Hieu Dieu (LinkedIn)</span>
                <ExternalLink size={12} className="ml-auto text-gray-400" />
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail size={15} className="text-gray-500" />
                <span className="flex-1">dieuhieu10h@gmail.com</span>
                <button
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-gray-700"
                  title="Copy email"
                >
                  {copied ? <span className="text-green-500 text-xs">Copied!</span> : <Copy size={13} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — link cards */}
        <div className="flex-1 flex flex-col gap-3">
          {LINKS.map(({ title, icon: Icon, iconColor, subtitle, href }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 px-4 py-4 hover:shadow-md transition-shadow"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${iconColor}15` }}
              >
                <Icon size={20} style={{ color: iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{title}</p>
                <p className="text-xs text-gray-500 truncate">{subtitle}</p>
              </div>
              <ExternalLink size={16} className="text-gray-400 shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
