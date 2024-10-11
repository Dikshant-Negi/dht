import React from 'react';
import './style.css'; 

const ChordDHT = ({ nodes }) => {
    const radius = 200; 
    const centerX = 250; 
    const centerY = 250;

    const calculateNodePosition = (index, totalNodes) => {
        const angle = (2 * Math.PI * index) / totalNodes; 
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return { x, y };
    };

    return (
        <div className="chord-container">
            <svg width="500" height="500">
                {/* Render each node */}
                {nodes.map((node, index) => {
                    const position = calculateNodePosition(index, nodes.length);
                    return (
                        <g key={`${node.node_id}-${index}`}> {/* Ensure unique key */}
                            <circle
                                cx={position.x}
                                cy={position.y}
                                r="20"
                                fill="blue"
                            />
                            {/* Draw the node IP address */}
                            <text
                                x={position.x}
                                y={position.y}
                                fill="white"
                                textAnchor="middle"
                                dy=".3em"
                                fontSize="10" // Set font size for better visibility
                            >
                                {node.node_id} {/* Display the IP address */}
                            </text>

                            {/* Draw lines to the successor node */}
                            {node.successor !== null && (
                                <line
                                    x1={position.x}
                                    y1={position.y}
                                    x2={calculateNodePosition(node.successor, nodes.length).x}
                                    y2={calculateNodePosition(node.successor, nodes.length).y}
                                    stroke="black"
                                />
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default ChordDHT;
