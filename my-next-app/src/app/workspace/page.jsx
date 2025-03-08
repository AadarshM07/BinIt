"use client"
import React from 'react';
import { useState } from 'react';
import SubmitPopup from '../component/submitPopup';


const WorkspacePage = () => {
    const[open, setOpen] = useState(false);
    
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <button onClick={() => setOpen(true)}>Click Me</button>
            {open && <SubmitPopup onClose={() => setOpen(false)} />}
        </div>
    );
};

export default WorkspacePage;