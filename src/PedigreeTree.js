import React, { useRef } from 'react';
import { Box, Button, Heading, Text } from 'grommet';
import Tree from 'react-d3-tree';

function handleKeyPress(e, toggleNode, nodeDatum) {
  if (e.key === "Enter" || e.key === " ") {
    toggleNode();
    console.log(nodeDatum);
  }
  if (e.key === "ArrowRight") {
    console.log("right arrow")
    // move focus to first child node (aka the dog's first parent)
  }
  if (e.key === "ArrowLeft") {
    console.log("left arrow")
    // move focus to parent node (aka the dog's child)
  }
  if (e.key === "ArrowDown") {
    console.log("down arrow")
    // move focus to next node of same depth
  }
  if (e.key === "ArrowUp") {
    console.log("up arrow")
    // move focus to previous node of same depth
  }
  // if (e.key === "Enter") {
  //   manageTreeRef.current.focus()
  // }
}

const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  // manageTreeRef,
  foreignObjectProps,
  visibleAttributeProps,
  setCurrentNode,
  currentNode,
  currentNodeRef
}) => (
  <g>
    {/* `foreignObject` requires width & height to be explicitly set. */}
    <foreignObject {...foreignObjectProps}>
      <div style={{ height: "92%", width: "97%" }} data-xmlns="http://www.w3.org/1999/xhtml">
        <Box
          id="node"
          tabIndex="0"
          // tabIndex={nodeDatum === currentNode ? "0" : "-1"} // this should only be uncommented once arrow key nav is completely functioning
          onKeyDown={(e) => handleKeyPress(e, toggleNode, nodeDatum)}
          onFocus={() => { setCurrentNode(nodeDatum); console.log("current node set to " + nodeDatum.name) }}
          ref={currentNodeRef}
          background="light-2"
          elevation="large"
          fill={true}
          className={nodeDatum === currentNode ? "currentlySelected" : ""}
        >
          <Box flex={true} pad="medium" justify="around">
            <Heading size="xxsmall" truncate={true} textAlign="center" margin="none" pad="none" gap="none" align="center">
              {nodeDatum.name}
            </Heading>
            <Box align="center" gap="small">
              {visibleAttributeProps.sex && (<Text size="xxlarge">Sex: {nodeDatum.attributes.sex}</Text>)}
              {visibleAttributeProps.color && (<Text size="xxlarge">Color: {nodeDatum.attributes.color}</Text>)}
              {visibleAttributeProps.birthday && (<Text size="xxlarge">Birthday: {nodeDatum.attributes.birthday}</Text>)}
              {visibleAttributeProps.hips && (<Text size="xxlarge">Hips: {nodeDatum.attributes.hips}</Text>)}
              {nodeDatum.children.length !== 0 && (
                <div>
                  <Button
                    onClick={(e) => { toggleNode(e); currentNodeRef.current.focus() }}
                    tabIndex="-1"
                    label={nodeDatum.__rd3t.collapsed ? "Show Ancestors" : "Hide Ancestors"}
                    size="xxlarge"
                  />
                </div>
              )}
              {nodeDatum.children.length === 0 && (
                <Text size="xxlarge">No Known Ancestors</Text>
              )}
            </Box>
          </Box>
        </Box>
      </div>
    </foreignObject>
  </g >
);

export default function PedigreeTree({ pedigree, manageTreeRef, visibleAttributeProps, setCurrentNode, currentNode }) {
  const nodeSize = { x: 500, y: 250 };
  const nodePositionX = nodeSize.x / -2;
  const nodePositionY = nodeSize.y / -2;
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: nodePositionX, y: nodePositionY };
  const currentNodeRef = useRef();

  return (
    // `<Tree />` will fill width/height of its container`.
    <div className="treeWrapper">
      <Tree
        data={pedigree}
        initialDepth="4"
        pathFunc="step"
        depthFactor="700"
        zoom=".25"
        nodeSize={nodeSize}
        // dimensions={{ height: 300, width: 600 }}  // should automatically center the currently focused node if defined properly
        separation={{ nonSiblings: 1.4, siblings: 1.2 }}
        scaleExtent={{ max: .5, min: .05 }}
        translate={{ x: 100, y: 350 }}
        pathClassFunc={() => 'path'}
        renderCustomNodeElement={(rd3tProps) =>
          renderForeignObjectNode({
            ...rd3tProps,
            // manageTreeRef,
            foreignObjectProps,
            visibleAttributeProps,
            setCurrentNode,
            currentNode,
            currentNodeRef
          })
        }
      />
    </div>
  );
}