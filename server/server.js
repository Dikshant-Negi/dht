const express = require('express');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const m = 4; // The number of bits in the key space (2^m possible keys)
let nodes = [];

// Hash the key and mod it to fall within the range [0, 2^m)
const hashKey = (key) => {
    const hash = crypto.createHash('sha1').update(JSON.stringify(key)).digest('hex');
    
    // Convert the hash to a BigInt to handle large numbers
    const hashInt = BigInt('0x' + hash);  // Convert hex to BigInt

    // Mod the hash to fit within the keyspace [0, 2^m)
    const maxSize = BigInt(2 ** m); // 2^m as BigInt
    return Number(hashInt % maxSize);
};

// Find the successor node for a given node ID
function findSuccessor(nodeId) {
    if (nodes.length === 0) {
        return nodeId; // If no nodes are present, return the node itself
    }

    // Sort nodes by node_id to find the successor in the circular space
    nodes.sort((a, b) => a.node_id - b.node_id);

    // Find the first node whose ID is greater than or equal to nodeId
    for (let node of nodes) {
        if (node.node_id >= nodeId) {
            return node.node_id;
        }
    }

    // If no such node is found, wrap around and return the first node in the ring
    return nodes[0].node_id;
}

// Create the finger table for the given node ID
function createFingerTable(nodeId) {
    let fingerTable = [];

    // For each entry in the finger table, calculate the start and successor
    for (let i = 0; i < m; i++) {
        let start = (nodeId + Math.pow(2, i)) % (2 ** m);  // Start position of this finger
        let successor = findSuccessor(start);  // Find successor for this interval
        fingerTable.push({ start, successor });
    }

    return fingerTable;
}

// Stabilize the network by updating the successor and finger tables of all nodes
function stabilize() {
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].successor = findSuccessor(nodes[i].node_id + 1); // Update successor for this node
        nodes[i].fingerTable = createFingerTable(nodes[i].node_id); // Recreate finger table
    }
}

// Endpoint to add a node to the Chord DHT
app.post('/add_node', (req, res) => {
    const { ip } = req.body;

    if (!ip) {
        return res.status(400).json({ error: 'IP address is required' });
    }

    // Hash the IP address to get the node ID
    const nodeId = hashKey(ip);
    console.log(`Computed nodeId: ${nodeId}`);

    // Find the successor and create the finger table for the new node
    const _successor = findSuccessor(nodeId);
    const fingerTable = createFingerTable(nodeId);

    // Add the new node to the list of nodes
    const newNode = {
        node_id: nodeId,
        successor: _successor,
        fingerTable: fingerTable
    };
    nodes.push(newNode);

    // After adding the new node, stabilize the network
    stabilize();

    res.json({ message: 'Node added', node: newNode, allNodes: nodes });
});

// Endpoint to retrieve all nodes in the DHT
app.get('/nodes', (req, res) => {
    res.json(nodes);
});

// Start the Express server
app.listen(port, () => {
    console.log(`Listening at localhost:${port}`);
});
