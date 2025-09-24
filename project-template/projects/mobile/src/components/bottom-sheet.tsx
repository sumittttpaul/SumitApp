import GorhomBottomSheet, { BottomSheetBackdrop, BottomSheetView, BottomSheetBackdropProps, BottomSheetProps } from "@gorhom/bottom-sheet";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type props = {
  snapPoints?: string[];
  backgroundColor?: string;
  indicatorColor?: string;
  borderRadius?: number;
  className?: string;
} & BottomSheetProps & { ref?: React.RefObject<GorhomBottomSheet | null> } & React.PropsWithChildren;

const initial = {
  index: -1,
  borderRadius: 16,
  handleComponent: null,
  enablePanDownToClose: true,
  indicatorColor: "#5D5D5D",
  backgroundColor: "#252525",
};

const animationConfigs = {
  mass: 1,
  damping: 25,
  stiffness: 200,
  overshootClamping: true,
  restSpeedThreshold: 0.3,
  restDisplacementThreshold: 0.1,
};

const styles = StyleSheet.create({
  backdrop: { zIndex: 2999 },
  container: { zIndex: 3000 },
  background: { overflow: "hidden" },
  content: { width: "100%", overflow: "hidden", position: "relative" },
  indicator: { height: 4, width: 48, borderRadius: 999, position: "absolute", top: 12, left: "50%", transform: [{ translateX: -24 }], zIndex: 3001 },
});

function RenderBackdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop style={styles.backdrop} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} {...props} />;
}

export function BottomSheetBasic({ children, className, snapPoints, ...rest }: props) {
  const mergedProps = { ...initial, ...rest };
  const { index, borderRadius, indicatorColor, backgroundColor, handleComponent, enablePanDownToClose, ...props } = mergedProps;

  return (
    <GorhomBottomSheet
      index={index}
      handleComponent={handleComponent}
      containerStyle={styles.container}
      backdropComponent={RenderBackdrop}
      animationConfigs={animationConfigs}
      enablePanDownToClose={enablePanDownToClose}
      snapPoints={snapPoints ?? undefined}
      backgroundStyle={[{ backgroundColor, borderRadius }, styles.background]}
      {...props}
    >
      <BottomSheetView style={styles.content}>
        <View style={[{ backgroundColor: indicatorColor }, styles.indicator]} />
        <View style={[{ borderRadius }, styles.background]} className={className}>
          {children}
        </View>
      </BottomSheetView>
    </GorhomBottomSheet>
  );
}

export default function BottomSheet({ children, className, snapPoints, ...rest }: props) {
  const mergedProps = { ...initial, ...rest };
  const { index, borderRadius, indicatorColor, backgroundColor, handleComponent, enablePanDownToClose, ...props } = mergedProps;

  const { bottom: bottomInset } = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const MAX_HEIGHT = height - 2;

  return (
    <GorhomBottomSheet
      index={index}
      handleComponent={handleComponent}
      maxDynamicContentSize={MAX_HEIGHT}
      backdropComponent={RenderBackdrop}
      animationConfigs={animationConfigs}
      enablePanDownToClose={enablePanDownToClose}
      snapPoints={snapPoints ?? undefined}
      backgroundStyle={[{ backgroundColor: "transparent" }, styles.background]}
      containerStyle={[{ marginBottom: bottomInset, marginHorizontal: 8 }, styles.container]}
      {...props}
    >
      <BottomSheetView style={[{ paddingBottom: 8 }, styles.content]}>
        <View style={[{ backgroundColor, borderRadius }, styles.content]}>
          <View style={[{ backgroundColor: indicatorColor }, styles.indicator]} />
          <View className={className}>{children}</View>
        </View>
      </BottomSheetView>
    </GorhomBottomSheet>
  );
}
