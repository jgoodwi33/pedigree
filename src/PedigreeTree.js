import React from 'react';
import { Box, Button, Heading, Text } from 'grommet';
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
      <div style={{ height: "92%", width: "97%" }} data-xmlns="http://www.w3.org/1999/xhtml">
        <Box
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
          onFocus={() => { setCurrentNode(nodeDatum) }}
          background="light-2"
          elevation="large"
          fill={true}
          id="node"
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
                    onClick={toggleNode}
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

export default function PedigreeTree({ pedigree, setCurrentNode, manageTreeRef, visibleAttributeProps }) {
  const nodeSize = { x: 500, y: 250 };
  const nodePositionX = nodeSize.x / -2;
  const nodePositionY = nodeSize.y / -2;
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: nodePositionX, y: nodePositionY };
  return (
    // `<Tree />` will fill width/height of its container`.
    <div className="treeWrapper">
      <Tree
        data={pedigree}
        initialDepth="4"
        pathFunc="step"
        depthFactor="700"
        zoom=".05"
        nodeSize={nodeSize}
        separation={{ nonSiblings: 1.4, siblings: 1.2 }}
        scaleExtent={{ max: .5, min: .05 }}
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