import React from "react";
import { ViroARScene, Viro3DObject, ViroDirectionalLight, ViroAmbientLight } from "@viro-community/react-viro";

const dogModel = require('../assets/3d/pitbull.glb');

const MyARScene: React.FC = () => {
  return (
    <ViroARScene>
      <ViroAmbientLight color="#FFFFFF" intensity={500} />
      <ViroDirectionalLight
        color="#FFFFFF"
        direction={[0, -1, -0.5]}
        shadowOrthographicPosition={[0, 3, -1]}
        shadowOrthographicSize={5}
        shadowNearZ={1}
        shadowFarZ={4}
        castsShadow={true}
      />

      <Viro3DObject
        source={dogModel} // Locatie van het 3D-model
        position={[0, 0, -2]} // Plaatsing in de 3D-ruimte, iets verder van de camera
        scale={[2, 2, 2]}  // Grootte van het object
        type="GLB"
        
      />
    </ViroARScene>
  );
};

export default MyARScene;