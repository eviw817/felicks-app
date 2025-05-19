import { BeagleScene } from "@/components/augumented-dog/scenes/BeagleScene";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { SafeAreaView } from "react-native";

const AugumentedDog = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexGrow: 1,
      }}
    >
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => <BeagleScene />,
        }}
        style={{
          flex: 1,
          flexGrow: 1,
        }}
      >
        <BeagleScene
          style={{
            width: "100%",
            height: 1000,
          }}
        />
      </ViroARSceneNavigator>
    </SafeAreaView>
  );
};

export default AugumentedDog;
