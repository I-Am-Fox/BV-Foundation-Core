import { visit } from 'unist-util-visit';

export default function rehypeGlitchEcho() {
  return (tree: any) => {
    visit(tree, 'text', (node, index, parent) => {
      if (
        node.value.includes('Echo Trace') &&
        (!parent.tagName ||
          parent.tagName !== 'span' ||
          !parent.properties?.className?.includes('glitch-text'))
      ) {
        const parts = node.value.split(/(Echo Trace)/gi);
        const newNodes = parts.map((part: string) =>
          part.toLowerCase() === 'echo trace'
            ? {
                type: 'element',
                tagName: 'span',
                properties: { className: ['glitch-text', 'text-fuchsia-300'] },
                children: [{ type: 'text', value: part }],
              }
            : { type: 'text', value: part }
        );

        parent.children.splice(index!, 1, ...newNodes);
      }
    });
  };
}
