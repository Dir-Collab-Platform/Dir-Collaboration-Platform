import React from 'react';
import { Copyright } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-(--dark-bg) border-t border-(--main-border-color) py-6 w-full mt-12">
      <div className="flex justify-center items-center flex-wrap gap-6 px-4 md:px-6 lg:px-8
                  xs:flex-col xs:gap-3 xs:text-center">

        <div className="text-(--secondary-text-color) text-sm font-semibold">Dir</div>
        <div className="text-(--secondary-text-color) text-sm">2025</div>
        <div className="text-(--secondary-text-color) text-sm">
          <Copyright size={16} className="text-(--secondary-text-color)" />
        </div>
        <div className="text-(--secondary-text-color) text-sm">All rights reserved</div>
        <a href="#" className="text-(--secondary-text-color) hover:text-(--active-text-color) hover:underline text-sm">Docs</a>
        <a href="#" className="text-(--secondary-text-color) hover:text-(--active-text-color) hover:underline text-sm">Terms of use</a>
        <a href="#" className="text-(--secondary-text-color) hover:text-(--active-text-color) hover:underline text-sm">Privacy</a>
      </div>
    </footer>

  );
}

export default Footer;