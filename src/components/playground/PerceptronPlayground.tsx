import { useState } from "react";
import { Paper, Box, Group, Stack, Text, Badge, Title } from "@mantine/core";
import { Brain } from "lucide-react";
import { Neuron } from "./Neuron";
import { Connection } from "./Connection";
import { usePerceptron } from "../../hooks/usePerceptron";

/**
 * Interactive Perceptron Playground
 *
 * A visual, interactive neural network playground where:
 * - Weight sliders are positioned on connection lines
 * - Bias controls are attached to neurons
 * - Liquid fill animations show neuron activation
 * - Supports different network architectures
 */
export function PerceptronPlayground() {
  // Input values
  const [input1, setInput1] = useState(0.5);
  const [input2, setInput2] = useState(0.7);

  // Weights
  const [weight1, setWeight1] = useState(0.8);
  const [weight2, setWeight2] = useState(0.6);

  // Bias
  const [bias, setBias] = useState(-0.3);

  // Calculate output
  const { finalOutput } = usePerceptron({
    inputs: [input1, input2],
    weights: [weight1, weight2],
    bias,
    activationFunction: "relu",
  });

  // Layout configuration (positions in pixels) - Responsive
  const layout = {
    neuronSize: 80, // Smaller base size for mobile
    spacing: {
      horizontal: 250, // Reduced for mobile
      vertical: 120,
    },
    padding: {
      top: 60,
      left: 60,
      right: 60,
      bottom: 40,
    },
  };

  // Calculate neuron positions
  const positions = {
    input1: {
      x: layout.padding.left,
      y: layout.padding.top,
    },
    input2: {
      x: layout.padding.left,
      y: layout.padding.top + layout.spacing.vertical,
    },
    output: {
      x: layout.padding.left + layout.spacing.horizontal,
      y: layout.padding.top + layout.spacing.vertical / 2,
    },
  };

  // Calculate center of neurons for connections
  const getNeuronCenter = (pos: { x: number; y: number }) => ({
    x: pos.x + layout.neuronSize / 2,
    y: pos.y + layout.neuronSize / 2,
  });

  const input1Center = getNeuronCenter(positions.input1);
  const input2Center = getNeuronCenter(positions.input2);
  const outputCenter = getNeuronCenter(positions.output);

  // Total canvas size
  const canvasWidth =
    layout.padding.left +
    layout.spacing.horizontal +
    layout.neuronSize +
    layout.padding.right;
  const canvasHeight =
    layout.padding.top +
    layout.spacing.vertical +
    layout.neuronSize +
    layout.padding.bottom;

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between" align="center">
        <Group gap="sm">
          <Brain size={28} color="#228be6" />
          <Title order={2}>Perceptron Playground</Title>
        </Group>
        <Badge
          size="lg"
          variant="gradient"
          gradient={{ from: "blue", to: "teal" }}
        >
          Interactive
        </Badge>
      </Group>

      <Text size="sm" c="dimmed">
        Click on neurons to adjust inputs and bias. Hover over connection lines
        to adjust weights. Watch the liquid fill animation respond in real-time!
      </Text>

      {/* Main Playground */}
      <Paper
        shadow="xl"
        p="md"
        radius="lg"
        style={{
          backgroundColor: "#1a1b1e",
          border: "1px solid #373a40",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
        }}
        styles={{
          root: {
            "@media (min-width: 768px)": {
              padding: "1.5rem",
            },
          },
        }}
      >
        <Box
          style={{
            position: "relative",
            width: canvasWidth,
            height: canvasHeight,
          }}
        >
          {/* Connection Lines Layer */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            {/* Placeholder for lines - using absolute positioned divs instead */}
          </svg>

          {/* Connections using absolute positioning */}
          <Connection
            from={input1Center}
            to={outputCenter}
            weight={weight1}
            onWeightChange={setWeight1}
            showFlow
            activationStrength={input1}
          />
          <Connection
            from={input2Center}
            to={outputCenter}
            weight={weight2}
            onWeightChange={setWeight2}
            showFlow
            activationStrength={input2}
          />

          {/* Neurons Layer */}
          {/* Input Neuron 1 */}
          <Box
            style={{
              position: "absolute",
              left: positions.input1.x,
              top: positions.input1.y,
              zIndex: 10,
            }}
          >
            <Neuron
              label="Input 1"
              value={input1}
              type="input"
              size={layout.neuronSize}
              showBias={false}
            />
            {/* Input control slider */}
            <Box mt="md" style={{ width: layout.neuronSize }}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={input1}
                onChange={(e) => setInput1(parseFloat(e.target.value))}
                style={{
                  width: "100%",
                  height: "8px",
                  cursor: "pointer",
                }}
              />
            </Box>
          </Box>

          {/* Input Neuron 2 */}
          <Box
            style={{
              position: "absolute",
              left: positions.input2.x,
              top: positions.input2.y,
              zIndex: 10,
            }}
          >
            <Neuron
              label="Input 2"
              value={input2}
              type="input"
              size={layout.neuronSize}
              showBias={false}
            />
            {/* Input control slider */}
            <Box mt="md" style={{ width: layout.neuronSize }}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={input2}
                onChange={(e) => setInput2(parseFloat(e.target.value))}
                style={{
                  width: "100%",
                  height: "8px",
                  cursor: "pointer",
                }}
              />
            </Box>
          </Box>

          {/* Output Neuron */}
          <Box
            style={{
              position: "absolute",
              left: positions.output.x,
              top: positions.output.y,
              zIndex: 10,
            }}
          >
            <Neuron
              label="Output"
              value={finalOutput}
              type="output"
              size={layout.neuronSize}
              showBias
              bias={bias}
              onBiasChange={setBias}
            />
          </Box>
        </Box>
      </Paper>

      {/* Controls */}
    </Stack>
  );
}
