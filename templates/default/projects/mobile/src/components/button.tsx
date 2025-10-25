import Animated, { useAnimatedStyle, withSpring, useSharedValue, useAnimatedReaction } from "react-native-reanimated";
import { ActivityIndicator, Pressable, View, LayoutChangeEvent, ViewStyle } from "react-native";
import { useStableCallback, useStateX } from "@packages/hooks";
import { Href, Link } from "expo-router";
import { cn } from "@packages/utils";
import { useEffect } from "react";

type props = {
  href?: Href;
  onClick?: () => void;
  onLongPress?: () => void;
  color?: string;
  className?: string;
  wrapperClassName?: string;
  disabled?: boolean;
  disableRipple?: boolean;
  rippleColor?: "black" | "white";
  type?: "outline" | "base";
  loading?: boolean;
  wrapperStyle?: ViewStyle;
} & React.PropsWithChildren;

const RIPPLE_COLORS = { black: "#00000020", white: "#FFFFFF20", transparent: "transparent" };
const LOADING_COLORS = { black: "#000000", white: "#FFFFFF" };

function LinkWrapper({ children, href }: React.PropsWithChildren & { href?: Href }) {
  if (href) {
    return (
      <Link asChild push href={href}>
        {children}
      </Link>
    );
  }
  return children;
}

export default function Button({
  href,
  onClick,
  loading,
  disabled,
  children,
  className,
  onLongPress,
  wrapperStyle,
  disableRipple,
  type = "base",
  wrapperClassName,
  rippleColor = "white",
  color = "transparent",
}: props) {
  const [height, setHeight] = useStateX(0);
  const [width, setWidth] = useStateX(0);

  const opacity = useSharedValue(disabled ? 0.5 : 1);
  const isDisabled = useSharedValue(!!disabled);
  const scale = useSharedValue(1);

  const animatePress = useStableCallback(() => {
    "worklet";
    scale.value = withSpring(
      0.95,
      {
        damping: 8,
        stiffness: 300,
        mass: 0.5,
      },
      () => {
        scale.value = withSpring(1, {
          damping: 8,
          stiffness: 300,
          mass: 0.5,
        });
      },
    );
  });

  const handlePress = useStableCallback(() => {
    if (disabled) return;
    animatePress();
    onClick?.();
  });

  const handleLayout = useStableCallback((e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
    setHeight(e.nativeEvent.layout.height);
  });

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return { transform: [{ scale: scale.value }], opacity: opacity.value };
  });

  useEffect(() => {
    isDisabled.value = !!disabled;
  }, [disabled]);

  useAnimatedReaction(
    () => isDisabled.value,
    (currentDisabled) => {
      // eslint-disable-next-line react-hooks/immutability
      opacity.value = withSpring(currentDisabled ? 0.5 : 1, {
        damping: 8,
        stiffness: 30,
        mass: 0.5,
      });
    },
  );

  const isOutline = type === "outline";
  const backgroundColor = isOutline ? "transparent" : color;
  const borderColor = isOutline ? color : undefined;
  const borderWidth = isOutline ? 1 : 0;
  const buttonDisabled = disabled ?? loading;
  const buttonRippleColor = disableRipple ? RIPPLE_COLORS.transparent : RIPPLE_COLORS[rippleColor];
  const loadingColor = LOADING_COLORS[rippleColor];

  return (
    <Animated.View
      className={cn("relative overflow-hidden", wrapperClassName)}
      style={[animatedStyle, wrapperStyle, { backgroundColor, borderColor, borderWidth }]}
    >
      <LinkWrapper href={href}>
        <Pressable
          onPress={handlePress}
          unstable_pressDelay={100}
          onLongPress={onLongPress}
          disabled={buttonDisabled}
          android_ripple={{ color: buttonRippleColor }}
        >
          {loading ? (
            <View className="items-center justify-center" style={[{ width: width.peek, height: height.peek }]}>
              <ActivityIndicator size={25} color={loadingColor} />
            </View>
          ) : (
            <View onLayout={handleLayout} className={className}>
              {children}
            </View>
          )}
        </Pressable>
      </LinkWrapper>
    </Animated.View>
  );
}
