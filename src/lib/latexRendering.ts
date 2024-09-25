declare global {
  interface Window {
    MathJax: any;
  }
}

const ensureMathJaxLoaded = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      resolve();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
      script.async = true;
      script.onload = () => {
        window.MathJax.startup.promise.then(resolve);
      };
      script.onerror = () => reject(new Error('Failed to load MathJax'));
      document.head.appendChild(script);
    }
  });
};

export const renderLatex = async (latex: string): Promise<string> => {
  await ensureMathJaxLoaded();
  
  return new Promise((resolve, reject) => {
    if (!window.MathJax) {
      reject(new Error('MathJax not loaded'));
      return;
    }

    try {
      const container = document.createElement('div');
      container.style.visibility = 'hidden';
      document.body.appendChild(container);

      container.innerHTML = `\\[${latex}\\]`;

      window.MathJax.typesetPromise([container]).then(() => {
        const mathJaxOutput = container.querySelector('.MathJax');
        if (mathJaxOutput) {
          const svgElement = mathJaxOutput.querySelector('svg');
          if (svgElement) {
            const svgString = new XMLSerializer().serializeToString(svgElement);
            resolve(svgString);
          } else {
            reject(new Error('SVG element not found'));
          }
        } else {
          reject(new Error('MathJax output not found'));
        }
        document.body.removeChild(container);
      }).catch((error: Error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const validateLatex = async (latex: string): Promise<string | null> => {
  await ensureMathJaxLoaded();
  
  return new Promise((resolve) => {
    if (!window.MathJax) {
      resolve('MathJax not loaded');
      return;
    }

    try {
      const container = document.createElement('div');
      container.style.visibility = 'hidden';
      document.body.appendChild(container);

      container.innerHTML = `\\[${latex}\\]`;

      window.MathJax.typesetPromise([container]).then(() => {
        document.body.removeChild(container);
        resolve(null); 
      }).catch((error: Error) => {
        document.body.removeChild(container);
        resolve(error.message);
      });
    } catch (error) {
      resolve((error as Error).message);
    }
  });
};