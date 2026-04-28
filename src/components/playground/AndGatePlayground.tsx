import { useState } from "react";
import {
  Paper,
  Stack,
  Group,
  Text,
  Box,
  Button,
  Badge,
  Divider,
  Code,
  Tabs,
} from "@mantine/core";
import { motion } from "framer-motion";
import { Zap, Check, X } from "lucide-react";

type GateType = "AND" | "OR";

/**
 * Logic Gate Playground
 *
 * An interactive demonstration of logic gates using a perceptron.
 * Users can switch between AND and OR gates to see how weights and bias change.
 */
export function LogicGatePlayground() {
  const [input1, setInput1] = useState(0);
  const [input2, setInput2] = useState(0);
  const [activeGate, setActiveGate] = useState<GateType>("AND");

  // Gate-specific configuration
  const gateConfig = {
    AND: {
      weight1: 1.0,
      weight2: 1.0,
      bias: -1.5,
      minSum: -1.5,
      maxSum: 0.5,
    },
    OR: {
      weight1: 1.0,
      weight2: 1.0,
      bias: -0.5,
      minSum: -0.5,
      maxSum: 1.5,
    },
  };

  const config = gateConfig[activeGate];
  const weight1 = config.weight1;
  const weight2 = config.weight2;
  const bias = config.bias;
  const threshold = 0;

  // Calculate weighted sum
  const sum = input1 * weight1 + input2 * weight2 + bias;

  // Determine if neuron fires
  const fires = sum > threshold;

  // Calculate fill level for visualization
  const fillPercentage =
    ((sum - config.minSum) / (config.maxSum - config.minSum)) * 100;

  // Threshold position (where the line appears)
  const thresholdPosition =
    ((threshold - config.minSum) / (config.maxSum - config.minSum)) * 100;

  return (
    <Paper
      shadow="xl"
      p="xl"
      radius="lg"
      style={{
        backgroundColor: "#1a1b1e",
        border: "1px solid #373a40",
        overflowX: "auto",
      }}
      styles={{
        root: {
          padding: "1rem",
          "@media (min-width: 768px)": {
            padding: "1.5rem",
          },
        },
      }}
    >
      <Stack gap="xl">
        {/* Tabs for Gate Selection */}
        <Tabs
          value={activeGate}
          onChange={(value) => setActiveGate(value as GateType)}
        >
          <Tabs.List grow>
            <Tabs.Tab value="AND">
              <Text fw={600}>AND Gate</Text>
            </Tabs.Tab>
            <Tabs.Tab value="OR">
              <Text fw={600}>OR Gate</Text>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {/* Header */}
        <Box>
          <Group justify="space-between" mb="xs" wrap="wrap" gap="xs">
            <Group gap="sm">
              <Zap size={24} color="#228be6" />
              <Text fw={600} size="lg">
                {activeGate} Gate Logic
              </Text>
            </Group>
            <Badge
              size="lg"
              variant="filled"
              color={fires ? "teal" : "red"}
              leftSection={fires ? <Check size={14} /> : <X size={14} />}
            >
              {fires ? "FIRES" : "SILENT"}
            </Badge>
          </Group>
          <Text size="sm" c="dimmed">
            Toggle both inputs ON to make the neuron fire
          </Text>
        </Box>

        <Divider />

        {/* Main Visualization */}
        <Group justify="center" align="center" gap="xl" wrap="wrap">
          {/* Input Controls */}
          <Stack gap="lg">
            {/* Input 1 Toggle */}
            <Stack gap="xs">
              <Text size="sm" fw={600} c="dimmed" ta="center">
                Input 1
              </Text>
              <Button
                size="xl"
                variant={input1 === 1 ? "filled" : "outline"}
                color={input1 === 1 ? "teal" : "gray"}
                onClick={() => setInput1(input1 === 1 ? 0 : 1)}
                style={{
                  minHeight: 80,
                  fontSize: 28,
                  fontWeight: 700,
                  minWidth: 80,
                }}
                styles={{
                  root: {
                    "@media (min-width: 768px)": {
                      minHeight: "100px",
                      fontSize: "32px",
                    },
                  },
                }}
              >
                {input1}
              </Button>
              <Text size="xs" c="dimmed" ta="center">
                Weight: {weight1}
              </Text>
            </Stack>

            {/* Input 2 Toggle */}
            <Stack gap="xs">
              <Text size="sm" fw={600} c="dimmed" ta="center">
                Input 2
              </Text>
              <Button
                size="xl"
                variant={input2 === 1 ? "filled" : "outline"}
                color={input2 === 1 ? "teal" : "gray"}
                onClick={() => setInput2(input2 === 1 ? 0 : 1)}
                style={{
                  minHeight: 80,
                  fontSize: 28,
                  fontWeight: 700,
                  minWidth: 80,
                }}
                styles={{
                  root: {
                    "@media (min-width: 768px)": {
                      minHeight: "100px",
                      fontSize: "32px",
                    },
                  },
                }}
              >
                {input2}
              </Button>
              <Text size="xs" c="dimmed" ta="center">
                Weight: {weight2}
              </Text>
            </Stack>
          </Stack>

          {/* Liquid Neuron */}
          <Stack gap="xs" align="center">
            <Text size="sm" fw={600} c="dimmed">
              Output Neuron
            </Text>

            <Box style={{ position: "relative" }}>
              {/* Neuron Container */}
              <Box
                style={{
                  position: "relative",
                  width: "clamp(150px, 30vw, 200px)",
                  aspectRatio: "1 / 1",
                  borderRadius: "50%",
                  border: `4px solid ${fires ? "#12b886" : "#5c5f66"}`,
                  overflow: "hidden",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  transition: "border-color 0.3s ease",
                }}
              >
                {/* Liquid Fill */}
                <motion.div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: fires ? "#12b886" : "#228be6",
                    opacity: 0.7,
                  }}
                  animate={{
                    height: `${Math.max(0, Math.min(100, fillPercentage))}%`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    mass: 0.8,
                  }}
                />

                {/* Wave Effect */}
                <motion.div
                  style={{
                    position: "absolute",
                    bottom: `${fillPercentage}%`,
                    left: "-100%",
                    width: "300%",
                    height: 15,
                    backgroundColor: fires ? "#12b886" : "#228be6",
                    opacity: 0.1,
                    borderRadius: "50%",
                  }}
                  animate={{
                    x: [0, -100],
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
                      stiffness: 100,
                      damping: 35,
                    },
                  }}
                />

                {/* Threshold Line */}
                <Box
                  style={{
                    position: "absolute",
                    bottom: `${thresholdPosition}%`,
                    left: 0,
                    right: 0,
                    height: 3,
                    backgroundColor: "#fa5252",
                    zIndex: 10,
                    boxShadow: "0 0 10px rgba(250, 82, 82, 0.5)",
                  }}
                >
                  {/* Threshold Label */}
                  <Box
                    style={{
                      position: "absolute",
                      right: -60,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <Badge size="xs" color="red" variant="filled">
                      Threshold
                    </Badge>
                  </Box>
                </Box>

                {/* Sum Value Display */}
                <Box
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 15,
                  }}
                >
                  <Text
                    size="xl"
                    fw={700}
                    c="white"
                    ta="center"
                    style={{
                      textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {sum.toFixed(1)}
                  </Text>
                  <Text
                    size="xs"
                    c="dimmed"
                    ta="center"
                    style={{
                      textShadow: "0 2px 4px rgba(0,0,0,0.9)",
                    }}
                  >
                    sum
                  </Text>
                </Box>
              </Box>

              {/* Fill Level Label */}
              <Text size="xs" c="dimmed" ta="center" mt="xs">
                {fillPercentage.toFixed(0)}% full
              </Text>
            </Box>

            {/* Formula Display */}
            <Stack gap="xs" style={{ flex: 1 }}>
              <Text size="sm" fw={600} c="dimmed" ta="center">
                Live Formula
              </Text>
              <Paper
                p="md"
                style={{
                  backgroundColor: "#25262b",
                  border: "1px solid #373a40",
                }}
              >
                <Code
                  block
                  style={{
                    backgroundColor: "#1a1b1e",
                    fontSize: 13,
                    fontFamily: "monospace",
                    textAlign: "center",
                  }}
                >
                  ({input1} × {weight1}) + ({input2} × {weight2}) + {bias}
                  {"\n"}= {input1 * weight1} + {input2 * weight2} + {bias}
                  {"\n"}= {sum.toFixed(1)}
                </Code>
              </Paper>
              <Text size="xs" c="dimmed" ta="center">
                Weights: {weight1}, {weight2}
                {"\n"}
                Bias: {bias}
              </Text>
            </Stack>
          </Stack>
        </Group>

        <Divider />

        {/* Calculation Display */}
        <Paper
          p="md"
          style={{
            backgroundColor: "#25262b",
            border: "1px solid #373a40",
          }}
        >
          <Stack gap="xs">
            <Text size="sm" fw={600} c="dimmed">
              Calculation
            </Text>
            <Code
              block
              p="md"
              style={{
                backgroundColor: "#1a1b1e",
                fontSize: 14,
                fontFamily: "monospace",
              }}
            >
              sum = ({input1} × {weight1}) + ({input2} × {weight2}) + ({bias})
              {"\n"}
              sum = {input1 * weight1} + {input2 * weight2} + {bias}
              {"\n"}
              sum = {sum.toFixed(1)}
              {"\n\n"}
              {sum > threshold
                ? `✓ ${sum.toFixed(1)} > ${threshold} → Neuron FIRES!`
                : `✗ ${sum.toFixed(1)} ≤ ${threshold} → Neuron stays silent`}
            </Code>
          </Stack>
        </Paper>

        {/* Truth Table */}
        <Paper
          p="md"
          style={{
            backgroundColor: "#25262b",
            border: "1px solid #373a40",
          }}
        >
          <Text size="sm" fw={600} mb="sm">
            {activeGate} Gate Truth Table
          </Text>
          <Box
            component="table"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14,
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #373a40" }}>
                <th style={{ padding: 8, textAlign: "left" }}>Input 1</th>
                <th style={{ padding: 8, textAlign: "left" }}>Input 2</th>
                <th style={{ padding: 8, textAlign: "left" }}>Sum</th>
                <th style={{ padding: 8, textAlign: "left" }}>Output</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // Calculate truth table for current gate
                const rows = [
                  [0, 0],
                  [0, 1],
                  [1, 0],
                  [1, 1],
                ].map(([i1, i2]) => {
                  const s = i1 * weight1 + i2 * weight2 + bias;
                  const o = s > threshold ? 1 : 0;
                  return [i1, i2, s, o];
                });

                return rows.map(([i1, i2, s, o], idx) => (
                  <tr
                    key={idx}
                    style={{
                      backgroundColor:
                        input1 === i1 && input2 === i2
                          ? "#373a40"
                          : "transparent",
                      borderBottom: "1px solid #2c2e33",
                    }}
                  >
                    <td style={{ padding: 8 }}>{i1}</td>
                    <td style={{ padding: 8 }}>{i2}</td>
                    <td style={{ padding: 8 }}>{(s as number).toFixed(1)}</td>
                    <td style={{ padding: 8 }}>
                      <Badge
                        size="sm"
                        variant="filled"
                        color={o === 1 ? "teal" : "gray"}
                      >
                        {o}
                      </Badge>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </Box>
        </Paper>
      </Stack>
    </Paper>
  );
}
