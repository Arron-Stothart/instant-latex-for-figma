const mathjax = require('mathjax-full/js/mathjax.js').mathjax;
const {AllPackages} = require('mathjax-full/js/input/tex/AllPackages.js');


const MathJax = mathjax.init({
  loader: {load: ['input/tex', 'output/svg']},
  tex: {packages: AllPackages},
  svg: {fontCache: 'none'}
});

const doc = MathJax.document('');

function positionFrameNode(textNode: TextNode, frameNode: FrameNode, index: number): void {
  const textPosition = textNode.absoluteTransform;
  frameNode.x = textPosition[0][2] + textNode.width * (index / textNode.characters.length);
  frameNode.y = textPosition[1][2];
  figma.currentPage.appendChild(frameNode);
}

export async function renderAndReportLatex(textNode: TextNode, latex: string, startIndex: number): Promise<void> {
  try {
    const svgOutput = doc.convert(latex, {display: true});
    const svgString = svgOutput.innerHTML;
    
    const frameNode = figma.createNodeFromSvg(svgString);
    
    const placeholder = '';
    textNode.insertCharacters(startIndex, placeholder, 'BEFORE');
    textNode.deleteCharacters(startIndex + 1, startIndex + latex.length + 5);

    positionFrameNode(textNode, frameNode, startIndex);

    
    textNode.setRangeFontName(startIndex, startIndex + 1, { family: 'LaTeX', style: 'Equation' });
    textNode.setRangeHyperlink(startIndex, startIndex + 1, { type: 'URL', value: `latex://${encodeURIComponent(latex)}` });
    
  } catch (error) {}
}