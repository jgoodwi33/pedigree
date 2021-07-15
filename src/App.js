import React, { useRef, useState } from 'react';
import { Grommet } from 'grommet';
import PedigreeTree from './PedigreeTree';
import ManageTree from './ManageTree';


const pedigree = require('./pedigree.json');
const attributes = {
  sex: false,
  color: false,
  birthday: false,
  hips: false,
};

function App() {
  const [currentNode, setCurrentNode] = useState(pedigree);
  const [visibleAttribute, setVisibleAttribute] = useState(attributes)
  const manageTreeRef = useRef();

  return (
    <Grommet>
      <div className="App" style={{ height: "98.5vh" }}>
        <PedigreeTree
          pedigree={pedigree}
          setCurrentNode={(node) => setCurrentNode(node)}
          manageTreeRef={manageTreeRef}
          visibleAttributeProps={visibleAttribute}
        />
        <ManageTree
          currentNode={currentNode}
          manageTreeRef={manageTreeRef}
          visibleAttribute={visibleAttribute}
          setVisibleAttribute={(attributeObj) => setVisibleAttribute(attributeObj)}
        />
      </div>
    </Grommet>
  );
}

export default App;
