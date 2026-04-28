import { useState } from "react";
import { Paper, Stack, Group, Box, Button, Text, Badge } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle, Image } from "lucide-react";

interface FeatureNeuron {
  id: string;
  label: string;
  message: string;
  value: number;
}

/**
 * Cat Detector Playground
 *
 * A playful illustration of multi-layer neural networks where hidden neurons
 * detect features (ears, whiskers, tail) that combine to make a final decision.
 */
export function CatDetectorPlayground() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);
  const [activeAbstract, setActiveAbstract] = useState<string[]>([]);
  const [catDetected, setCatDetected] = useState(false);
  const [inputActive, setInputActive] = useState(false);

  const features: FeatureNeuron[] = [
    { id: "ears", label: "Pointy Ears?", message: "I see ears! 🐱", value: 0 },
    {
      id: "whiskers",
      label: "Whiskers?",
      message: "Found a whisker! 😸",
      value: 0,
    },
    { id: "tail", label: "Tail?", message: "That's a tail! 🐈", value: 0 },
    {
      id: "nap",
      label: "Nap Enthusiast?",
      message: "Definitely napping! 😴",
      value: 0,
    },
  ];

  const abstractFeatures = [
    { id: "physical", label: "Cat Features?", message: "Physical match! 🎯" },
    { id: "behavior", label: "Cat Behavior?", message: "Acts like a cat! 🐾" },
  ];

  const runCatScan = async () => {
    setIsRunning(true);
    setActiveFeatures([]);
    setActiveAbstract([]);
    setCatDetected(false);
    setInputActive(false);

    // Step 0: Input layer activates
    setInputActive(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Step A & B: Hidden Layer 1 neurons fill and show messages (staggered)
    for (let i = 0; i < features.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setActiveFeatures((prev) => [...prev, features[i].id]);
    }

    // Step C: Hidden Layer 2 (abstract features) activates
    await new Promise((resolve) => setTimeout(resolve, 500));
    for (let i = 0; i < abstractFeatures.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setActiveAbstract((prev) => [...prev, abstractFeatures[i].id]);
    }

    // Step D: Fire into output neuron
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCatDetected(true);

    // Reset after showing result
    await new Promise((resolve) => setTimeout(resolve, 4000));
    setIsRunning(false);
    setActiveFeatures([]);
    setActiveAbstract([]);
    setCatDetected(false);
    setInputActive(false);
  };

  return (
    <Paper
      shadow="xl"
      p="xl"
      radius="lg"
      style={{
        backgroundColor: "#1a1b1e",
        border: "1px solid #373a40",
        overflow: "auto",
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
        {/* Header */}
        <Box>
          <Group justify="space-between" mb="xs" wrap="wrap" gap="xs">
            <Group gap="sm">
              <Sparkles size={24} color="#228be6" />
              <Text fw={600} size="lg">
                Multi-Layer Cat Detector
              </Text>
            </Group>
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: "pink", to: "orange" }}
            >
              Feature Hierarchy
            </Badge>
          </Group>
          <Text size="sm" c="dimmed">
            Watch how multiple feature detectors work together to recognize a
            cat!
          </Text>
        </Box>

        {/* Main Visualization */}
        <Group justify="space-around" align="center" wrap="nowrap">
          {/* Input Layer */}
          <Stack gap="lg" align="center">
            <Badge size="md" variant="light" color="gray">
              Input
            </Badge>

            <Box style={{ position: "relative" }}>
              <Text size="xs" fw={600} c="dimmed" ta="center" mb="xs">
                Image Data
              </Text>

              {/* Input "Neuron" - Visual representation */}
              <motion.div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 12,
                  border: `3px solid ${inputActive ? "#4c6ef5" : "#5c5f66"}`,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  position: "relative",
                  overflow: "hidden",
                }}
                animate={{
                  borderColor: inputActive ? "#4c6ef5" : "#5c5f66",
                  boxShadow: inputActive
                    ? "0 0 20px rgba(76, 110, 245, 0.4)"
                    : "none",
                }}
              >
                {/* Pulse effect when active */}
                <AnimatePresence>
                  {inputActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.3, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "#4c6ef5",
                      }}
                    />
                  )}
                </AnimatePresence>

                <Image size={40} color={inputActive ? "#4c6ef5" : "#5c5f66"} />
                <Text size="xl" style={{ zIndex: 1 }}>
                  🐱
                </Text>
                <Text size="xs" c="dimmed" fw={600} style={{ zIndex: 1 }}>
                  Raw Pixels
                </Text>
              </motion.div>
            </Box>
          </Stack>

          {/* Hidden Layer 1: Feature Detectors */}
          <Stack gap="lg" align="center">
            <Badge size="md" variant="light" color="teal">
              Hidden Layer 1
            </Badge>
            <Stack gap="xl">
              {features.map((feature, index) => {
                const isActive = activeFeatures.includes(feature.id);
                const fillValue = isActive ? 0.85 : 0;

                return (
                  <Box key={feature.id} style={{ position: "relative" }}>
                    {/* Feature Neuron */}
                    <Box style={{ position: "relative" }}>
                      <Text size="xs" fw={600} c="dimmed" ta="center" mb="xs">
                        {feature.label}
                      </Text>

                      {/* Neuron Circle */}
                      <motion.div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          border: `3px solid ${isActive ? "#12b886" : "#5c5f66"}`,
                          overflow: "hidden",
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          position: "relative",
                        }}
                        animate={{
                          borderColor: isActive ? "#12b886" : "#5c5f66",
                          boxShadow: isActive
                            ? "0 0 20px rgba(18, 184, 134, 0.5)"
                            : "none",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Liquid Fill */}
                        <motion.div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: "#12b886",
                            opacity: 0.8,
                          }}
                          animate={{
                            height: `${fillValue * 100}%`,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            delay: index * 0.4,
                          }}
                        />

                        {/* Wave Effect */}
                        <motion.div
                          style={{
                            position: "absolute",
                            bottom: `${fillValue * 100}%`,
                            left: "-100%",
                            width: "300%",
                            height: 12,
                            backgroundColor: "#12b886",
                            opacity: 0.5,
                            borderRadius: "50%",
                          }}
                          animate={{
                            x: [0, -40],
                            bottom: [
                              `${fillValue * 100}%`,
                              `${fillValue * 100}%`,
                            ],
                          }}
                          transition={{
                            x: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            },
                            bottom: {
                              type: "spring",
                              stiffness: 100,
                              damping: 15,
                            },
                          }}
                        />

                        {/* Check Mark */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                fontSize: 24,
                                zIndex: 10,
                              }}
                            >
                              ✓
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Box>

                    {/* Speech Bubble */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, x: -20, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.4 + 0.2 }}
                          style={{
                            position: "absolute",
                            left: 100,
                            top: "50%",
                            transform: "translateY(-50%)",
                            whiteSpace: "nowrap",
                            zIndex: 100,
                          }}
                        >
                          <Paper
                            p="xs"
                            radius="md"
                            style={{
                              backgroundColor: "#12b886",
                              border: "2px solid #0ca678",
                              position: "relative",
                            }}
                          >
                            {/* Speech bubble arrow */}
                            <Box
                              style={{
                                position: "absolute",
                                left: -8,
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: 0,
                                height: 0,
                                borderTop: "8px solid transparent",
                                borderBottom: "8px solid transparent",
                                borderRight: "8px solid #12b886",
                              }}
                            />
                            <Text size="sm" fw={600} c="white">
                              {feature.message}
                            </Text>
                          </Paper>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                );
              })}
            </Stack>
          </Stack>

          {/* Hidden Layer 2: Abstract Features */}
          <Stack gap="lg" align="center">
            <Badge size="md" variant="light" color="violet">
              Hidden Layer 2
            </Badge>
            <Stack gap="xl">
              {abstractFeatures.map((abstract, index) => {
                const isActive = activeAbstract.includes(abstract.id);
                const fillValue = isActive ? 0.8 : 0;

                return (
                  <Box key={abstract.id} style={{ position: "relative" }}>
                    <Box style={{ position: "relative" }}>
                      <Text size="xs" fw={600} c="dimmed" ta="center" mb="xs">
                        {abstract.label}
                      </Text>

                      {/* Abstract Neuron Circle */}
                      <motion.div
                        style={{
                          width: 90,
                          height: 90,
                          borderRadius: "50%",
                          border: `3px solid ${isActive ? "#7950f2" : "#5c5f66"}`,
                          overflow: "hidden",
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          position: "relative",
                        }}
                        animate={{
                          borderColor: isActive ? "#7950f2" : "#5c5f66",
                          boxShadow: isActive
                            ? "0 0 25px rgba(121, 80, 242, 0.5)"
                            : "none",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Liquid Fill */}
                        <motion.div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: "#7950f2",
                            opacity: 0.8,
                          }}
                          animate={{
                            height: `${fillValue * 100}%`,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            delay: 2 + index * 0.3,
                          }}
                        />

                        {/* Wave Effect */}
                        <motion.div
                          style={{
                            position: "absolute",
                            bottom: `${fillValue * 100}%`,
                            left: "-100%",
                            width: "300%",
                            height: 15,
                            backgroundColor: "#7950f2",
                            opacity: 0.5,
                            borderRadius: "50%",
                          }}
                          animate={{
                            x: [0, -45],
                            bottom: [
                              `${fillValue * 100}%`,
                              `${fillValue * 100}%`,
                            ],
                          }}
                          transition={{
                            x: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            },
                            bottom: {
                              type: "spring",
                              stiffness: 100,
                              damping: 15,
                            },
                          }}
                        />

                        {/* Icon */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                fontSize: 28,
                                zIndex: 10,
                              }}
                            >
                              {index === 0 ? "✨" : "🧠"}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Box>

                    {/* Speech Bubble */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, x: -20, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: 2 + index * 0.3 + 0.2 }}
                          style={{
                            position: "absolute",
                            left: 110,
                            top: "50%",
                            transform: "translateY(-50%)",
                            whiteSpace: "nowrap",
                            zIndex: 100,
                          }}
                        >
                          <Paper
                            p="xs"
                            radius="md"
                            style={{
                              backgroundColor: "#7950f2",
                              border: "2px solid #6741d9",
                              position: "relative",
                            }}
                          >
                            <Box
                              style={{
                                position: "absolute",
                                left: -8,
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: 0,
                                height: 0,
                                borderTop: "8px solid transparent",
                                borderBottom: "8px solid transparent",
                                borderRight: "8px solid #7950f2",
                              }}
                            />
                            <Text size="sm" fw={600} c="white">
                              {abstract.message}
                            </Text>
                          </Paper>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                );
              })}
            </Stack>
          </Stack>

          {/* Output Layer */}
          <Stack gap="lg" align="center">
            <Badge size="md" variant="light">
              Output Layer
            </Badge>

            <Box style={{ position: "relative" }}>
              <Text
                size="sm"
                fw={700}
                ta="center"
                mb="xs"
                style={{
                  background:
                    "linear-gradient(135deg, #fa5252 0%, #ff922b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                CAT DETECTED!
              </Text>

              {/* Output Neuron */}
              <motion.div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  border: `4px solid ${catDetected ? "#fa5252" : "#5c5f66"}`,
                  overflow: "hidden",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  position: "relative",
                }}
                animate={{
                  borderColor: catDetected ? "#fa5252" : "#5c5f66",
                  scale: catDetected ? [1, 1.05, 1] : 1,
                  boxShadow: catDetected
                    ? "0 0 40px rgba(250, 82, 82, 0.6)"
                    : "none",
                }}
                transition={{
                  scale: {
                    duration: 0.5,
                    repeat: catDetected ? Infinity : 0,
                    repeatDelay: 0.5,
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
                      "linear-gradient(180deg, #fa5252 0%, #ff922b 100%)",
                    opacity: 0.8,
                  }}
                  animate={{
                    height: catDetected ? "90%" : "0%",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 15,
                    delay: 1.8,
                  }}
                />

                {/* Wave Effect */}
                <motion.div
                  style={{
                    position: "absolute",
                    bottom: catDetected ? "90%" : "0%",
                    left: "-100%",
                    width: "300%",
                    height: 20,
                    backgroundColor: "#fa5252",
                    opacity: 0.5,
                    borderRadius: "50%",
                  }}
                  animate={{
                    x: [0, -70],
                    bottom: catDetected ? "90%" : "0%",
                  }}
                  transition={{
                    x: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    bottom: {
                      type: "spring",
                      stiffness: 80,
                      damping: 15,
                    },
                  }}
                />

                {/* Cat Emoji */}
                <AnimatePresence>
                  {catDetected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ delay: 2, type: "spring" }}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: 48,
                        zIndex: 10,
                      }}
                    >
                      🐱
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Alert Badge */}
              <AnimatePresence>
                {catDetected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 2.2 }}
                    style={{ marginTop: 12 }}
                  >
                    <Badge
                      size="lg"
                      variant="filled"
                      color="red"
                      leftSection={<AlertCircle size={16} />}
                    >
                      POSITIVE MATCH
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Stack>
        </Group>

        {/* Control Button */}
        <Box ta="center">
          <Button
            size="lg"
            variant="gradient"
            gradient={{ from: "teal", to: "blue", deg: 135 }}
            onClick={runCatScan}
            disabled={isRunning}
            leftSection={<Sparkles size={20} />}
            style={{ minWidth: 200 }}
          >
            {isRunning ? "Scanning..." : "Run Cat Scan"}
          </Button>
        </Box>

        {/* Explanation */}
        <Paper
          p="md"
          style={{
            backgroundColor: "#25262b",
            border: "1px solid #373a40",
          }}
        >
          <Text size="sm" c="dimmed" ta="center">
            <strong>Input Layer</strong> → Raw pixel data flows in.
            <strong> Hidden Layer 1</strong> → Detects low-level features (ears,
            whiskers).
            <strong> Hidden Layer 2</strong> → Combines features into higher
            concepts (physical traits, behavior).
            <strong> Output</strong> → Final decision: CAT! 🐱
          </Text>
        </Paper>
      </Stack>
    </Paper>
  );
}
