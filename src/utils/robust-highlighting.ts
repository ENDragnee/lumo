// /utils/robust-highlighting.ts (NEW FILE)

/**
 * Uses a TreeWalker to iterate through only the text nodes of a container.
 * This is the foundation for a stable offset calculation.
 * @param el The container element (e.g., document.getElementById('content'))
 * @returns An array of all text nodes within the element.
 */
function getTextNodes(el: HTMLElement): Node[] {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const nodes: Node[] = [];
  let node;
  while ((node = walker.nextNode())) {
    // We ignore empty text nodes which can be created by whitespace between elements
    if (node.nodeValue?.trim() !== '') {
      nodes.push(node);
    }
  }
  return nodes;
}

/**
 * Calculates a robust start and end offset for a selection Range.
 * It does this by counting characters across text nodes only, which is
 * immune to changes in element structure (like adding a <div> or <b>).
 * @param range The selection Range object.
 * @param container The main content container element.
 * @returns An object with { start: number, end: number } or null if invalid.
 */
export function getRobustOffsets(range: Range, container: HTMLElement) {
  const allTextNodes = getTextNodes(container);
  let charCount = 0;
  let start = -1;
  let end = -1;

  for (const node of allTextNodes) {
    const nodeLength = node.nodeValue?.length || 0;

    // Check if the start of the range is in this node
    if (start === -1 && node === range.startContainer) {
      start = charCount + range.startOffset;
    }

    // Check if the end of the range is in this node
    if (end === -1 && node === range.endContainer) {
      end = charCount + range.endOffset;
      break; // We've found both, no need to continue
    }

    charCount += nodeLength;
  }
  
  // Handle cases where selection spans multiple nodes
  if (start !== -1 && end === -1) {
    // This can happen if the end is in a later node. We already have the total
    // length up to the end of the last processed node, so we're good.
    // Let's find the end node explicitly if it wasn't found.
    let tempCharCount = 0;
    for (const node of allTextNodes) {
        if (node === range.endContainer) {
            end = tempCharCount + range.endOffset;
            break;
        }
        tempCharCount += node.nodeValue?.length || 0;
    }
  }

  if (start === -1 || end === -1) {
    console.error("Could not determine highlight offsets. Selection might be invalid.");
    return null;
  }
  
  return { start, end };
}

/**
 * Reconstructs a Range object from robust start and end offsets.
 * It walks the text nodes to find the exact start and end points.
 * @param container The main content container element.
 * @param startOffset The saved start offset.
 * @param endOffset The saved end offset.
 * @returns A Range object or null if the offsets are out of bounds.
 */
export function recreateRangeFromOffsets(container: HTMLElement, startOffset: number, endOffset: number): Range | null {
  const allTextNodes = getTextNodes(container);
  const range = document.createRange();
  let charCount = 0;
  let foundStart = false;

  for (const node of allTextNodes) {
    const nodeLength = node.nodeValue?.length || 0;

    if (!foundStart && startOffset < charCount + nodeLength) {
      range.setStart(node, startOffset - charCount);
      foundStart = true;
    }
    
    if (foundStart && endOffset <= charCount + nodeLength) {
      range.setEnd(node, endOffset - charCount);
      return range;
    }
    
    charCount += nodeLength;
  }

  return null; // Offsets were out of bounds
}
