import { Link } from 'react-router-dom';
import { ChefHat, Heart, Github, Twitter, Instagram, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', to: '/' },
        { label: 'AI Generator', to: '/ai-generator' },
        { label: 'Meal Planner', to: '/meal-planner' },
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'About Us', to: '#' },
        { label: 'Blog', to: '#' },
        { label: 'Contact', to: '#' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', to: '#' },
        { label: 'Privacy Policy', to: '#' },
        { label: 'Terms of Service', to: '#' },
      ]
    }
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="mt-20 backdrop-blur-md bg-white/5 dark:bg-black/5 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-xl font-bold text-white">
              <ChefHat className="w-8 h-8 text-orange-400" />
              <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                Dabylicious
              </span>
            </div>
            <p className="text-white/70 text-sm">
              Your ultimate destination for discovering and creating amazing recipes with AI-powered assistance.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg backdrop-blur-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-white font-semibold text-lg">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/70 text-sm text-center md:text-left">
              © {currentYear} Dabylicious. All rights reserved.
            </p>
            <p className="text-white/70 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> for food lovers
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
