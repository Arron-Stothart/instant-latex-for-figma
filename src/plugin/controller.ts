figma.showUI(__html__);

figma.ui.resize(600, 450);

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'render-latex-request') {
    try {
      const svgNode = figma.createNodeFromSvg(msg.svg);
      
      const zoom = figma.viewport.zoom;
      let scaleFactor = 1 / zoom * 5;
      
      let latexFrame: FrameNode;
      const selection = figma.currentPage.selection;
      
      if (selection.length === 1 && selection[0].type === 'FRAME' && selection[0].name === 'LaTeX Equation') {
        latexFrame = selection[0] as FrameNode;
        const existingScaleFactor = latexFrame.getPluginData('scaleFactor');
        if (existingScaleFactor) {
          scaleFactor = parseFloat(existingScaleFactor);
        }
        latexFrame.children.forEach(child => child.remove());
      } else {
        latexFrame = figma.createFrame();
        latexFrame.name = 'LaTeX Equation';
      }
      
      latexFrame.setPluginData('scaleFactor', scaleFactor.toString());
      
      svgNode.rescale(scaleFactor);
      
      const finalWidth = svgNode.width;
      const finalHeight = svgNode.height;
      
      latexFrame.resize(finalWidth, finalHeight);
      
      if (!selection.length || selection[0] !== latexFrame) {
        latexFrame.x = figma.viewport.center.x - finalWidth / 2;
        latexFrame.y = figma.viewport.center.y - finalHeight / 2;
        figma.currentPage.appendChild(latexFrame);
      }
      
      latexFrame.backgrounds = [];
      latexFrame.appendChild(svgNode);
      
      const textNode = figma.createText();
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      textNode.fontName = { family: "Inter", style: "Regular" };
      textNode.characters = msg.latex;
      textNode.visible = false;
      textNode.name = 'Original LaTeX';
      latexFrame.appendChild(textNode);
      
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

figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection;
  if (selection.length === 1 && selection[0].type === 'FRAME' && selection[0].name === 'LaTeX Equation') {
    const latexFrame = selection[0] as FrameNode;
    const textNode = latexFrame.findChild(node => node.type === 'TEXT' && node.name === 'Original LaTeX') as TextNode;
    if (textNode) {
      figma.ui.postMessage({
        type: 'latex-frame-selected',
        latex: textNode.characters
      });
    }
  } else {
    figma.ui.postMessage({
      type: 'latex-frame-deselected'
    });
  }
});