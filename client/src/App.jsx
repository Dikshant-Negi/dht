import { useEffect, useState } from 'react';
import './App.css';
import AddNode from './component/AddNode';
import Show from './component/Show';
 // Make sure to import ChordDHT

function App() {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        fetchNodes();
    }, []);

    async function fetchNodes() {
        try {
            const response = await fetch('http://localhost:3000/nodes');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            setNodes(data);
        } catch (error) {
            console.log('Error in fetch', error);
        }
    }

    return (
        <>
            
            <AddNode onAddNode={fetchNodes} /> 
            <Show nodes={nodes} /> 
        </>
    );
}

export default App;
