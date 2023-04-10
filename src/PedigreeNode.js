import React from 'react';
import { Box, Button, Heading, Text } from 'grommet';

function handleKeyPress(e, toggleNode) {
    if (e.key === " ") {
        toggleNode();
    }
    if (e.key === "Enter") {
        document.getElementById("dogDetails").focus()
    }
}

function updateCurrentNode(nodeDatum, setCurrentNode) {
    setCurrentNode(nodeDatum)
    // console.log("current node set to " + nodeDatum.name)
    console.log(nodeDatum)
}

function getDisplayValue(visibleAttribute, nodeDatum) {
    let label = visibleAttribute.label
    let value = visibleAttribute.value
    if (value !== "none") {
        return (
            <Text size="xxlarge">{label}: {nodeDatum.attributes[value]}</Text>
        )
    }
}

export default function PedigreeNode({
    nodeDatum,
    toggleNode,
    foreignObjectSize,
    visibleAttribute,
    setCurrentNode,
    currentNode }) {

    return (
        <g>
            {/* `foreignObject` requires width & height to be explicitly set. */}
            <foreignObject {...foreignObjectSize}>
                <div style={{ height: "93%", width: "97%" }} data-xmlns="http://www.w3.org/1999/xhtml">
                    <Box
                        id="node"
                        tabIndex="0"
                        onKeyDown={(e) => handleKeyPress(e, toggleNode)}
                        onFocus={() => { updateCurrentNode(nodeDatum, setCurrentNode) }}
                        background="light-2"
                        elevation="large"
                        fill={true}
                        className={nodeDatum.name === currentNode.name ? "currentlySelected" : ""}
                    >
                        <Box flex={true} pad="medium" justify="around">
                            <Heading size="xxsmall" truncate={true} textAlign="center" margin="none" pad="none" gap="none" align="center">
                                {nodeDatum.name}
                            </Heading>
                            <Box align="center" gap="small">
                                {getDisplayValue(visibleAttribute, nodeDatum)}
                                {nodeDatum.children.length === 0 && (
                                    <Text size="xxlarge">No Known Ancestors</Text>
                                )}
                                {nodeDatum.children.length !== 0 && (
                                    <div>
                                        <Button
                                            onClick={(e) => {
                                                toggleNode(e)
                                            }}
                                            tabIndex="-1"
                                            label={nodeDatum.__rd3t.collapsed ? "Show Ancestors" : "Hide Ancestors"}
                                            size="xxlarge"
                                        />
                                    </div>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </div>
            </foreignObject>
        </g >
    );
}