import { generateId } from '@/lib/utils';
import { loadSettings, saveSetting, Settings } from '../lib/figmaStorage';
import { addToHistory, getHistory } from '../lib/history';

figma.showUI(__html__);

figma.ui.resize(500, 250);

let settings: Settings;

loadSettings().then(loadedSettings => {
  settings = loadedSettings;
  figma.ui.postMessage({ type: 'settings-updated', settings });
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'settings-updated') {
    settings[msg.key] = msg.value;
    await saveSetting(msg.key, msg.value);
    figma.ui.postMessage({ type: 'settings-updated', settings });
  } else if (msg.type === 'render-latex-request') {
    try {
      let latexFrame: FrameNode | null = null;
      const selection = figma.currentPage.selection;
      
      if (selection.length === 1 && selection[0].type === 'FRAME' && selection[0].name === 'LaTeX Equation') {
        latexFrame = selection[0] as FrameNode;
      }

      if (!msg.latex.trim()) {
        if (latexFrame) {
          latexFrame.remove();
        }
        figma.currentPage.selection = [];
        figma.ui.postMessage({
          type: 'render-latex-complete',
          message: 'LaTeX equation removed successfully'
        });
        return;
      }

      const svgNode = figma.createNodeFromSvg(msg.svg);
      
      const zoom = figma.viewport.zoom;
      let scaleFactor = 1 / zoom * 5;
      let historyId: string;
      
      if (latexFrame) {
        const existingScaleFactor = latexFrame.getPluginData('scaleFactor');
        if (existingScaleFactor) {
          scaleFactor = parseFloat(existingScaleFactor);
        }
        const historyNode = latexFrame.findChild(node => node.type === 'TEXT' && node.name === 'History ID') as TextNode;
        if (historyNode) {
          historyId = historyNode.characters;
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

      const historyNode = figma.createText();
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      historyNode.fontName = { family: "Inter", style: "Regular" };
      historyNode.characters = String(historyId || generateId());
      historyNode.visible = false;
      historyNode.name = 'History ID';
      latexFrame.appendChild(historyNode);

      figma.currentPage.selection = [latexFrame];
      
      figma.ui.postMessage({
        type: 'render-latex-complete',
        message: 'LaTeX equation rendered successfully',
      });

      // Generate and store history ID
      const updatedHistory = await addToHistory({
        id: historyId || generateId(),
        latex: msg.latex,
        svg: msg.svg,
        settings: {
          fontFamily: settings.fontFamily,
          equationSize: settings.equationSize,
        },
      });

      figma.ui.postMessage({ type: 'history-updated', history: updatedHistory });
    } catch (error) {
      console.error('Error rendering LaTeX:', error);
      figma.ui.postMessage({
        type: 'render-latex-error',
        message: error instanceof Error ? error.message : 'Unknown error rendering LaTeX',
      });
    }
  } else if (msg.type === 'request-settings') {
    figma.ui.postMessage({ type: 'settings-updated', settings });
  } else if (msg.type === 'request-history') {
    const history = await getHistory();
    figma.ui.postMessage({ type: 'history-updated', history });
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
        latex: textNode.characters,
        settings: settings 
      });
    } else {
      figma.ui.postMessage({
        type: 'latex-frame-deselected',
        settings: settings
      });
    }
  } else {
    figma.ui.postMessage({
      type: 'latex-frame-deselected',
      settings: settings
    });
  }
});
