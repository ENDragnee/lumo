// src/components/footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-20 w-full pb-4 text-center text-[#003366] dark:text-[#5294e2]">
      <p className="text-sm font-thin">
        © ASCII Technologies PLC <span className="text-[#b8860b]">{new Date().getFullYear()}</span>
      </p>
    </footer>
  );
};

export default Footer;