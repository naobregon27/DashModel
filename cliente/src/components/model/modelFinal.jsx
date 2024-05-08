import React, { useRef, useEffect } from 'react';
import '@google/model-viewer';




function Final() {




    return (
      <div>
        <h1>modelo 3D</h1>
     
        <model-viewer src="./SESSION_1710860318_2109702_mesh (1) (2).glb" alt="Descripción de tu modelo 3D" auto-rotate camera-controls></model-viewer>
       </div>
    );
    
  }
  
  export default Final;