import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';

import icon from '../../assets/icon.png';
import avatar from '../../assets/avatar.png';

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'material-symbols:dashboard' },
  { to: '/sensors', label: 'Sensors', icon: 'ic:round-sensors' },
  { to: '/activities', label: 'Activities', icon: 'hugeicons:computer-activity' },
  { to: '/profile', label: 'My Profile', icon: 'iconamoon:profile' },
];

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen flex flex-col z-[100] transition-all duration-300 w-60">
      {/* Logo */}
      <div className="flex flex-col items-center py-4 px-4">
        <img src={icon} alt="" />
      </div>

      {/* Nav */}
      <nav className="flex-1 mt-5 flex flex-col gap-10 ml-3">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-10 px-3 py-2.5 rounded-tl-lg rounded-bl-lg rounded-br-lg mb-1 text-xl font-bold transition-colors w-60 shadow-lg
              ${
                isActive
                  ? 'bg-[linear-gradient(to_right,#FFFFFF_0%,#91DEFF_30%,#A04EE8_59%,#0C2378_80%)]'
                  : 'border-l-4 border-green-400 pl-2'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  icon={icon}
                  fontSize={38}
                  className={isActive ? 'text-[#3546A0]' : 'text-white'}
                />
                <span
                  className={
                    isActive
                      ? 'text-white'
                      : 'bg-[linear-gradient(to_right,#FFFFFF_0%,#999999_100%)] bg-clip-text text-transparent'
                  }
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center justify-center">
        <hr className="text-white w-50" />
      </div>
      {/* User block */}
      <div className="px-4 py-4 border-white/10 flex items-center gap-3">
        <img src={avatar} className="object-cover h-22 w-22 rounded-full" />
        <div className="min-w-0">
          <p className="bg-[linear-gradient(to_right,#FFFFFF_0%,#999999_100%)] bg-clip-text text-transparent text-base font-medium truncate">
            Humble Dieu
          </p>
          <p className="bg-[linear-gradient(to_right,#FFFFFF_0%,#999999_100%)] bg-clip-text text-transparent text-xs">
            Admin
          </p>
        </div>
      </div>
    </aside>
  );
}
