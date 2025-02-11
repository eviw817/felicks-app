import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroTrackingStateConstants,
  ViroARSceneNavigator,
  ViroTrackingReason,
  Viro3DObject,
  ViroAmbientLight,
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
          source={require("../../assets/3d/shibu.vrx")}
          type="VRX"
          scale={[0.02, 0.02, 0.02]}
          position={[1, 0, 0]}
          rotation={[0, 270, 0]}
          onLoadStart={() => console.log("Loading object...")}
          onLoadEnd={() => console.log("Finished Loading object")}
          onError={({ nativeEvent }) =>
            console.log("Damn, something went wrong: ", nativeEvent)
          }
          dragType="FixedDistance" onDrag={()=>{}}
          animation={{
            name: "0|sitting_0",
            run: true,
            loop: true,
            delay: 0,
          }}
        />
      </ViroARPlaneSelector>
    </ViroARScene>
  );
};

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: DogSceneAR,
      }}
      style={styles.f1}
    />
  );
};

var styles = StyleSheet.create({
  f1: { flex: 1 },
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});

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
