import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  Handle,
} from "react-flow-renderer";
import { nodes as initialNodes, edges as initialEdges } from "./elements";
import { Button, Modal, Input, Form,Select } from "antd";
import './index.css'


const CircleNode = ({ data }) => {
  return (
    <div style={{ borderRadius: '50%', padding: '10px', background: '#D6D5E6', border: '1px solid #222138', position: 'relative' }}>
      {data.label}
      <Handle type="source" position="top" style={{ top: '-8px', left: '50%', transform: 'translateX(-50%)' }} />
      <Handle type="target" position="top" style={{ top: '-8px', left: '50%', transform: 'translateX(-50%)' }} />
      <Handle type="source" position="bottom" style={{ bottom: '-8px', left: '50%', transform: 'translateX(-50%)' }} />
      <Handle type="target" position="bottom" style={{ bottom: '-8px', left: '50%', transform: 'translateX(-50%)' }} />
      <Handle type="source" position="left" style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }} />
      <Handle type="target" position="left" style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }} />
      <Handle type="source" position="right" style={{ right: '-8px', top: '50%', transform: 'translateY(-50%)' }} />
      <Handle type="target" position="right" style={{ right: '-8px', top: '50%', transform: 'translateY(-50%)' }} />
    </div>
  );
};



const HexagonNode = ({ data }) => {
  return (
    <div style={{ position: 'relative' }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="#D6D5E6" stroke="#222138" strokeWidth="2" />
        <text x="50%" y="50%" alignmentBaseline="middle" textAnchor="middle" fill="#222138" fontSize="12">
          {data.label}
        </text>
      </svg>
      <Handle type="source" position="top" style={{ top: '-8px', left: '50%', transform: 'translateX(-50%)' }} />
      <Handle type="target" position="top" style={{ top: '-8px', left: '50%', transform: 'translateX(-50%)' }} />
      <Handle type="source" position="bottom" style={{ bottom: '-8px', left: '50%', transform: 'translateX(-50%)' }} />
      <Handle type="target" position="bottom" style={{ bottom: '-8px', left: '50%', transform: 'translateX(-50%)' }} />
      <Handle type="source" position="left" style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }} />
      <Handle type="target" position="left" style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }} />
      <Handle type="source" position="right" style={{ right: '-8px', top: '50%', transform: 'translateY(-50%)' }} />
      <Handle type="target" position="right" style={{ right: '-8px', top: '50%', transform: 'translateY(-50%)' }} />
    </div>
  );
};


// Register the custom node with React Flow
const nodeTypes = {
  circle: CircleNode,
  hexagon: HexagonNode,
  // Add other custom node components here
};




function ReactFlowRenderer() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [action, setAction] = useState(null); // 'edit' or 'delete'
  const [nodeShape, setNodeShape] = useState('rectangle');

const [selectedEdge, setSelectedEdge] = useState(null); 
const [isEdgeModalVisible, setIsEdgeModalVisible] = useState(false); 

const onConnect = useCallback(
  (params) =>
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          type: ConnectionLineType.SmoothStep,
          animated: true,
          style: { stroke: "red", strokeWidth: 8 }, // Updated this line to make the line bold and solid
        },
        eds
      )
    ),
  [setEdges]
);

  
  const getNodeId = () => Math.random();
  function onInit() {
    console.log("Logged");
  }
  function displayCustomNamedNodeModal() {
    setSelectedNode(null);
    setIsModalVisible(true);
  }
  
  function handleCancel() {
    setIsModalVisible(false);
  }
  function handleOk(data) {
    onAdd(data.nodeName);
    setIsModalVisible(false);
  }
  const onAdd = useCallback(
    (data, shape) => {
      const newNode = {
        id: String(getNodeId()),
        type: shape, // Set the node type based on the selected shape
        data: { label: data },
        position: {
          x: 50,
          y: 0,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, nodeShape] // Added nodeShape dependency
  );
  
  
  

  const onElementClick = (event, element) => {
    if (element.type === 'node') {
      const index = nodes.findIndex((node) => node.id === element.id);
      setSelectedNode({ node: element, index });
      setIsModalVisible(true);
    }
  };

  const onNodeDoubleClick = (event, node) => {
    setSelectedNode(node);
    setIsModalVisible(true);
  };
  
  function handleOk(data) {
    setNodeShape(data.nodeShape); // Update the nodeShape state
    if (selectedNode) {
      const updatedNodes = nodes.map(node =>
        node.id === selectedNode.id
          ? { ...node, data: { label: data.nodeName } }
          : node
      );
      setNodes(updatedNodes);
    } else {
      onAdd(data.nodeName, nodeShape);
    }
    setIsModalVisible(false);
    setSelectedNode(null);
    setAction(null); // Reset action state
  }
  
  function handleCancel() {
    setIsModalVisible(false);
    setAction(null); // Reset action state
  }
  


  function handleDelete() {
    if (selectedNode) {
      const updatedNodes = nodes.filter(node => node.id !== selectedNode.id);
      setNodes(updatedNodes);
    }
    setIsModalVisible(false);
    setSelectedNode(null);
    setAction(null);
  }
  


  const onEdgeDoubleClick = (event, edge) => {
    setSelectedEdge(edge);
    setIsEdgeModalVisible(true); // Show the modal on double-clicking an edge
  };

  const deleteEdge = () => {
    if (selectedEdge) {
      const updatedEdges = edges.filter(edge => edge.id !== selectedEdge.id);
      setEdges(updatedEdges);
      setSelectedEdge(null); // Reset the selected edge after deletion
      setIsEdgeModalVisible(false); // Hide the modal after deletion
    }
  };

  const handleEdgeModalCancel = () => {
    setSelectedEdge(null); // Reset the selected edge when the modal is cancelled
    setIsEdgeModalVisible(false); // Hide the modal when cancelled
  };

  
  
  return (
    <div style={{ height: "100vh", margin: "10px" }}>
     <Modal
  title={selectedNode ? "Edit or Delete Node" : "Add Node"}
  visible={isModalVisible}
  onCancel={handleCancel}
  footer={null} // Remove the default footer buttons
>
  {selectedNode ? (
    action === 'edit' ? (
      <Form onFinish={handleOk} autoComplete="off" name="edit node">
        <Form.Item label="Node Name" name="nodeName" initialValue={selectedNode.data.label}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    ) : (
      <div>
        <p>Do you want to edit or delete this node?</p>
        <Button onClick={() => setAction('edit')} style={{ marginRight: '10px' }}>Edit</Button> {/* Added marginRight style */}
        <Button danger onClick={handleDelete}>Delete</Button>
      </div>
    )
  ) : (
    <Form onFinish={handleOk} autoComplete="off" name="new node">
  <Form.Item label="Node Name" name="nodeName">
    <Input />
  </Form.Item>
  <Form.Item label="Node Shape" name="nodeShape">
    <Select defaultValue="rectangle" onChange={value => setNodeShape(value)}>
      <Select.Option value="rectangle">Rectangle</Select.Option>
      <Select.Option value="circle">Circle</Select.Option>
      {/* <Select.Option value="hexagon">Hexagon</Select.Option> */}
    </Select>
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType="submit">
      Submit
    </Button>
  </Form.Item>
</Form>
  )}
</Modal>


      <Button type="primary" onClick={() => displayCustomNamedNodeModal()}>
        Add Custom Name Node
      </Button>
      <ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  onInit={onInit}
  fitView
  attributionPosition="bottom-left"
  connectionLineType={ConnectionLineType.SmoothStep}
  onNodeDoubleClick={onNodeDoubleClick}  // Add this line
  onEdgeDoubleClick={onEdgeDoubleClick}
  nodeTypes={nodeTypes} // Add this line
/>

<Modal
        title="Delete Edge"
        visible={isEdgeModalVisible}
        onOk={deleteEdge}
        onCancel={handleEdgeModalCancel}
      >
        <p>Do you want to delete this edge?</p>
      </Modal>
    </div>
  );
}

export default ReactFlowRenderer;













// import React, { useState, useCallback } from "react";
// import ReactFlow, {
//   addEdge,ReactFlowProvider,useReactFlowProvider,
//   useNodesState,
//   useEdgesState,
//   ConnectionLineType,
//   Handle,
// } from "react-flow-renderer";
// import { nodes as initialNodes, edges as initialEdges } from "./elements";
// import { Button, Modal, Input, Form,Select } from "antd";
// import './index.css'

// // import ReactFlow, { ReactFlowProvider, addEdge, useReactFlowProvider, ConnectionLineType, Handle } from 'react-flow-renderer';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { useDrag } from 'react-dnd';



// const CircleNode = ({ data }) => {
//   return (
//     <div style={{ borderRadius: '50%', padding: '10px', background: '#D6D5E6', border: '1px solid #222138', position: 'relative' }}>
//       {data.label}
//       {/* Handles */}
//     </div>
//   );
// };

// const HexagonNode = ({ data }) => {
//   return (
//     <div style={{ position: 'relative' }}>
//       {/* SVG and Handles */}
//     </div>
//   );
// };

// const nodeTypes = {
//   circle: CircleNode,
//   hexagon: HexagonNode,
// };


// const Shapes = [
//   { type: 'rectangle', label: 'Rectangle' },
//   { type: 'circle', label: 'Circle' },
//   // Add more shapes here...
// ];

// const DraggableShape = ({ shape, reactFlowInstance }) => {
//   const [, drag] = useDrag(() => ({
//     type: 'node',
//     item: {
//       type: shape.type,
//     },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//     end: (item, monitor) => {
//       const dropResult = monitor.getDropResult();
//       if (monitor.didDrop() && dropResult) {
//         const newNode = {
//           id: String(Math.random()),
//           type: shape.type,
//           data: { label: shape.label },
//           position: dropResult.position,
//         };
//         reactFlowInstance.setElements((prev) => [...prev, newNode]);
//       }
//     },
//   }));

//   return (
//     <div ref={drag} style={{ cursor: 'grab', marginBottom: '20px' }}>
//       {shape.label}
//     </div>
//   );
// };

// function Sidebar({ reactFlowInstance }) {
//   return (
//     <div className="sidebar">
//       {Shapes.map((shape) => (
//         <DraggableShape key={shape.type} shape={shape} reactFlowInstance={reactFlowInstance} />
//       ))}
//     </div>
//   );
// }




// function ReactFlowRenderer() {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedNode, setSelectedNode] = useState(null);
//   const [action, setAction] = useState(null); // 'edit' or 'delete'
//   const [nodeShape, setNodeShape] = useState('rectangle');

// const [selectedEdge, setSelectedEdge] = useState(null); 
// const [isEdgeModalVisible, setIsEdgeModalVisible] = useState(false); 


// const [reactFlowInstance, setReactFlowInstance] = useState(null);
// const [elements, setElements] = useState([]);
// // const onConnect = (params) => setElements((els) => addEdge(params, els));
// const onLoad = (instance) => setReactFlowInstance(instance);


// const onConnect = useCallback(
//   (params) =>
//     setEdges((eds) =>
//       addEdge(
//         {
//           ...params,
//           type: ConnectionLineType.SmoothStep,
//           animated: true,
//           style: { stroke: "red", strokeWidth: 8 }, // Updated this line to make the line bold and solid
//         },
//         eds
//       )
//     ),
//   [setEdges]
// );

  
//   const getNodeId = () => Math.random();
//   function onInit() {
//     console.log("Logged");
//   }
//   function displayCustomNamedNodeModal() {
//     setSelectedNode(null);
//     setIsModalVisible(true);
//   }
  
//   function handleCancel() {
//     setIsModalVisible(false);
//   }
//   function handleOk(data) {
//     onAdd(data.nodeName);
//     setIsModalVisible(false);
//   }
//   const onAdd = useCallback(
//     (data, shape) => {
//       const newNode = {
//         id: String(getNodeId()),
//         type: shape, // Set the node type based on the selected shape
//         data: { label: data },
//         position: {
//           x: 50,
//           y: 0,
//         },
//       };
//       setNodes((nds) => nds.concat(newNode));
//     },
//     [setNodes, nodeShape] // Added nodeShape dependency
//   );
  
  
  

//   const onElementClick = (event, element) => {
//     if (element.type === 'node') {
//       const index = nodes.findIndex((node) => node.id === element.id);
//       setSelectedNode({ node: element, index });
//       setIsModalVisible(true);
//     }
//   };

//   const onNodeDoubleClick = (event, node) => {
//     setSelectedNode(node);
//     setIsModalVisible(true);
//   };
  
//   function handleOk(data) {
//     setNodeShape(data.nodeShape); // Update the nodeShape state
//     if (selectedNode) {
//       const updatedNodes = nodes.map(node =>
//         node.id === selectedNode.id
//           ? { ...node, data: { label: data.nodeName } }
//           : node
//       );
//       setNodes(updatedNodes);
//     } else {
//       onAdd(data.nodeName, nodeShape);
//     }
//     setIsModalVisible(false);
//     setSelectedNode(null);
//     setAction(null); // Reset action state
//   }
  
//   function handleCancel() {
//     setIsModalVisible(false);
//     setAction(null); // Reset action state
//   }
  


//   function handleDelete() {
//     if (selectedNode) {
//       const updatedNodes = nodes.filter(node => node.id !== selectedNode.id);
//       setNodes(updatedNodes);
//     }
//     setIsModalVisible(false);
//     setSelectedNode(null);
//     setAction(null);
//   }
  


//   const onEdgeDoubleClick = (event, edge) => {
//     setSelectedEdge(edge);
//     setIsEdgeModalVisible(true); // Show the modal on double-clicking an edge
//   };

//   const deleteEdge = () => {
//     if (selectedEdge) {
//       const updatedEdges = edges.filter(edge => edge.id !== selectedEdge.id);
//       setEdges(updatedEdges);
//       setSelectedEdge(null); // Reset the selected edge after deletion
//       setIsEdgeModalVisible(false); // Hide the modal after deletion
//     }
//   };

//   const handleEdgeModalCancel = () => {
//     setSelectedEdge(null); // Reset the selected edge when the modal is cancelled
//     setIsEdgeModalVisible(false); // Hide the modal when cancelled
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="react-flow-renderer-container">
//       <Sidebar reactFlowInstance={reactFlowInstance} />
//         <div className="react-flow-renderer">
//           <ReactFlowProvider>
//             <ReactFlow
//               elements={elements}
//               onConnect={onConnect}
//               nodeTypes={nodeTypes}
//             />
//           </ReactFlowProvider>
//         </div>
//       </div>
//     </DndProvider>
//   );
// }

// export default ReactFlowRenderer;