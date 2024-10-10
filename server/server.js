const express =require('express');
const  crypto =require('crypto');
const cors =require('cors'); 

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

const m = 4;
let nodes = [];
const hashKey = (key) => {
    return parseInt(crypto.createHash('sha1').update(JSON.stringify(key)).digest('hex'), 16);
};


function findSuccessor(nodeId) {
    if (nodes.length === 0) {
        return nodeId;
    }

    nodes.sort((a, b) => a.node_id - b.node_id);

    for (let node of nodes) {
        if (node.node_id >= nodeId) {
            return node.node_id;
        }
    }

    return nodes[0].node_id;
}

function createFingerTable(nodeId) {
    let fingerTable = [];

    for (let i = 0; i < m; i++) {
        let start = (nodeId + Math.pow(2, i)) % (2 ** m);
        let successor = findSuccessor(start);
        fingerTable.push({ start, successor });
    }

    return fingerTable;
}

app.post('/add_node', (req, res) => {
    const { ip } = req.body;
    if (!ip) {
        return res.status(400).json({ error: 'IP address is required' });
    }
    console.log(ip)
    const nodeId = hashKey(ip);
    console.log(`Computed nodeId: ${nodeId}`);
    // console.log(hashKey("192.168.1.1"));
    const _successor = findSuccessor(nodeId);
    const fingerTable = createFingerTable(nodeId);

    const newNode = {
        node_id: nodeId,
        successor: _successor,
        fingerTable: fingerTable
    };

    nodes.push(newNode);

    res.json({ message: 'Node added', node: newNode, allNodes: nodes });
});
app.get('/nodes', (req, res) => {
    res.json(nodes);
});
app.listen(port, () => {
    console.log(`Listening at localhost:${port}`);
});
