import { useEffect, useState } from 'react';
import './App.css';
import AddNode from './component/AddNode';
import Show from './component/Show';

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
            setNodes(data);
        } catch (error) {
            console.log('Error in fetch', error);
        }
    }

    return (
        <div className="app-container">
            <header>
                <h1>Distributed Hash Table Visualization</h1>
                <p>Add a node to the DHT and visualize the current nodes.</p>
            </header>

            <div className="content">
                <div className="left-panel">
                    <AddNode onAddNode={fetchNodes} />
                </div>
                <div className="right-panel">
                    <Show nodes={nodes} />
                </div>
            </div>
        </div>
    );
}

export default App;
