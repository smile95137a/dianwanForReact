import React from 'react';
import facebookLogo from '@/assets/image/fb-link.png';
import instagramLogo from '@/assets/image/ig-link.png';
import lineLogo from '@/assets/image/line-link.png';

interface SocialLink {
  href: string;
  icon: string;
  class: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  {
    href: 'https://www.facebook.com',
    icon: facebookLogo,
    class: 'social-links__item--facebook',
    label: 'Facebook',
  },
  {
    href: 'https://www.instagram.com',
    icon: instagramLogo,
    class: 'social-links__item--instagram',
    label: 'Instagram',
  },
  {
    href: 'https://line.me',
    icon: lineLogo,
    class: 'social-links__item--line',
    label: 'Line',
  },
];

const SocialLinks: React.FC = () => (
  <div className="social-links">
    {socialLinks.map((link, index) => (
      <a
        key={index}
        href={link.href}
        className={`social-links__item ${link.class}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={link.label}
      >
        <img src={link.icon} alt={link.label} />
      </a>
    ))}
  </div>
);

export default SocialLinks;
