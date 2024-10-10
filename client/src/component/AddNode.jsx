import React, { useRef } from 'react';

function AddNode({ onAddNode }) {
    const ref = useRef(null);

    async function onSubmit(e) {
        e.preventDefault(); 

        const ip = ref.current.value; 

        if (!ip) {
            alert('Please enter an IP address');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/add_node', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ip }), 
            });

            const data = await response.json();
            console.log('Node added:', data);

            ref.current.value = ''; // Clear the input field

            if (onAddNode) {
                onAddNode(); // Optionally call the callback if it's provided
            }
        } catch (error) {
            console.log(`Error in adding node: ${error}`);
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <input type="text" ref={ref} placeholder="Enter IP Address" />
            <button type="submit">Add Node</button>
        </form>
    );
}

export default AddNode;
