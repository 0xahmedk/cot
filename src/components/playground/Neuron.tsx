import { Box, Text, Slider } from "@mantine/core";
import { motion } from "framer-motion";
import { useState } from "react";

interface NeuronProps {
  /** Label for the neuron */
  label: string;
  /** Current value (0-1) */
  value: number;
  /** Size of the neuron */
  size?: number;
  /** Color of the liquid fill */
  color?: string;
  /** Whether to show a bias control */
  showBias?: boolean;
  /** Current bias value */
  bias?: number;
  /** Callback when bias changes */
  onBiasChange?: (bias: number) => void;
  /** Type of neuron (input, hidden, output) */
  type?: "input" | "hidden" | "output";
}

/**
 * Neuron Component with Liquid Fill Animation
 *
 * A circular neuron that fills with "liquid" based on its activation value.
 * Can display an inline bias control attached to the neuron.
 */
export function Neuron({
  label,
  value,
  size = 100,
  color = "#228be6",
  showBias = false,
  bias = 0,
  onBiasChange,
  type = "hidden",
}: NeuronProps) {
  const [showBiasSlider, setShowBiasSlider] = useState(false);
  const fillPercentage = Math.max(0, Math.min(100, value * 100));

  // Color scheme based on neuron type
  const getColor = () => {
    switch (type) {
      case "input":
        return "#12b886"; // Teal
      case "output":
        return "#228be6"; // Blue
      default:
        return color;
    }
  };

  return (
    <Box style={{ position: "relative" }}>
      {/* Neuron Circle */}
      <Box
        style={{
          position: "relative",
          width: size,
          height: size,
        }}
      >
        {/* Label above neuron */}
        <Text
          size="xs"
          fw={600}
          c="dimmed"
          ta="center"
          style={{
            position: "absolute",
            top: 0,
            left: "-50%",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Text>

        {/* Neuron container */}
        <Box
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: `3px solid ${getColor()}`,
            overflow: "hidden",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            cursor: showBias ? "pointer" : "default",
          }}
          onClick={() => showBias && setShowBiasSlider(!showBiasSlider)}
        >
          {/* Liquid fill animation */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: getColor(),
              opacity: 0.7,
            }}
            animate={{
              height: `${fillPercentage}%`,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 20,
              mass: 0.8,
            }}
          />

          {/* Liquid wave effect */}
          <motion.div
            style={{
              position: "absolute",
              bottom: `${fillPercentage}%`,
              left: "-100%",
              width: "300%",
              top: -10,
              height: 5,
              backgroundColor: getColor(),
              opacity: 0.7,
              borderRadius: "50%",
            }}
            animate={{
              x: [0, -size],
              bottom: [`${fillPercentage}%`, `${fillPercentage}%`],
            }}
            transition={{
              x: {
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              },
              bottom: {
                type: "spring",
                stiffness: 120,
                damping: 20,
              },
            }}
          />

          {/* Value display */}
          <Box
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <Text
              size={size > 80 ? "lg" : "sm"}
              fw={700}
              c="white"
              style={{
                textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {value.toFixed(2)}
            </Text>
          </Box>
        </Box>

        {/* Bias control indicator */}
        {showBias && (
          <Box
            style={{
              position: "absolute",
              bottom: -8,
              right: -8,
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: "#fa5252",
              border: "2px solid #1a1b1e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 20,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowBiasSlider(!showBiasSlider);
            }}
          >
            <Text size="xs" fw={700} c="white">
              B
            </Text>
          </Box>
        )}
      </Box>

      {/* Bias slider (appears when clicking the bias button) */}
      {showBias && showBiasSlider && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{
            position: "absolute",
            top: size + 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 150,
            padding: 12,
            backgroundColor: "#25262b",
            borderRadius: 8,
            border: "1px solid #373a40",
            zIndex: 100,
          }}
        >
          <Text size="xs" fw={600} mb={8} ta="center">
            Bias: {bias.toFixed(2)}
          </Text>
          <Slider
            value={bias}
            onChange={onBiasChange}
            min={-2}
            max={2}
            step={0.1}
            color="red"
            size="sm"
            marks={[
              { value: -2, label: "-2" },
              { value: 0, label: "0" },
              { value: 2, label: "2" },
            ]}
          />
        </motion.div>
      )}
    </Box>
  );
}
