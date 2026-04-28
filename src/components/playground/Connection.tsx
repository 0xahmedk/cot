import { Box, Text, Slider } from "@mantine/core";
import { motion } from "framer-motion";
import { useState } from "react";

interface Position {
  x: number;
  y: number;
}

interface ConnectionProps {
  /** Start position (from neuron) */
  from: Position;
  /** End position (to neuron) */
  to: Position;
  /** Weight value */
  weight: number;
  /** Callback when weight changes */
  onWeightChange: (weight: number) => void;
  /** Whether to show activation flow */
  showFlow?: boolean;
  /** Activation strength (0-1) */
  activationStrength?: number;
}

/**
 * Connection Component
 *
 * Draws a line between two neurons with an embedded weight slider.
 * The slider appears in the middle of the connection line.
 */
export function Connection({
  from,
  to,
  weight,
  onWeightChange,
  showFlow = true,
  activationStrength = 0,
}: ConnectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate line properties
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // Midpoint for weight control
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  // Weight color based on sign and magnitude
  const getWeightColor = () => {
    const absWeight = Math.abs(weight);
    if (weight > 0) {
      // Positive weights: green scale
      return `rgba(64, 192, 87, ${0.3 + absWeight * 0.7})`;
    } else if (weight < 0) {
      // Negative weights: red scale
      return `rgba(250, 82, 82, ${0.3 + absWeight * 0.7})`;
    }
    return "rgba(128, 128, 128, 0.3)";
  };

  // Line thickness based on weight magnitude
  const lineThickness = 2 + Math.abs(weight) * 4;

  return (
    <>
      {/* Connection Line */}
      <Box
        style={{
          position: "absolute",
          left: from.x,
          top: from.y,
          width: length,
          height: lineThickness,
          transformOrigin: "0 50%",
          transform: `rotate(${angle}deg)`,
          backgroundColor: getWeightColor(),
          transition: "all 0.3s ease",
          pointerEvents: "none",
        }}
      >
        {/* Animated flow particles */}
        {showFlow && activationStrength > 0.1 && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  opacity: activationStrength,
                  transform: "translate(-50%, -50%)",
                }}
                animate={{
                  left: ["0%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "linear",
                }}
              />
            ))}
          </>
        )}
      </Box>

      {/* Weight Control */}
      <Box
        style={{
          position: "absolute",
          left: midX,
          top: midY,
          transform: "translate(-50%, -50%)",
          zIndex: isOpen ? 1000 : 10,
        }}
      >
        {/* Weight Badge */}
        <motion.div
          animate={{
            scale: isOpen ? 1.1 : 1,
          }}
          style={{
            padding: "4px 10px",
            backgroundColor: isOpen ? "#373a40" : "#25262b",
            borderRadius: 12,
            border: `2px solid ${weight > 0 ? "#40c057" : weight < 0 ? "#fa5252" : "#868e96"}`,
            cursor: "pointer",
            minWidth: 60,
            textAlign: "center",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Text
            size="xs"
            fw={700}
            c={weight > 0 ? "teal" : weight < 0 ? "red" : "gray"}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            w: {weight.toFixed(2)}
          </Text>
        </motion.div>

        {/* Weight Slider Popover */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: "absolute",
              top: 40,
              left: "50%",
              transform: "translateX(-50%)",
              width: 180,
              padding: 12,
              backgroundColor: "#25262b",
              borderRadius: 8,
              border: "1px solid #373a40",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              zIndex: 1001,
            }}
            onMouseLeave={(e) => {
              // Keep open when interacting with slider
              e.stopPropagation();
            }}
          >
            <Text size="xs" fw={600} mb={8} ta="center" c="dimmed">
              Adjust Weight
            </Text>
            <Slider
              value={weight}
              onChange={onWeightChange}
              min={-2}
              max={2}
              step={0.1}
              color={weight > 0 ? "teal" : weight < 0 ? "red" : "gray"}
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
    </>
  );
}
