
// import React, { useState } from "react";
// import { StyleSheet } from "react-native";
// import {
//   ViroARScene,
//   ViroTrackingStateConstants,
//   ViroARSceneNavigator,
//   ViroTrackingReason,
//   Viro3DObject,
//   ViroAmbientLight,
//    ViroARPlaneSelector,
// } from "@reactvision/react-viro";

// const DogSceneAR = () => {
//   function onInitialized(state: any, reason: ViroTrackingReason) {
//     console.log("guncelleme", state, reason);
//     if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
//     } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
//       // Handle loss of tracking
//     }
//   }

//   return (
//     <ViroARScene onTrackingUpdated={onInitialized}>
//       <ViroAmbientLight color="#FFFFFF" />
//       <ViroARPlaneSelector>
//         <Viro3DObject
//           source={require("../../assets/3d/shibu.glb")}
//           type="GLB"
//           scale={[0.02, 0.02, 0.02]}
//           position={[1, 0, 0]}
//           rotation={[0, 270, 0]}
//           onLoadStart={() => console.log("Loading object...")}
//           onLoadEnd={() => console.log("Finished Loading object")}
//           onError={({ nativeEvent }) =>
//             console.log("Damn, something went wrong: ", nativeEvent)
//           }
//           dragType="FixedDistance" onDrag={()=>{}}
//           animation={{
//               name: "0|sitting_0",
//               run: true,
//               loop: true,
//               delay: 2000,
//             }}
//         />
//       </ViroARPlaneSelector>
//     </ViroARScene>
//   );
// };

// export default () => {
//   return (
//     <ViroARSceneNavigator
//       autofocus={true}
//       initialScene={{
//         scene: DogSceneAR,
//       }}
//       style={styles.f1}
//     />
//   );
// };

// var styles = StyleSheet.create({
//   f1: { flex: 1 },
//   helloWorldTextStyle: {
//     fontFamily: "Arial",
//     fontSize: 30,
//     color: "#ffffff",
//     textAlignVertical: "center",
//     textAlign: "center",
//   },
// });

import React from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroTrackingStateConstants,
  ViroTrackingReason,
  ViroARPlaneSelector,
} from "@reactvision/react-viro";

const DogSceneAR = () => {
  function onInitialized(state: any, reason: ViroTrackingReason) {
    console.log("guncelleme", state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      // Handle loss of tracking
    }
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroAmbientLight color="#FFFFFF" />
      <ViroARPlaneSelector>
        <Viro3DObject
          source={require("../../components/models/ShibaInu.glb")}
          type="GLB"
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, -1]}
          rotation={[0, 0, 0]}
          onLoadStart={() => console.log("Loading ShibaInu model...")}
          onLoadEnd={() => console.log("Finished loading ShibaInu model")}
          onError={({ nativeEvent }) =>
            console.log("Error loading ShibaInu model: ", nativeEvent)
          }
          dragType="FixedDistance"
          onDrag={() => {}}
          animation={{
            name: "idle", // Ensure this animation name matches one in the FBX file's animations
            run: true,
            loop: true,
            delay: 0,
          }}
          onAnchorUpdated={(anchor) => {
            const cameraPosition = anchor.cameraTransform.position;
            const objectPosition = anchor.position;
            const dx = cameraPosition[0] - objectPosition[0];
            const dz = cameraPosition[2] - objectPosition[2];
            const angle = (Math.atan2(dx, dz) * 180) / Math.PI;
            anchor.rotation = [0, angle, 0];
          }}
        />
      </ViroARPlaneSelector>
    </ViroARScene>
  );
};

export default function SceneAR() {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: DogSceneAR,
      }}
      style={styles.f1}
    />
  );
}

var styles = StyleSheet.create({
  f1: { flex: 1 },
});