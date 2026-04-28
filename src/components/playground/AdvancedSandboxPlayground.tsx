import { useState, useMemo } from "react";
import {
  Paper,
  Stack,
  Group,
  Box,
  Button,
  Text,
  Badge,
  SegmentedControl,
  Slider,
  Popover,
} from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, RotateCcw } from "lucide-react";
import type { ActivationFunctionType } from "../../types";

/**
 * Advanced Sandbox Playground
 *
 * A fully interactive multi-layer perceptron where users can control
 * every weight, bias, and activation function to classify fruits.
 */
export function AdvancedSandboxPlayground() {
  // Activation function
  const [activationFn, setActivationFn] =
    useState<ActivationFunctionType>("sigmoid");

  // Input values
  const [inputs, setInputs] = useState({ weight: 0.5, texture: 0.5 });

  // Weights: [from][to]
  // Input to Hidden1
  const [w_i0_h10, setW_i0_h10] = useState(0.5);
  const [w_i0_h11, setW_i0_h11] = useState(-0.3);
  const [w_i1_h10, setW_i1_h10] = useState(0.4);
  const [w_i1_h11, setW_i1_h11] = useState(0.6);

  // Hidden1 to Hidden2
  const [w_h10_h20, setW_h10_h20] = useState(0.3);
  const [w_h10_h21, setW_h10_h21] = useState(-0.2);
  const [w_h10_h22, setW_h10_h22] = useState(0.5);
  const [w_h11_h20, setW_h11_h20] = useState(0.6);
  const [w_h11_h21, setW_h11_h21] = useState(0.4);
  const [w_h11_h22, setW_h11_h22] = useState(-0.3);

  // Hidden2 to Output
  const [w_h20_o0, setW_h20_o0] = useState(0.7);
  const [w_h20_o1, setW_h20_o1] = useState(-0.4);
  const [w_h21_o0, setW_h21_o0] = useState(0.5);
  const [w_h21_o1, setW_h21_o1] = useState(0.6);
  const [w_h22_o0, setW_h22_o0] = useState(-0.3);
  const [w_h22_o1, setW_h22_o1] = useState(0.8);

  // Biases
  const [bias_h10, setBias_h10] = useState(0);
  const [bias_h11, setBias_h11] = useState(0);
  const [bias_h20, setBias_h20] = useState(0);
  const [bias_h21, setBias_h21] = useState(0);
  const [bias_h22, setBias_h22] = useState(0);
  const [bias_o0, setBias_o0] = useState(0);
  const [bias_o1, setBias_o1] = useState(0);

  // Activation functions
  const activationFunctions = {
    step: (x: number) => (x > 0 ? 1 : 0),
    sigmoid: (x: number) => 1 / (1 + Math.exp(-x)),
    relu: (x: number) => Math.max(0, Math.min(1, x)),
  };

  const activate = activationFunctions[activationFn];

  // Forward propagation
  const network = useMemo(() => {
    // Hidden Layer 1
    const h10_sum =
      inputs.weight * w_i0_h10 + inputs.texture * w_i1_h10 + bias_h10;
    const h10_val = activate(h10_sum);

    const h11_sum =
      inputs.weight * w_i0_h11 + inputs.texture * w_i1_h11 + bias_h11;
    const h11_val = activate(h11_sum);

    // Hidden Layer 2
    const h20_sum = h10_val * w_h10_h20 + h11_val * w_h11_h20 + bias_h20;
    const h20_val = activate(h20_sum);

    const h21_sum = h10_val * w_h10_h21 + h11_val * w_h11_h21 + bias_h21;
    const h21_val = activate(h21_sum);

    const h22_sum = h10_val * w_h10_h22 + h11_val * w_h11_h22 + bias_h22;
    const h22_val = activate(h22_sum);

    // Output Layer
    const o0_sum =
      h20_val * w_h20_o0 + h21_val * w_h21_o0 + h22_val * w_h22_o0 + bias_o0;
    const o0_val = activate(o0_sum);

    const o1_sum =
      h20_val * w_h20_o1 + h21_val * w_h21_o1 + h22_val * w_h22_o1 + bias_o1;
    const o1_val = activate(o1_sum);

    return {
      input: { i0: inputs.weight, i1: inputs.texture },
      hidden1: { h10: h10_val, h11: h11_val },
      hidden2: { h20: h20_val, h21: h21_val, h22: h22_val },
      output: { o0: o0_val, o1: o1_val },
    };
  }, [
    inputs,
    w_i0_h10,
    w_i0_h11,
    w_i1_h10,
    w_i1_h11,
    w_h10_h20,
    w_h10_h21,
    w_h10_h22,
    w_h11_h20,
    w_h11_h21,
    w_h11_h22,
    w_h20_o0,
    w_h20_o1,
    w_h21_o0,
    w_h21_o1,
    w_h22_o0,
    w_h22_o1,
    bias_h10,
    bias_h11,
    bias_h20,
    bias_h21,
    bias_h22,
    bias_o0,
    bias_o1,
    activationFn,
    activate,
  ]);

  // Presets
  const applyPreset = (preset: "apple" | "banana") => {
    if (preset === "apple") {
      setInputs({ weight: 0.3, texture: 0.2 }); // Small & Smooth
    } else {
      setInputs({ weight: 0.8, texture: 0.7 }); // Long & Bumpy
    }
  };

  const resetNetwork = () => {
    setInputs({ weight: 0.5, texture: 0.5 });
    setActivationFn("sigmoid");
    // Reset all weights to random small values
    setW_i0_h10(0.5);
    setW_i0_h11(-0.3);
    setW_i1_h10(0.4);
    setW_i1_h11(0.6);
    setW_h10_h20(0.3);
    setW_h10_h21(-0.2);
    setW_h10_h22(0.5);
    setW_h11_h20(0.6);
    setW_h11_h21(0.4);
    setW_h11_h22(-0.3);
    setW_h20_o0(0.7);
    setW_h20_o1(-0.4);
    setW_h21_o0(0.5);
    setW_h21_o1(0.6);
    setW_h22_o0(-0.3);
    setW_h22_o1(0.8);
    setBias_h10(0);
    setBias_h11(0);
    setBias_h20(0);
    setBias_h21(0);
    setBias_h22(0);
    setBias_o0(0);
    setBias_o1(0);
  };

  return (
    <Paper
      shadow="xl"
      p="xl"
      radius="lg"
      style={{
        backgroundColor: "#1a1b1e",
        border: "1px solid #373a40",
        overflow: "visible",
      }}
    >
      <Stack gap="xl">
        {/* Header */}
        <Box>
          <Group justify="space-between" mb="xs">
            <Group gap="sm">
              <Settings size={24} color="#228be6" />
              <Text fw={600} size="lg">
                Advanced Multi-Layer Perceptron
              </Text>
            </Group>
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
            >
              Full Control
            </Badge>
          </Group>
          <Text size="sm" c="dimmed">
            Train your network to classify fruits! Adjust every weight and bias.
          </Text>
        </Box>

        {/* Controls */}
        <Group justify="space-between" align="center" wrap="wrap" gap="md">
          {/* Activation Function - Hidden on mobile, shown on desktop */}
          <Box visibleFrom="sm">
            <Text size="xs" fw={600} c="dimmed" mb="xs">
              Activation Function
            </Text>
            <SegmentedControl
              value={activationFn}
              onChange={(value) =>
                setActivationFn(value as ActivationFunctionType)
              }
              data={[
                { label: "Step", value: "step" },
                { label: "Sigmoid", value: "sigmoid" },
                { label: "ReLU", value: "relu" },
              ]}
            />
          </Box>

          {/* Presets */}
          <Group gap="sm" wrap="wrap" justify="center" style={{ flex: 1 }}>
            <Button
              size="sm"
              variant="light"
              color="red"
              leftSection={<span>🍎</span>}
              onClick={() => applyPreset("apple")}
              styles={{
                root: {
                  fontSize: "0.75rem",
                  "@media (max-width: 768px)": {
                    padding: "0.5rem 0.75rem",
                  },
                },
              }}
            >
              Small & Smooth
            </Button>
            <Button
              size="sm"
              variant="light"
              color="yellow"
              leftSection={<span>🍌</span>}
              onClick={() => applyPreset("banana")}
              styles={{
                root: {
                  fontSize: "0.75rem",
                  "@media (max-width: 768px)": {
                    padding: "0.5rem 0.75rem",
                  },
                },
              }}
            >
              Long & Bumpy
            </Button>
            <Button
              size="sm"
              variant="outline"
              color="gray"
              leftSection={<RotateCcw size={16} />}
              onClick={resetNetwork}
              styles={{
                root: {
                  fontSize: "0.75rem",
                  "@media (max-width: 768px)": {
                    padding: "0.5rem 0.75rem",
                  },
                },
              }}
            >
              Reset
            </Button>
          </Group>
        </Group>

        {/* Network Visualization */}
        <Box style={{ position: "relative", minHeight: 500 }}>
          <svg
            width="100%"
            height="500"
            style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
          >
            {/* Connections - Input to Hidden1 */}
            <ConnectionLine
              x1={15}
              y1={35}
              x2={30}
              y2={25}
              weight={w_i0_h10}
              onWeightChange={setW_i0_h10}
            />
            <ConnectionLine
              x1={15}
              y1={35}
              x2={30}
              y2={55}
              weight={w_i0_h11}
              onWeightChange={setW_i0_h11}
            />
            <ConnectionLine
              x1={15}
              y1={65}
              x2={30}
              y2={25}
              weight={w_i1_h10}
              onWeightChange={setW_i1_h10}
            />
            <ConnectionLine
              x1={15}
              y1={65}
              x2={30}
              y2={55}
              weight={w_i1_h11}
              onWeightChange={setW_i1_h11}
            />

            {/* Connections - Hidden1 to Hidden2 */}
            <ConnectionLine
              x1={42}
              y1={25}
              x2={57}
              y2={20}
              weight={w_h10_h20}
              onWeightChange={setW_h10_h20}
            />
            <ConnectionLine
              x1={42}
              y1={25}
              x2={57}
              y2={40}
              weight={w_h10_h21}
              onWeightChange={setW_h10_h21}
            />
            <ConnectionLine
              x1={42}
              y1={25}
              x2={57}
              y2={60}
              weight={w_h10_h22}
              onWeightChange={setW_h10_h22}
            />
            <ConnectionLine
              x1={42}
              y1={55}
              x2={57}
              y2={20}
              weight={w_h11_h20}
              onWeightChange={setW_h11_h20}
            />
            <ConnectionLine
              x1={42}
              y1={55}
              x2={57}
              y2={40}
              weight={w_h11_h21}
              onWeightChange={setW_h11_h21}
            />
            <ConnectionLine
              x1={42}
              y1={55}
              x2={57}
              y2={60}
              weight={w_h11_h22}
              onWeightChange={setW_h11_h22}
            />

            {/* Connections - Hidden2 to Output */}
            <ConnectionLine
              x1={70}
              y1={20}
              x2={85}
              y2={35}
              weight={w_h20_o0}
              onWeightChange={setW_h20_o0}
            />
            <ConnectionLine
              x1={70}
              y1={20}
              x2={85}
              y2={65}
              weight={w_h20_o1}
              onWeightChange={setW_h20_o1}
            />
            <ConnectionLine
              x1={70}
              y1={40}
              x2={85}
              y2={35}
              weight={w_h21_o0}
              onWeightChange={setW_h21_o0}
            />
            <ConnectionLine
              x1={70}
              y1={40}
              x2={85}
              y2={65}
              weight={w_h21_o1}
              onWeightChange={setW_h21_o1}
            />
            <ConnectionLine
              x1={70}
              y1={60}
              x2={85}
              y2={35}
              weight={w_h22_o0}
              onWeightChange={setW_h22_o0}
            />
            <ConnectionLine
              x1={70}
              y1={60}
              x2={85}
              y2={65}
              weight={w_h22_o1}
              onWeightChange={setW_h22_o1}
            />
          </svg>

          {/* Neurons */}
          <Group
            justify="space-around"
            align="flex-start"
            wrap="nowrap"
            style={{ position: "relative", zIndex: 2, paddingTop: 20 }}
          >
            {/* Input Layer */}
            <Stack gap="xl" align="center">
              <Badge size="sm" variant="light" color="gray">
                Input
              </Badge>
              <Stack gap="lg">
                <InputNeuron
                  label="Weight"
                  value={inputs.weight}
                  onChange={(val) => setInputs({ ...inputs, weight: val })}
                />
                <InputNeuron
                  label="Texture"
                  value={inputs.texture}
                  onChange={(val) => setInputs({ ...inputs, texture: val })}
                />
              </Stack>
            </Stack>

            {/* Hidden Layer 1 */}
            <Stack gap="xl" align="center">
              <Badge size="sm" variant="light" color="teal">
                Hidden 1
              </Badge>
              <Stack gap="lg">
                <LiquidNeuron
                  label="H1.0"
                  value={network.hidden1.h10}
                  bias={bias_h10}
                  onBiasChange={setBias_h10}
                  color="#12b886"
                />
                <LiquidNeuron
                  label="H1.1"
                  value={network.hidden1.h11}
                  bias={bias_h11}
                  onBiasChange={setBias_h11}
                  color="#12b886"
                />
              </Stack>
            </Stack>

            {/* Hidden Layer 2 */}
            <Stack gap="xl" align="center">
              <Badge size="sm" variant="light" color="violet">
                Hidden 2
              </Badge>
              <Stack gap="md">
                <LiquidNeuron
                  label="H2.0"
                  value={network.hidden2.h20}
                  bias={bias_h20}
                  onBiasChange={setBias_h20}
                  color="#7950f2"
                  size={70}
                />
                <LiquidNeuron
                  label="H2.1"
                  value={network.hidden2.h21}
                  bias={bias_h21}
                  onBiasChange={setBias_h21}
                  color="#7950f2"
                  size={70}
                />
                <LiquidNeuron
                  label="H2.2"
                  value={network.hidden2.h22}
                  bias={bias_h22}
                  onBiasChange={setBias_h22}
                  color="#7950f2"
                  size={70}
                />
              </Stack>
            </Stack>

            {/* Output Layer */}
            <Stack gap="xl" align="center">
              <Badge size="sm" variant="light" color="red">
                Output
              </Badge>
              <Stack gap="lg">
                <OutputNeuron
                  label="🍎 Apple"
                  value={network.output.o0}
                  bias={bias_o0}
                  onBiasChange={setBias_o0}
                />
                <OutputNeuron
                  label="🍌 Banana"
                  value={network.output.o1}
                  bias={bias_o1}
                  onBiasChange={setBias_o1}
                />
              </Stack>
            </Stack>
          </Group>
        </Box>

        {/* Results */}
        <Paper
          p="md"
          style={{
            backgroundColor: "#25262b",
            border: "1px solid #373a40",
          }}
        >
          <Group justify="space-around">
            <Box ta="center">
              <Text size="xs" c="dimmed" mb="xs">
                Apple Confidence
              </Text>
              <Text
                size="xl"
                fw={700}
                c={network.output.o0 > 0.8 ? "green" : "dimmed"}
              >
                {(network.output.o0 * 100).toFixed(0)}%
              </Text>
            </Box>
            <Box ta="center">
              <Text size="xs" c="dimmed" mb="xs">
                Banana Confidence
              </Text>
              <Text
                size="xl"
                fw={700}
                c={network.output.o1 > 0.8 ? "green" : "dimmed"}
              >
                {(network.output.o1 * 100).toFixed(0)}%
              </Text>
            </Box>
          </Group>
        </Paper>

        {/* Instructions */}
        <Paper
          p="md"
          style={{
            backgroundColor: "#25262b",
            border: "1px solid #373a40",
          }}
        >
          <Text size="sm" c="dimmed" ta="center">
            <strong>Challenge:</strong> Click a preset, then tune the weights
            and biases so the correct fruit neuron reaches 100%! Try different
            activation functions.
          </Text>
        </Paper>
      </Stack>
    </Paper>
  );
}

// Helper Components

interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  weight: number;
  onWeightChange: (weight: number) => void;
}

function ConnectionLine({
  x1,
  y1,
  x2,
  y2,
  weight,
  onWeightChange,
}: ConnectionLineProps) {
  const [opened, setOpened] = useState(false);

  const color = weight >= 0 ? "#228be6" : "#fa5252";
  const thickness = 1 + Math.abs(weight) * 3;

  // Calculate midpoint for the weight badge
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g>
      {/* Connection line */}
      <line
        x1={`${x1}%`}
        y1={`${y1}%`}
        x2={`${x2}%`}
        y2={`${y2}%`}
        stroke={color}
        strokeWidth={thickness}
        opacity={0.6}
      />

      {/* Weight badge */}
      <Popover opened={opened} onChange={setOpened} position="top" withArrow>
        <Popover.Target>
          <g onClick={() => setOpened(!opened)} style={{ cursor: "pointer" }}>
            <circle
              cx={`${midX}%`}
              cy={`${midY}%`}
              r="12"
              fill={color}
              opacity={0.9}
            />
            <text
              x={`${midX}%`}
              y={`${midY}%`}
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              fontSize="10"
              fontWeight="bold"
            >
              {weight.toFixed(1)}
            </text>
          </g>
        </Popover.Target>
        <Popover.Dropdown style={{ zIndex: 2000 }}>
          <Box style={{ width: 150 }}>
            <Text size="xs" fw={600} mb="xs">
              Weight: {weight.toFixed(2)}
            </Text>
            <Slider
              value={weight}
              onChange={onWeightChange}
              min={-1}
              max={1}
              step={0.1}
              color={weight >= 0 ? "blue" : "red"}
              marks={[
                { value: -1, label: "-1" },
                { value: 0, label: "0" },
                { value: 1, label: "1" },
              ]}
            />
          </Box>
        </Popover.Dropdown>
      </Popover>
    </g>
  );
}

interface InputNeuronProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function InputNeuron({ label, value, onChange }: InputNeuronProps) {
  return (
    <Box style={{ width: 100 }}>
      <Text size="xs" fw={600} c="dimmed" ta="center" mb="xs">
        {label}
      </Text>
      <Box
        style={{
          width: 80,
          height: 80,
          margin: "0 auto",
          borderRadius: "50%",
          border: "3px solid #868e96",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <Text size="lg" fw={700} c="white">
          {value.toFixed(2)}
        </Text>
      </Box>
      <Slider
        value={value}
        onChange={onChange}
        min={0}
        max={1}
        step={0.1}
        size="sm"
        mt="xs"
        marks={[
          { value: 0, label: "0" },
          { value: 1, label: "1" },
        ]}
      />
    </Box>
  );
}

interface LiquidNeuronProps {
  label: string;
  value: number;
  bias: number;
  onBiasChange: (bias: number) => void;
  color: string;
  size?: number;
}

function LiquidNeuron({
  label,
  value,
  bias,
  onBiasChange,
  color,
  size = 80,
}: LiquidNeuronProps) {
  const [showBiasSlider, setShowBiasSlider] = useState(false);
  const fillPercentage = Math.max(0, Math.min(100, value * 100));

  return (
    <Box style={{ position: "relative", width: 100 }}>
      <Text size="xs" fw={600} c="dimmed" ta="center" mb="xs">
        {label}
      </Text>

      {/* Neuron Circle */}
      <Box
        style={{
          width: size,
          aspectRatio: "1 / 1",
          margin: "0 auto",
          borderRadius: "50%",
          border: `3px solid ${color}`,
          overflow: "hidden",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          position: "relative",
        }}
      >
        {/* Liquid Fill */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: color,
            opacity: 0.8,
          }}
          animate={{
            height: `${fillPercentage}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        />

        {/* Wave Effect */}
        <motion.div
          style={{
            position: "absolute",
            bottom: `${fillPercentage}%`,
            left: "-100%",
            width: "300%",
            height: 8,
            backgroundColor: color,
            opacity: 0.5,
            borderRadius: "50%",
          }}
          animate={{
            x: [0, -40],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Value */}
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
            size="sm"
            fw={700}
            c="white"
            style={{
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            {value.toFixed(2)}
          </Text>
        </Box>
      </Box>

      {/* Bias Control */}
      <Popover
        opened={showBiasSlider}
        onChange={setShowBiasSlider}
        position="bottom"
      >
        <Popover.Target>
          <Badge
            size="sm"
            color="red"
            style={{
              position: "absolute",
              bottom: -5,
              left: "50%",
              transform: "translateX(-50%)",
              cursor: "pointer",
            }}
            onClick={() => setShowBiasSlider(!showBiasSlider)}
          >
            B: {bias.toFixed(1)}
          </Badge>
        </Popover.Target>
        <Popover.Dropdown style={{ zIndex: 2000 }}>
          <Box style={{ width: 150 }}>
            <Text size="xs" fw={600} mb="xs">
              Bias: {bias.toFixed(2)}
            </Text>
            <Slider
              value={bias}
              onChange={onBiasChange}
              min={-1}
              max={1}
              step={0.1}
              color="red"
              marks={[
                { value: -1, label: "-1" },
                { value: 0, label: "0" },
                { value: 1, label: "1" },
              ]}
            />
          </Box>
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
}

interface OutputNeuronProps {
  label: string;
  value: number;
  bias: number;
  onBiasChange: (bias: number) => void;
}

function OutputNeuron({ label, value, bias, onBiasChange }: OutputNeuronProps) {
  const [showBiasSlider, setShowBiasSlider] = useState(false);
  const fillPercentage = Math.max(0, Math.min(100, value * 100));
  const isApple = label.includes("🍎");
  const color = isApple ? "#fa5252" : "#fab005";

  return (
    <Box style={{ position: "relative", width: 120 }}>
      <Text size="xs" fw={600} c="dimmed" ta="center" mb="xs">
        {label}
      </Text>

      {/* Neuron Circle */}
      <motion.div
        style={{
          width: 100,
          height: 100,
          margin: "0 auto",
          borderRadius: "50%",
          border: `4px solid ${color}`,
          overflow: "hidden",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          position: "relative",
        }}
        animate={{
          boxShadow: fillPercentage > 80 ? `0 0 30px ${color}80` : "none",
        }}
      >
        {/* Liquid Fill */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: color,
            opacity: 0.8,
          }}
          animate={{
            height: `${fillPercentage}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        />

        {/* Wave Effect */}
        <motion.div
          style={{
            position: "absolute",
            bottom: `${fillPercentage}%`,
            left: "-100%",
            width: "300%",
            height: 12,
            backgroundColor: color,
            opacity: 0.5,
            borderRadius: "50%",
          }}
          animate={{
            x: [0, -50],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Value */}
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
            size="xl"
            fw={700}
            c="white"
            style={{
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            {(value * 100).toFixed(0)}%
          </Text>
        </Box>

        {/* Success Icon */}
        <AnimatePresence>
          {fillPercentage > 80 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -150%)",
                fontSize: 32,
              }}
            >
              {isApple ? "🍎" : "🍌"}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bias Control */}
      <Popover
        opened={showBiasSlider}
        onChange={setShowBiasSlider}
        position="bottom"
      >
        <Popover.Target>
          <Badge
            size="sm"
            color="red"
            style={{
              position: "absolute",
              bottom: -5,
              left: "50%",
              transform: "translateX(-50%)",
              cursor: "pointer",
            }}
            onClick={() => setShowBiasSlider(!showBiasSlider)}
          >
            B: {bias.toFixed(1)}
          </Badge>
        </Popover.Target>
        <Popover.Dropdown style={{ zIndex: 2000 }}>
          <Box style={{ width: 150 }}>
            <Text size="xs" fw={600} mb="xs">
              Bias: {bias.toFixed(2)}
            </Text>
            <Slider
              value={bias}
              onChange={onBiasChange}
              min={-1}
              max={1}
              step={0.1}
              color="red"
              marks={[
                { value: -1, label: "-1" },
                { value: 0, label: "0" },
                { value: 1, label: "1" },
              ]}
            />
          </Box>
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
}
