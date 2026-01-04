import React from 'react';
import { Copyright } from 'lucide-react';

function Footer() {
  return (
    <footer 
      className="bg-[var(--dark-bg)] border-t border-[var(--main-border-color)] py-6 px-8 mt-auto
                 md:py-6 md:px-8
                 sm:py-6 sm:px-4"
      style={{
        backgroundColor: 'var(--dark-bg)',
        borderTopColor: 'var(--main-border-color)'
      }}
    >
      <div className="flex justify-center items-center flex-wrap gap-6 max-w-full mx-auto
                      md:gap-6 md:px-0
                      sm:gap-4 sm:px-4
                      xs:flex-col xs:gap-3 xs:text-center">
        
        {/* Dir */}
        <div className="flex items-center gap-2 text-[var(--secondary-text-color)] text-sm font-semibold
                        sm:text-sm
                        xs:text-xs xs:m-0">
          Dir
        </div>
        
        {/* 2025 */}
        <div className="flex items-center gap-2 text-[var(--secondary-text-color)] text-sm
                        sm:text-sm
                        xs:text-xs xs:m-0">
          2025
        </div>
        
        {/* Copyright icon */}
        <div className="flex items-center gap-2 text-[var(--secondary-text-color)] text-sm
                        sm:text-sm
                        xs:text-xs xs:m-0">
          <Copyright 
            size={16} 
            className="sm:w-4 sm:h-4 xs:w-3.5 xs:h-3.5" 
            style={{ color: 'var(--secondary-text-color)' }} 
          />
        </div>
        
        {/* All rights reserved */}
        <div className="flex items-center gap-2 text-[var(--secondary-text-color)] text-sm
                        sm:text-sm
                        xs:text-xs xs:m-0">
          All rights reserved
        </div>
        
        {/* Docs link */}
        <div className="flex items-center gap-2 text-sm
                        sm:text-sm
                        xs:text-xs xs:m-0">
          <a 
            href="#" 
            className="text-[var(--secondary-text-color)] no-underline transition-colors duration-200 hover:text-[var(--active-text-color)] hover:underline"
          >
            Docs
          </a>
        </div>
        
        {/* Terms of use link */}
        <div className="flex items-center gap-2 text-sm
                        sm:text-sm
                        xs:text-xs xs:m-0">
          <a 
            href="#" 
            className="text-[var(--secondary-text-color)] no-underline transition-colors duration-200 hover:text-[var(--active-text-color)] hover:underline"
          >
            Terms of use
          </a>
        </div>
        
        {/* Privacy link */}
        <div className="flex items-center gap-2 text-sm
                        sm:text-sm
                        xs:text-xs xs:m-0">
          <a 
            href="#" 
            className="text-[var(--secondary-text-color)] no-underline transition-colors duration-200 hover:text-[var(--active-text-color)] hover:underline"
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;