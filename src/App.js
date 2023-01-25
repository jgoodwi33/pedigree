import React, { useRef, useState } from 'react';
import { Grommet, grommet } from 'grommet';
import PedigreeTree from './PedigreeTree';
import ManageTree from './ManageTree';
import { deepMerge } from 'grommet/utils';


const pedigree = require('./pedigree.json');
const attributes = {
  sex: false,
  color: false,
  birthday: false,
  hips: false,
};
const customTheme = deepMerge(grommet, {
  heading: {
    level: {
      2: {
        small: {
          size: '20px',
          height: '20px',
        },
      },
    },
  },
  accordion: {
    border: undefined,
  }
});

function App() {
  const [currentNode, setCurrentNode] = useState(pedigree);
  const [visibleAttribute, setVisibleAttribute] = useState(attributes)
  const manageTreeRef = useRef();

  return (
    <Grommet theme={customTheme}>
      <div className="App" style={{ height: "100vh" }}>
        <ManageTree
          currentNode={currentNode}
          manageTreeRef={manageTreeRef}
          visibleAttribute={visibleAttribute}
          setVisibleAttribute={(attributeObj) => setVisibleAttribute(attributeObj)}
        />
        <PedigreeTree
          pedigree={pedigree}
          setCurrentNode={(node) => setCurrentNode(node)}
          manageTreeRef={manageTreeRef}
          visibleAttributeProps={visibleAttribute}
        />
      </div>
    </Grommet>
  );
}

export default App;
