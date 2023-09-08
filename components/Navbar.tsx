import NavbarButton from './NavbarButton';
import React, { useEffect, useState } from 'react';
import { barColorMap, textColorMap, ThemeType, faviconMap, svgFilterMap } from '../interfaces/themeMaps';
import Image from 'next/image';
import Link from 'next/link';
import MenuSlide from './MenuSlide';

type NavbarProps = {
  theme: ThemeType;
};

const Navbar: React.FC<NavbarProps> = ({ theme }) => {
  const svgFilterClass = svgFilterMap[theme] || svgFilterMap["zimo"];
  const barColorClass = barColorMap[theme] || barColorMap["zimo"];
  const textColorClass = textColorMap[theme] || textColorMap["zimo"];
  const faviconSrc = faviconMap[theme] || faviconMap["zimo"];

  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);

  const scrollThreshold = 4;

  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => {
    setMenuOpen(true);
  }

  const restoreNavbar = () => {
    setMenuOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const distanceScrolled = Math.abs(currentScrollY - lastScrollY);
      
      setScrollY(currentScrollY);

      if (currentScrollY < 40) {
        setNavbarVisible(true);
      } else {
        if (distanceScrolled >= scrollThreshold) {
          if (currentScrollY > lastScrollY) {
            // Scrolling down
            setNavbarVisible(false);
          } else {
            // Scrolling up
            setNavbarVisible(true);
          }
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const barColor = scrollY > 25 ? `${barColorClass} backdrop-blur-md` : 'bg-opacity-0';
  const navbarClass = `${textColorClass} ${barColor} ${menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} px-4 h-12 transition-all duration-300 ease-out fixed w-full top-0 flex items-center justify-between z-20`;

  return (
    <>
    <nav id="navbar" className={navbarVisible ? navbarClass : `${navbarClass} -translate-y-14`}>
      <div className="flex-none">
        <Link href={`/`} passHref>
        <Image src={`${faviconSrc}`} className="h-6 w-auto transform transition-all duration-300 hover:scale-125 cursor-pointer" alt="Home Icon" width={24} height={24} priority={true} />
        </Link>
      </div>
      <div className="flex flex-grow"></div>
      <div className={`flex flex-grow-navbar space-x-0 justify-between font-arial`}>
      {['photos', 'blog', 'projects', 'about'].map((item) => (
        <NavbarButton key={item} item={item as 'photos' | 'blog' | 'projects' | 'about'} theme={theme} />
      ))}
    </div>
      <div className="flex flex-grow"></div>
      <button className="flex-none" onClick={openMenu}>
        <Image src="/more-icon.svg" className={`h-6 w-auto transform transition-all duration-300 hover:scale-125 ${svgFilterClass}`} alt="More Settings" width={24} height={24} priority={true} />
      </button>
    </nav>
    <MenuSlide isOpen={menuOpen} onClose={restoreNavbar} theme={theme} />
    </>
  );
};

export default Navbar;
