import { Viro3DObject } from "@reactvision/react-viro";

type ShibaInuObjectProps = {} & Omit<Viro3DObject["props"], "source" | "type">;

export const ShibaInuObject = ({ ...rest }: ShibaInuObjectProps) => {
  return (
    <Viro3DObject
      source={require("../../../assets/glb/Beagle.glb")}
      type="GLB"
      {...rest}
    />
  );
};
