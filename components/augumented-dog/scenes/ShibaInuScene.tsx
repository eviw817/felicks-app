import {
  ViroAmbientLight,
  ViroARPlaneSelector,
  ViroARScene,
  ViroTrackingReason,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";
import { PropsWithChildren } from "react";
import { ShibaInuObject } from "../objects/ShibaInuObject";

type ShibaInuSceneProps = PropsWithChildren<ViroARScene["props"]>;
export const ShibaInuScene = ({ children, ...rest }: ShibaInuSceneProps) => {
  const onInitialized = (state: any, reason: ViroTrackingReason) => {

    if (
      state === ViroTrackingStateConstants.TRACKING_NORMAL ||
      state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE
    ) {}
  };
  return (
    <ViroARScene onTrackingUpdated={onInitialized} {...rest}>
      <ViroAmbientLight color="#FFFFFF" />
      <ViroARPlaneSelector>
        <ShibaInuObject
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, -1]}
          rotation={[0, 0, 0]}
          dragType="FixedDistance"
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
