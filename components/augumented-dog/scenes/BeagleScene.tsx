import {
  ViroAmbientLight,
  ViroARPlane,
  ViroNode,
  ViroARScene,
  ViroTrackingReason,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";
import { PropsWithChildren } from "react";
import { BeagleObject } from "../objects/BeagleObject";

type BeagleSceneProps = PropsWithChildren<ViroARScene["props"]>;
export const BeagleScene = ({ children, ...rest }: BeagleSceneProps) => {
  const onInitialized = (state: any, reason: ViroTrackingReason) => {
    console.log("Viro Initialized", state, reason);

    if (
      state === ViroTrackingStateConstants.TRACKING_NORMAL ||
      state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE
    ) {
      console.log(
        "We can't seem to track the location of where we need to place the object :(",
      );
    }
  };
  return (
    <ViroARScene onTrackingUpdated={onInitialized} {...rest}>
  <ViroAmbientLight color="#FFFFFF" />

  <ViroARPlane
    minHeight={0.1}
    minWidth={0.1}
    alignment="Horizontal"
    onAnchorFound={() => console.log("Plane found")}
  >
    <ViroNode position={[0, 0, 0]} dragType="FixedDistance">
      <BeagleObject
        scale={[0.2, 0.2, 0.2]}
        rotation={[0, 0, 0]}
        onLoadStart={() => console.log("Loading ShibaInu model...")}
        onLoadEnd={() => console.log("Finished loading ShibaInu model")}
        onError={({ nativeEvent }) =>
          console.log("Error loading ShibaInu model: ", nativeEvent)
        }
        animation={{
          name: "idle",
          run: true,
          loop: true,
          delay: 0,
        }}
      />
    </ViroNode>
  </ViroARPlane>
</ViroARScene>

  );
};