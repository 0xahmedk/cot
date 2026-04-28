import { useState, useMemo, useCallback } from "react";
import {
  Paper,
  Stack,
  Group,
  Box,
  Text,
  Badge,
  SegmentedControl,
  Slider,
  Popover,
} from "@mantine/core";
import { motion } from "framer-motion";
import { Thermometer, Waves } from "lucide-react";

type ActivationFn = "sigmoid" | "relu";

/**
 * Beach Day Sandbox
 *
 * A 1-2-1 neural network that learns to predict the perfect beach day
 * based on temperature. The network should activate only in the mid-range.
 */
export function BeachDaySandbox() {
  // Network architecture: 1 input -> 2 hidden -> 1 output
  const [activationFn, setActivationFn] = useState<ActivationFn>("sigmoid");

  // Input value
  const [temperature, setTemperature] = useState(0.5);

  // Weights: Input to Hidden (1x2 = 2 weights)
  const [w_i_h0, setW_i_h0] = useState(1.5);
  const [w_i_h1, setW_i_h1] = useState(1.5);

  // Weights: Hidden to Output (2x1 = 2 weights)
  const [w_h0_o, setW_h0_o] = useState(1.0);
  const [w_h1_o, setW_h1_o] = useState(-1.0);

  // Biases: Hidden layer (2 biases)
  const [bias_h0, setBias_h0] = useState(-0.3);
  const [bias_h1, setBias_h1] = useState(-0.9);

  // Biases: Output layer (1 bias)
  const [bias_o, setBias_o] = useState(-0.5);

  // Activation functions
  const activate = useCallback(
    (x: number): number => {
      if (activationFn === "sigmoid") {
        return 1 / (1 + Math.exp(-x));
      } else {
        // ReLU, capped at 1
        return Math.max(0, Math.min(1, x));
      }
    },
    [activationFn],
  );

  // Forward propagation
  const network = useMemo(() => {
    // Hidden layer
    const h0_sum = temperature * w_i_h0 + bias_h0;
    const h0 = activate(h0_sum);

    const h1_sum = temperature * w_i_h1 + bias_h1;
    const h1 = activate(h1_sum);

    // Output layer
    const o_sum = h0 * w_h0_o + h1 * w_h1_o + bias_o;
    const o = activate(o_sum);

    return {
      hidden: [h0, h1],
      output: o,
    };
  }, [
    temperature,
    w_i_h0,
    w_i_h1,
    w_h0_o,
    w_h1_o,
    bias_h0,
    bias_h1,
    bias_o,
    activate,
  ]);

  // Calculate if we're in the "sweet spot"
  const isSweetSpot = temperature >= 0.5 && temperature <= 0.7;
  const shouldBeHigh = isSweetSpot && network.output > 0.7;

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
              <Waves size={24} color="#228be6" />
              <Text fw={600} size="lg">
                Beach Day Predictor
              </Text>
            </Group>
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: "cyan", to: "blue" }}
            >
              1-2-1 Network
            </Badge>
          </Group>
          <Text size="sm" c="dimmed">
            Tune the network to activate only in the perfect temperature range
            (50-70%)!
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
              onChange={(value) => setActivationFn(value as ActivationFn)}
              data={[
                { label: "Sigmoid", value: "sigmoid" },
                { label: "ReLU", value: "relu" },
              ]}
            />
          </Box>

          {/* Temperature Display */}
          <Box ta="center">
            <Text size="xs" fw={600} c="dimmed" mb="xs">
              Current Temperature
            </Text>
            <Badge
              size="xl"
              variant="light"
              color={isSweetSpot ? "green" : "gray"}
              leftSection={<Thermometer size={16} />}
            >
              {(temperature * 100).toFixed(0)}°F
            </Badge>
          </Box>
        </Group>

        {/* Network Visualization */}
        <Box style={{ position: "relative", minHeight: 400 }}>
          {/* Connection Lines (SVG) */}
          <svg
            width="100%"
            height="400"
            viewBox="0 0 1000 400"
            preserveAspectRatio="xMidYMid meet"
            style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
          >
            {/* Input to Hidden Connections */}
            <WeightedConnection
              x1={200}
              y1={200}
              x2={450}
              y2={140}
              weight={w_i_h0}
              onWeightChange={setW_i_h0}
              label="W1"
            />
            <WeightedConnection
              x1={200}
              y1={200}
              x2={450}
              y2={260}
              weight={w_i_h1}
              onWeightChange={setW_i_h1}
              label="W2"
            />

            {/* Hidden to Output Connections */}
            <WeightedConnection
              x1={590}
              y1={140}
              x2={800}
              y2={200}
              weight={w_h0_o}
              onWeightChange={setW_h0_o}
              label="W3"
            />
            <WeightedConnection
              x1={590}
              y1={260}
              x2={800}
              y2={200}
              weight={w_h1_o}
              onWeightChange={setW_h1_o}
              label="W4"
            />
          </svg>

          {/* Neurons */}
          <Box
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              minHeight: 400,
            }}
          >
            {/* Input Layer */}
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Badge size="sm" variant="light" color="gray">
                INPUT
              </Badge>
              <Box style={{ width: 150 }}>
                <Text size="xs" fw={600} c="dimmed" ta="center" mb="xs">
                  Temperature
                </Text>
                <Box
                  style={{
                    width: 100,
                    height: 100,
                    margin: "0 auto",
                    borderRadius: "50%",
                    border: "3px solid #868e96",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    gap: 4,
                  }}
                >
                  <Thermometer size={28} color="#868e96" />
                  <Text size="lg" fw={700} c="white">
                    {(temperature * 100).toFixed(0)}°
                  </Text>
                </Box>
                <Slider
                  value={temperature}
                  onChange={setTemperature}
                  min={0}
                  max={1}
                  step={0.01}
                  size="md"
                  mt="md"
                  color="blue"
                  marks={[
                    { value: 0, label: "0°" },
                    { value: 0.5, label: "50°" },
                    { value: 1, label: "100°" },
                  ]}
                  styles={{
                    markLabel: { fontSize: 10 },
                  }}
                />
              </Box>
            </Box>

            {/* Hidden Layer */}
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
              mb={80}
            >
              <Badge size="sm" variant="light" color="teal">
                HIDDEN LAYER
              </Badge>
              <Stack>
                <LiquidNeuron
                  label="Not Cold?"
                  sublabel="(Cold Detector)"
                  value={network.hidden[0]}
                  bias={bias_h0}
                  onBiasChange={setBias_h0}
                  color="#12b886"
                />
                <LiquidNeuron
                  label="Not Hot?"
                  sublabel="(Heat Detector)"
                  value={network.hidden[1]}
                  bias={bias_h1}
                  onBiasChange={setBias_h1}
                  color="#12b886"
                />
              </Stack>
            </Box>

            {/* Output Layer */}
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
              mb={40}
            >
              <Badge size="sm" variant="light" color="orange">
                OUTPUT
              </Badge>
              <OutputNeuron
                label="Pack the Bags? 🏖️"
                value={network.output}
                bias={bias_o}
                onBiasChange={setBias_o}
                color="#228be6"
              />
            </Box>
          </Box>
        </Box>

        {/* Results Display */}
        <Paper
          p="md"
          style={{
            backgroundColor: shouldBeHigh ? "#2f9e4353" : "#25262b",
            border: `1px solid ${shouldBeHigh ? "#51cf66a1" : "#373a40"}`,
            transition: "all 0.3s ease",
          }}
        >
          <Group justify="space-around" align="center">
            <Box ta="center">
              <Text size="xs" c="dimmed" mb="xs">
                Beach Day Score
              </Text>
              <Text
                size="2xl"
                fw={700}
                c={network.output > 0.7 ? "green" : "white"}
              >
                {(network.output * 100).toFixed(1)}%
              </Text>
            </Box>
            <Box ta="center">
              <Text size="xs" c="dimmed" mb="xs">
                Network Status
              </Text>
              <Badge
                size="lg"
                variant="filled"
                color={shouldBeHigh ? "green" : "gray"}
              >
                {shouldBeHigh ? "✓ Perfect!" : "Keep Tuning..."}
              </Badge>
            </Box>
            <Box ta="center">
              <Text size="xs" c="dimmed" mb="xs">
                Target Range
              </Text>
              <Text size="sm" fw={600}>
                50-70°F
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
            <strong>Your Challenge:</strong> Adjust the weights and biases so
            the "Beach Day Score" is high ({">"} 70%) only when temperature is
            in the sweet spot (50-70°F). This requires both hidden neurons to
            work together - one detecting "warm enough" and the other "not too
            hot"!
          </Text>
        </Paper>

        {/* Hint Section */}
        <Paper
          p="sm"
          style={{
            backgroundColor: "#1e293b",
            border: "1px solid #475569",
          }}
        >
          <Text size="xs" c="dimmed" ta="center">
            💡 <strong>Hint:</strong> Try making one hidden neuron activate for
            temperatures above 0.5 (positive weight, negative bias), and the
            other activate for temperatures below 0.7 (positive weight, more
            negative bias). Then combine them at the output!
          </Text>
        </Paper>
      </Stack>
    </Paper>
  );
}

// ==================== Helper Components ====================

interface WeightedConnectionProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  weight: number;
  onWeightChange: (weight: number) => void;
  label: string;
}

function WeightedConnection({
  x1,
  y1,
  x2,
  y2,
  weight,
  onWeightChange,
  label,
}: WeightedConnectionProps) {
  const [opened, setOpened] = useState(false);

  // Calculate color and thickness
  const color = weight >= 0 ? "#228be6" : "#fa5252";
  const thickness = 2 + Math.abs(weight) * 2.5;

  // Midpoint for the control
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g>
      {/* Connection Line with Glow */}
      <defs>
        <filter id={`glow-${label}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={thickness}
        opacity={0.7}
        strokeLinecap="round"
        filter={`url(#glow-${label})`}
      />

      {/* Weight Badge */}
      <Popover opened={opened} onChange={setOpened} position="top" withArrow>
        <Popover.Target>
          <g onClick={() => setOpened(!opened)} style={{ cursor: "pointer" }}>
            <circle cx={midX} cy={midY} r="22" fill={color} opacity={0.95} />
            <circle
              cx={midX}
              cy={midY}
              r="22"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity={0.3}
            />
            <text
              x={midX}
              y={midY}
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              fontSize="14"
              fontWeight="bold"
            >
              {weight.toFixed(1)}
            </text>
          </g>
        </Popover.Target>
        <Popover.Dropdown style={{ zIndex: 3000 }}>
          <Box style={{ width: 220 }}>
            <Text size="xs" fw={600} mb="xs">
              {label} Weight: {weight.toFixed(2)}
            </Text>
            <Text size="xs" c="dimmed" mb="sm">
              {weight >= 0 ? "Excitatory (Blue)" : "Inhibitory (Red)"}
            </Text>
            <Slider
              value={weight}
              onChange={onWeightChange}
              min={-2}
              max={2}
              step={0.1}
              color={weight >= 0 ? "blue" : "red"}
              marks={[
                { value: -2, label: "-2" },
                { value: 0, label: "0" },
                { value: 2, label: "2" },
              ]}
            />
          </Box>
        </Popover.Dropdown>
      </Popover>
    </g>
  );
}

interface LiquidNeuronProps {
  label: string;
  sublabel: string;
  value: number;
  bias: number;
  onBiasChange: (bias: number) => void;
  color: string;
}

function LiquidNeuron({
  label,
  sublabel,
  value,
  bias,
  onBiasChange,
  color,
}: LiquidNeuronProps) {
  const [showBiasSlider, setShowBiasSlider] = useState(false);
  const fillPercentage = Math.max(0, Math.min(100, value * 100));

  return (
    <Box style={{ position: "relative", width: 110 }}>
      <Text size="xs" fw={600} c="dimmed" ta="center" mb={2}>
        {label}
      </Text>
      <Text size="xs" c="dimmed" ta="center" mb="xs" opacity={0.6}>
        {sublabel}
      </Text>

      {/* Neuron Circle */}
      <Box
        style={{
          width: 70,
          aspectRatio: "1 / 1",
          margin: "0 auto",
          borderRadius: "50%",
          border: `3px solid ${color}`,
          overflow: "hidden",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          position: "relative",
          boxShadow:
            fillPercentage > 50
              ? `0 0 20px ${color}80`
              : "0 0 5px rgba(0,0,0,0.5)",
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
            height: 10,
            backgroundColor: color,
            opacity: 0.5,
            borderRadius: "50%",
          }}
          animate={{
            x: [0, -50],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Value Display */}
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
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              cursor: "pointer",
            }}
            onClick={() => setShowBiasSlider(!showBiasSlider)}
          >
            B: {bias.toFixed(1)}
          </Badge>
        </Popover.Target>
        <Popover.Dropdown style={{ zIndex: 3000 }}>
          <Box style={{ width: 200 }}>
            <Text size="xs" fw={600} mb="xs">
              Bias: {bias.toFixed(2)}
            </Text>
            <Text size="xs" c="dimmed" mb="sm">
              Shifts the activation threshold
            </Text>
            <Slider
              value={bias}
              onChange={onBiasChange}
              min={-2}
              max={2}
              step={0.1}
              color="red"
              marks={[
                { value: -2, label: "-2" },
                { value: 0, label: "0" },
                { value: 2, label: "2" },
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
  color: string;
}

function OutputNeuron({
  label,
  value,
  bias,
  onBiasChange,
  color,
}: OutputNeuronProps) {
  const [showBiasSlider, setShowBiasSlider] = useState(false);
  const fillPercentage = Math.max(0, Math.min(100, value * 100));

  return (
    <Box style={{ position: "relative", width: 140 }}>
      <Text size="xs" fw={600} c="dimmed" ta="center" mb="xs">
        {label}
      </Text>

      {/* Neuron Circle */}
      <motion.div
        style={{
          width: 80,
          height: 80,
          margin: "0 auto",
          borderRadius: "50%",
          border: `4px solid ${color}`,
          overflow: "hidden",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          position: "relative",
        }}
        animate={{
          boxShadow:
            fillPercentage > 70
              ? `0 0 40px ${color}CC, 0 0 20px ${color}80`
              : "0 0 5px rgba(0,0,0,0.5)",
          scale: fillPercentage > 70 ? [1, 1.02, 1] : 1,
        }}
        transition={{
          scale: {
            duration: 1,
            repeat: fillPercentage > 70 ? Infinity : 0,
          },
        }}
      >
        {/* Liquid Fill */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background:
              fillPercentage > 70
                ? `linear-gradient(180deg, ${color} 0%, #51cf66 100%)`
                : color,
            opacity: 0.85,
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
            height: 15,
            backgroundColor: color,
            opacity: 0.5,
            borderRadius: "50%",
          }}
          animate={{
            x: [0, -60],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Value Display */}
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

        {/* Success Indicator */}
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
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              cursor: "pointer",
            }}
            onClick={() => setShowBiasSlider(!showBiasSlider)}
          >
            B: {bias.toFixed(1)}
          </Badge>
        </Popover.Target>
        <Popover.Dropdown style={{ zIndex: 3000 }}>
          <Box style={{ width: 200 }}>
            <Text size="xs" fw={600} mb="xs">
              Output Bias: {bias.toFixed(2)}
            </Text>
            <Text size="xs" c="dimmed" mb="sm">
              Final decision threshold adjustment
            </Text>
            <Slider
              value={bias}
              onChange={onBiasChange}
              min={-2}
              max={2}
              step={0.1}
              color="red"
              marks={[
                { value: -2, label: "-2" },
                { value: 0, label: "0" },
                { value: 2, label: "2" },
              ]}
            />
          </Box>
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
}
