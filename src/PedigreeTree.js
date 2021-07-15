import React from 'react';
import Tree from 'react-d3-tree';

const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  setCurrentNode,
  manageTreeRef,
  foreignObjectProps,
  visibleAttributeProps
}) => (
  <g>
    {/* `foreignObject` requires width & height to be explicitly set. */}
    <foreignObject {...foreignObjectProps}>
      <div
        className="node"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft"
            || e.key === "ArrowRight"
            || e.key === " ") {
            toggleNode()
          }
          if (e.key === "Enter") {
            manageTreeRef.current.focus()
          }
        }}
        onFocus={() => {
          console.log(nodeDatum)
          setCurrentNode(nodeDatum)
        }}
      >
        <div className="nodeContents">
          <div style={{ fontWeight: "700" }}>{nodeDatum.name}</div>
          {visibleAttributeProps.sex && (<div>Sex: {nodeDatum.attributes.sex}<br></br></div>)}
          {visibleAttributeProps.color && (<div>Color: {nodeDatum.attributes.color}<br></br></div>)}
          {visibleAttributeProps.birthday && (<div>Birthday: {nodeDatum.attributes.birthday}<br></br></div>)}
          {visibleAttributeProps.hips && (<div>Hips: {nodeDatum.attributes.hips}<br></br></div>)}
          {nodeDatum.children.length !== 0 && (
            <button style={{ width: "98%" }} onClick={toggleNode} tabIndex="-1">
              {nodeDatum.__rd3t.collapsed ? "Show Ancestors" : "Hide Ancestors"}
            </button>
          )}
          {nodeDatum.children.length === 0 && (
            <div>No Known Ancestors</div>
          )}
        </div>
      </div>
    </foreignObject>
  </g >
);

export default function PedigreeTree({ pedigree, setCurrentNode, manageTreeRef, visibleAttributeProps }) {
  const nodeSize = { x: 550, y: 120 };
  const nodePositionX = nodeSize.x / -2;
  const nodePositionY = nodeSize.y / -2;
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: nodePositionX, y: nodePositionY };
  return (
    // `<Tree />` will fill width/height of its container`.
    <div className="treeWrapper">
      <Tree
        data={pedigree}
        initialDepth="3"
        pathFunc="step"
        depthFactor="700"
        zoom=".3"
        nodeSize={nodeSize}
        separation={{ nonSiblings: 1.4, siblings: 1.2 }}
        scaleExtent={{ max: .5, min: .1 }}
        translate={{ x: 100, y: 200 }}
        pathClassFunc={() => 'path'}
        renderCustomNodeElement={(rd3tProps) =>
          renderForeignObjectNode({
            ...rd3tProps,
            setCurrentNode,
            manageTreeRef,
            foreignObjectProps,
            visibleAttributeProps
          })
        }
      />
    </div>
  );
}