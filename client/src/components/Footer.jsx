import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">About Natours</h3>
            <p className="text-sm">
              Explore the world with Natours. Discover new adventures, meet new people, and enjoy the thrill of nature like never before.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-white">Home</a>
              </li>
              <li>
                <a href="/about" className="hover:text-white">About Us</a>
              </li>
              <li>
                <a href="/tours" className="hover:text-white">Our Tours</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <span>📍 123 Adventure Blvd, Wanderlust City</span>
              </li>
              <li>
                <span>📞 +1 (555) 123-4567</span>
              </li>
              <li>
                <span>📧 support@natours.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Natours. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
