figma.showUI(__html__);

figma.ui.resize(600, 450);

let latexFrame: FrameNode | null = null;

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'render-latex-request') {
    try {
      const svgNode = figma.createNodeFromSvg(msg.svg);
      
      if (!latexFrame) {
        latexFrame = figma.createFrame();
        latexFrame.name = 'LaTeX Equation';
        // Set initial position
        latexFrame.x = figma.viewport.center.x;
        latexFrame.y = figma.viewport.center.y;
        figma.currentPage.appendChild(latexFrame);
      } else {
        const { x, y } = latexFrame;
        latexFrame.children.forEach(child => child.remove());
        latexFrame.x = x;
        latexFrame.y = y;
      }
      
      latexFrame.appendChild(svgNode);
      
      latexFrame.resize(svgNode.width, svgNode.height);
      
      figma.currentPage.selection = [latexFrame];
      
      figma.ui.postMessage({
        type: 'render-latex-complete',
        message: 'LaTeX equation rendered successfully',
      });

    } catch (error) {
      console.error('Error rendering LaTeX:', error);
      figma.ui.postMessage({
        type: 'render-latex-error',
        message: error instanceof Error ? error.message : 'Unknown error rendering LaTeX',
      });
    }
  }
};