import React from 'react';

const BackgroundBlobs = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-pulse delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-lg opacity-20 animate-pulse delay-3000"></div>
    </div>
  );
};

export default BackgroundBlobs;