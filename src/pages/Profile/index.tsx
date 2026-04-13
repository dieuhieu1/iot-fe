import { IdCard, GraduationCap, Mail, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import heroBg from '../../assets/hero-bg.jpg';
import avatar from '../../assets/avatar.png';
import { Icon } from '@iconify/react';

const LINKS = [
  {
    title: 'smart_farm_final_report.pdf',
    icon: 'fa6-solid:file-pdf',
    iconColor: '#FB7C7C',
    titleColor: 'linear-gradient(to bottom,#DD7676 0%,#990000 100%)',
    borderColor: '#FF1212',
    subtitle: 'Báo cáo bài tập cuối kì - Phát triển ứng dụng IoT',
    href: '/docs/BaoCaoIOT.pdf',
  },
  {
    title: 'Github',
    icon: 'mdi:github',
    iconColor: '#121212',
    titleColor: 'linear-gradient(to bottom,#121212 0%,#787575 100%)',
    borderColor: '#121212',
    subtitle: 'Source code and project repository',
    href: 'https://github.com/dieuhieu1/iot-nest-be',
  },
  {
    title: 'Swagger - API Documentation',
    icon: 'material-icon-theme:swagger',
    iconColor: '#4EB552',
    titleColor: 'linear-gradient(to bottom,#43A047 0%,#183A1A 100%)',
    borderColor: '#4EB552',
    subtitle: 'RESTful API endpoints & Swagger schemas',
    href: 'http://localhost:3000/api/docs',
  },
  {
    title: 'Figma Design',
    icon: 'devicon:figma',
    iconColor: '#A259FF',
    titleColor: 'linear-gradient(to bottom,#B174FE 0%,#613599 100%)',
    borderColor: '#A259FF',
    subtitle: 'High-fidelity UI/UX prototypes & wireframes',
    href: 'https://www.figma.com/design/vsFxZGbE0eFcMDoeQKXqq7/Iot-Figma?node-id=0-1&t=uzKTBoNNbX2e7aAi-0',
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
        className="relative h-100 my-2 w-390 overflow-hidden mx-10"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: '100%',
          backgroundPositionX: 50,
          backgroundPositionY: -400,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to top, rgba(0,0,0,0.35) 41%, rgba(194,255,80,0.35) 76%, rgba(11,140,26,0.35) 100%)',
          }}
        />
        <div className="relative z-10 flex flex-wrap items-end justify-between px-8 pb-6 pt-0 gap-6 h-full">
          {/* Left: avatar + info */}
          <div className="flex items-end gap-5 inner-shadow-text">
            <img
              src={avatar}
              alt="avatar"
              className="w-83.5 h-83.5 rounded-full  object-cover shrink-0"
            />
            <div>
              <h1
                className="font-bold text-[50px] bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(180deg, #FFFFFF 55.29%, #999999 100%)' }}
              >
                Điêu Chính Hiếu
              </h1>
              <div className="flex items-center gap-2 text-white text-md mt-1">
                <Icon icon="mingcute:phone-fill" fontSize={25} />
                <span>+84 09 344 90 170</span>
              </div>
              <div className="flex items-center gap-2 text-white text-md mt-2">
                <Icon icon="mdi:address-marker" fontSize={25} />
                <span>Nguyen Van Loc, Ha Dong, Ha Noi</span>
              </div>
            </div>
          </div>
          {/* Right: pills */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white text-sm">
              <IdCard size={14} />
              <span>StudentID: B22DCPT087</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white text-sm">
              <GraduationCap size={14} />
              <span>Class: D22PTDPT02</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex mx-10 mt-5">
        {/* Left panel — info */}
        <div className="w-100 shrink-0 flex flex-col gap-5">
          {/* About me */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-l-4 border-green-600 p-4">
              <h3 className="font-bold text-gray-800 text-3xl mb-2">About me</h3>
              <div className="w-full h-px bg-gray-200 my-4" />
              <div className="flex items-center justify-center gap-2">
                <Icon icon="mdi:account-school" fontSize={60} />
                <p className="text-sm text-gray-600 mb-1 ">
                  Final-year student at Posts and Telecommunications Institute of Technology
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="icon-park-solid:birthday-cake" fontSize={40} />
                <p className="text-sm text-gray-600">Born November 24th, 2004</p>
              </div>
            </div>
          </div>
          {/* Contact */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-l-4 border-blue-500 p-4">
              <h3 className="font-bold text-gray-800 text-3xl mb-2">Contact</h3>
              <div className="w-full h-px bg-gray-200 my-4" />
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-md mb-10"
              >
                <Icon icon="logos:linkedin-icon" fontSize={40} />
                <span>Hieu Dieu</span>
                <ExternalLink size={20} className="ml-auto" />
              </a>
              <div className="flex items-center gap-2 text-md text-gray-700">
                <Icon icon="logos:google-gmail" fontSize={30} />
                <span className="flex-1">dieuhieu10h@gmail.com</span>
                <button onClick={handleCopy} title="Copy email">
                  {copied ? (
                    <span className="text-green-500 text-xs">Copied!</span>
                  ) : (
                    <Copy size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right — link cards */}
        <div className="flex-1 min-w-0 flex flex-col gap-6 ml-6">
          {LINKS.map(({ title, icon, iconColor, titleColor, borderColor, subtitle, href }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-3xl px-4 py-4 hover:shadow-md transition-shadow border-l-8"
              style={{
                background: 'linear-gradient(90deg, #FFFFFF 26.44%, #AFABAB 100%)',
                borderLeftColor: borderColor,
              }}
            >
              <div
                className="w-13.25 h-13.25 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${iconColor}66` }}
              >
                <Icon
                  icon={icon}
                  fontSize={36}
                  color={icon === 'fa6-solid:file-pdf' ? 'EF4444' : ''}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-bold text-2xl bg-clip-text text-transparent"
                  style={{ backgroundImage: titleColor }}
                >
                  {title}
                </p>
                <p className="text-md text-gray-500 truncate">{subtitle}</p>
              </div>
              <ExternalLink size={30} className="text-black shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
