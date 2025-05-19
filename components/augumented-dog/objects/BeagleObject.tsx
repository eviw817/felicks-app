import { Viro3DObject } from "@reactvision/react-viro";

type BeagleObjectProps = {} & Omit<Viro3DObject["props"], "source" | "type">;

export const BeagleObject = ({ ...rest }: BeagleObjectProps) => {
  return (
    <Viro3DObject
      source={require("../../../assets/glb/Beagle.glb")}
      type="GLB"
      {...rest}
    />
  );
};
