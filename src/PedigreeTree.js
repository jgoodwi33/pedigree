import React from 'react';
import Tree from 'react-d3-tree';
import PedigreeNode from './PedigreeNode';

export default function PedigreeTree({ pedigree, visibleAttribute, currentNode, setCurrentNode }) {
  const nodeSize = { x: 500, y: 250 };
  const nodePositionX = nodeSize.x / -2;
  const nodePositionY = nodeSize.y / -2;
  const foreignObjectSize = { width: nodeSize.x, height: nodeSize.y, x: nodePositionX, y: nodePositionY };

  return (
    // `<Tree />` will fill width/height of its container`.
    <div className="treeWrapper">
      <Tree
        data={pedigree}
        // initialDepth="4" // commented out for testing
        pathFunc="step"
        depthFactor="700"
        zoom=".25"
        nodeSize={nodeSize}
        // collapsible="false" // This is set to false to prevent nodes from being expanded/collapsed whenever onNodeClick fires. onNodeClick will still fire, but it will not change the target node's expanded/collapsed state.
        // dimensions={{ height: 300, width: 600 }}  // This should automatically center the currently focused node if defined properly
        separation={{ nonSiblings: 1.4, siblings: 1.2 }}
        scaleExtent={{ max: .5, min: .05 }}
        translate={{ x: 100, y: 350 }}
        pathClassFunc={() => 'path'}
        renderCustomNodeElement={(rd3tProps) =>
          PedigreeNode({
            ...rd3tProps,
            foreignObjectSize,
            visibleAttribute,
            setCurrentNode,
            currentNode,
          })
        }
      />
    </div>
  );
}