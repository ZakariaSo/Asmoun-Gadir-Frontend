import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Line, Path } from "react-native-svg";

type SplashScreenProps = {
  onFinish?: () => void;
  duration?: number;
};

export default function SplashScreen({
  onFinish,
  duration = 3000,
}: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounce1 = useRef(new Animated.Value(0)).current;
  const bounce2 = useRef(new Animated.Value(0)).current;
  const bounce3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade + scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotation continue
    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );
    rotateLoop.start();

    // Pulse
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // Dots bounce
    const bounce = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -10,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();

    bounce(bounce1, 0);
    bounce(bounce2, 120);
    bounce(bounce3, 240);

    // Fin du splash
    const timer = setTimeout(() => {
      onFinish?.();
    }, duration);

    return () => {
      clearTimeout(timer);
      rotateLoop.stop();
      pulseLoop.stop();
    };
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient
      colors={["#eff6ff", "#e0e7ff"]}
      style={styles.container}
    >
      <Animated.View
        style={[styles.bgCircle1, { transform: [{ scale: pulseAnim }] }]}
      />
      <Animated.View
        style={[styles.bgCircle2, { transform: [{ scale: pulseAnim }] }]}
      />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.logoContainer}>
          <Animated.View
            style={[styles.logoGlow, { transform: [{ scale: pulseAnim }] }]}
          />

          <View style={styles.logoCircle}>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Svg width="120" height="120" viewBox="0 0 120 120">
                <Circle cx="60" cy="60" r="55" fill="none" stroke="#2563eb" strokeWidth="3" />
                <Circle cx="60" cy="60" r="48" fill="none" stroke="#2563eb" strokeWidth="2" />

                <G fill="#2563eb">
                  <Path d="M 60 15 L 57 48 L 63 48 Z" />
                  <Path d="M 26 88 L 55 60 L 52 65 Z" />
                  <Path d="M 94 88 L 65 60 L 68 65 Z" />

                  <Line x1="60" y1="15" x2="60" y2="60" stroke="#2563eb" strokeWidth="3" />
                  <Line x1="60" y1="60" x2="26" y2="88" stroke="#2563eb" strokeWidth="3" />
                  <Line x1="60" y1="60" x2="94" y2="88" stroke="#2563eb" strokeWidth="3" />

                  <Circle cx="60" cy="60" r="4" fill="#2563eb" />
                </G>
              </Svg>
            </Animated.View>
          </View>
        </View>

        <Text style={styles.title}>
          Asmoun<Text style={styles.titleHighlight}>Gadir</Text>
        </Text>

        <Text style={styles.subtitle}>
          Connect • Explore • Experience
        </Text>

        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { transform: [{ translateY: bounce1 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: bounce2 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: bounce3 }] }]} />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bgCircle1: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: "rgba(191, 219, 254, 0.3)",
  },
  bgCircle2: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: "rgba(199, 210, 254, 0.3)",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 32,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  logoGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(96, 165, 250, 0.2)",
  },
  logoCircle: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  titleContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1f2937",
  },
  titleHighlight: {
    color: "#2563eb",
  },
  subtitle: {
    fontSize: 18,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2563eb",
  },
});
