"use client"
import React from 'react';
import { useState } from 'react';
import Popup from '../component/popup.jsx';


const WorkspacePage = () => {
    const[open, setOpen] = useState(false);
    
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <button onClick={() => setOpen(true)}>Click Me</button>
            {open && <Popup onClose={() => setOpen(false)} />}
        </div>
    );
};

export default WorkspacePage;