import React from 'react';

const IntroductionCard: React.FC = () => {
  return (
    <div className="flex w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md transition-shadow duration-200 hover:shadow-lg">
      <p className="text-sm leading-tight text-muted-foreground">
        Instant LaTeX rendering in your designs as you type.
      </p>
    </div>
  );
};

export default IntroductionCard;