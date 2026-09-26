import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Deep Obsidian / Indigo gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#070a13] to-[#04060b]" />

      {/* Subtle Aurora Light Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cyan-600/10 blur-[100px]" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px]" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-rose-600/10 blur-[120px]" />

      {/* Subtle fine geometric grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};
