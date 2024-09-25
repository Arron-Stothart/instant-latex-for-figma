import React from 'react';

const IntroductionCard: React.FC = () => {
  return (
    <div className="flex w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md transition-shadow duration-200 hover:shadow-lg">
      {/* <h3 className="mb-2 text-lg font-medium">Real-time LaTeX</h3> */}
      <p className="text-sm leading-tight text-muted-foreground">
        Real-time LaTeX is a plugin for Figma that allows you to render LaTeX equations in your designs as you type.
      </p>
    </div>
  );
};

export default IntroductionCard;