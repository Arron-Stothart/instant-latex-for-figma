var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { mathjax } = require('mathjax-full/js/mathjax.js');
const { TeX } = require('mathjax-full/js/input/tex.js');
const { SVG } = require('mathjax-full/js/output/svg.js');
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js');
// Initialize MathJax
const MathJax = mathjax.init({
    loader: { load: ['input/tex', 'output/svg'] },
    tex: { packages: AllPackages }
});
const svg = new SVG({ fontCache: 'none' });
const tex = new TeX({ packages: AllPackages });
const doc = MathJax.document('', { InputJax: tex, OutputJax: svg });
function positionFrameNode(textNode, frameNode, index) {
    const textPosition = textNode.absoluteTransform;
    frameNode.x = textPosition[0][2] + textNode.width * (index / textNode.characters.length);
    frameNode.y = textPosition[1][2];
    figma.currentPage.appendChild(frameNode);
}
export function renderAndReportLatex(textNode, latex, startIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const svgOutput = doc.convert(latex, { display: true });
            const svgString = svgOutput.innerHTML;
            const frameNode = figma.createNodeFromSvg(svgString);
            const placeholder = '';
            textNode.insertCharacters(startIndex, placeholder, 'BEFORE');
            textNode.deleteCharacters(startIndex + 1, startIndex + latex.length + 5);
            positionFrameNode(textNode, frameNode, startIndex);
            textNode.setRangeFontName(startIndex, startIndex + 1, { family: 'LaTeX', style: 'Equation' });
            textNode.setRangeHyperlink(startIndex, startIndex + 1, { type: 'URL', value: `latex://${encodeURIComponent(latex)}` });
        }
        catch (error) { }
    });
}
