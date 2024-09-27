import katex from 'katex';
import { Settings } from './figmaStorage'; // TODO: Move this to shared types library

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
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@4.0.0-alpha.1/es5/tex-svg.js';
      script.async = true;
      script.onload = () => {
        window.MathJax.startup.promise.then(resolve);
      };
      script.onerror = () => reject(new Error('Failed to load MathJax'));
      document.head.appendChild(script);
    }
  });
};

export const renderLatex = async (latex: string, settings: Settings): Promise<string> => {
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

      window.MathJax.config = {
        tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']]
        },
        svg: {
          fontCache: 'global',
          scale: 1,
          minScale: .5,
          mtextInheritFont: false,
          merrorInheritFont: true,
          mathmlSpacing: false,
          skipAttributes: {},
          exFactor: .5,
          displayAlign: 'center',
          displayIndent: '0',
          internalSpeechTitles: true,
        },
        output: {
          font: `https://cdn.jsdelivr.net/npm/${settings.fontFamily}-font/es5/output/fonts/${settings.fontFamily}`,
          displayOverflow: 'linebreak',
          linebreaks: {
            width: '100%',
            lineleading: 0.5,
          }
        }
      };

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

export const validateLatexWithKaTeX = (latex: string): { message: string; errorStart: number; errorEnd: number } | null => {
  try {
    katex.renderToString(latex, { throwOnError: true });
    return null;
  } catch (error) {
    if (error instanceof katex.ParseError) {
      const fullMessage = error.message;
      const trimmedMessage = fullMessage.replace(/^KaTeX parse error: /, '');
      const match = fullMessage.match(/at position (\d+):/);
      if (match) {
        const errorStart = parseInt(match[1], 10);
        let errorEnd = errorStart;
        while (errorEnd < latex.length && !/\s/.test(latex[errorEnd])) {
          errorEnd++;
        }
        return {
          message: trimmedMessage,
          errorStart,
          errorEnd,
        };
      }
    }
    return {
      message: (error as Error).message,
      errorStart: 0,
      errorEnd: latex.length,
    };
  }
};