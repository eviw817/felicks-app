// import React, { useState } from "react";
// import { StyleSheet } from "react-native";
// import {
//   ViroARScene,
//   ViroText,
//   ViroTrackingStateConstants,
//   ViroARSceneNavigator,
//   ViroTrackingReason,
//   Viro3DObject,
// } from "@reactvision/react-viro";

// const DogSceneAR = () => {

//   return (
//     <ViroARScene>
//       <Viro3DObject source={require('../../assets/3d/scene.gltf')} type="GLTF" />
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

import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroTrackingStateConstants,
  ViroARSceneNavigator,
  ViroTrackingReason,
  Viro3DObject,
  ViroAmbientLight,
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
      <Viro3DObject
        source={require("../../assets/3d/pitbull.glb")}
        type="GLB"
        scale={[ 1, 1, 1 ]}
        position={[ 0, 0, 0 ]}
        onLoadStart={() => console.log("Loading object...")}
        onLoadEnd={() => console.log("Finished Loading object")}
        onError={({ nativeEvent }) =>
          console.log("Damn, something went wrong: ", nativeEvent)
        }
      />
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
