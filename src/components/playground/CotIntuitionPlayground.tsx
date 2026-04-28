import { useState } from "react";
import {
  Paper,
  Stack,
  Text,
  Group,
  Button,
  Badge,
  Tooltip,
  Divider,
  Box,
  Code,
} from "@mantine/core";

interface ReasoningStep {
  id: number;
  text: string;
  contribution: string;
  necessityNote: string;
  sufficiencyNote: string;
  isNecessary: boolean;
  isInSufficientSet: boolean;
}

const HARD_CODED_EXAMPLE = {
  question:
    "Maya buys 3 notebooks at $4 each and 1 pen at $2. She pays with $20. How much change does she receive?",
  finalAnswer: "$6",
  sufficientSet: [1, 2, 3, 4],
  steps: [
    {
      id: 1,
      text: "Compute notebook cost: 3 × 4 = 12.",
      contribution:
        "Creates the main subtotal for notebooks, which is required for total cost.",
      necessityNote:
        "If this is removed, we cannot reliably compute the total purchase amount.",
      sufficiencyNote:
        "This step belongs to a sufficient subset because it provides one of the two needed cost components.",
      isNecessary: true,
      isInSufficientSet: true,
    },
    {
      id: 2,
      text: "Add pen cost: 12 + 2 = 14.",
      contribution: "Combines item-level costs into total spending.",
      necessityNote:
        "Without total spending, change cannot be computed from the payment.",
      sufficiencyNote:
        "This is part of a sufficient set because it bridges item costs to total cost.",
      isNecessary: true,
      isInSufficientSet: true,
    },
    {
      id: 3,
      text: "Use payment amount: paid = 20.",
      contribution:
        "Introduces the second quantity needed for subtraction (payment).",
      necessityNote: "Removing payment makes the final subtraction undefined.",
      sufficiencyNote:
        "This step is sufficient-set material because change depends on payment and total cost.",
      isNecessary: true,
      isInSufficientSet: true,
    },
    {
      id: 4,
      text: "Compute change: 20 - 14 = 6.",
      contribution:
        "Concludes the reasoning by transforming totals into the final answer.",
      necessityNote:
        "Without this conversion step, the model has intermediate facts but no final output.",
      sufficiencyNote:
        "Together with prior core steps, this is enough to produce the correct answer.",
      isNecessary: true,
      isInSufficientSet: true,
    },
  ] as ReasoningStep[],
};

export function CotIntuitionPlayground() {
  const [revealedSteps, setRevealedSteps] = useState(0);
  const [isThinking, setIsThinking] = useState(false);

  const totalSteps = HARD_CODED_EXAMPLE.steps.length;
  const allRevealed = revealedSteps === totalSteps;

  const simulateNextStep = () => {
    if (revealedSteps >= totalSteps || isThinking) {
      return;
    }

    setIsThinking(true);
    window.setTimeout(() => {
      setRevealedSteps((currentCount) =>
        Math.min(currentCount + 1, totalSteps),
      );
      setIsThinking(false);
    }, 650);
  };

  return (
    <Paper
      p="xl"
      radius="lg"
      style={{
        backgroundColor: "#1a1b1e",
        border: "1px solid #373a40",
      }}
    >
      <Stack gap="lg">
        <Box>
          <Text fw={600} size="lg" mb="xs">
            CoT Simulation Playground
          </Text>
          <Text size="sm" c="dimmed">
            Click <strong>Next step</strong> to simulate an LLM reasoning trace.
            Hover over revealed steps to inspect their causal role.
          </Text>
        </Box>

        <Paper
          p="md"
          radius="md"
          style={{ border: "1px solid #373a40", backgroundColor: "#141517" }}
        >
          <Stack gap="xs">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Hardcoded Example
            </Text>
            <Text size="sm" style={{ lineHeight: 1.7 }}>
              {HARD_CODED_EXAMPLE.question}
            </Text>
          </Stack>
        </Paper>

        <Group gap="sm" wrap="wrap">
          <Button
            onClick={simulateNextStep}
            disabled={allRevealed || isThinking}
          >
            {isThinking ? "Thinking..." : "Next step"}
          </Button>
          <Button
            variant="light"
            color="teal"
            onClick={() => setRevealedSteps(totalSteps)}
            disabled={allRevealed || isThinking}
          >
            Simulate full trace
          </Button>
          <Button
            variant="subtle"
            color="gray"
            onClick={() => {
              setRevealedSteps(0);
              setIsThinking(false);
            }}
          >
            Reset
          </Button>
        </Group>

        <Divider />

        <Stack gap="sm">
          {HARD_CODED_EXAMPLE.steps.slice(0, revealedSteps).map((step) => (
            <Tooltip
              key={step.id}
              multiline
              withArrow
              openDelay={120}
              label={
                <Stack gap={4}>
                  <Text size="xs">
                    <strong>Contribution:</strong> {step.contribution}
                  </Text>
                  <Text size="xs">
                    <strong>Necessity:</strong> {step.necessityNote}
                  </Text>
                  <Text size="xs">
                    <strong>Sufficiency:</strong> {step.sufficiencyNote}
                  </Text>
                </Stack>
              }
            >
              <Paper
                p="sm"
                radius="md"
                style={{
                  border: "1px solid #373a40",
                  backgroundColor: "#141517",
                  cursor: "help",
                }}
              >
                <Group justify="space-between" wrap="nowrap" gap="sm">
                  <Text size="sm" style={{ lineHeight: 1.6 }}>
                    <strong>Step {step.id}:</strong> {step.text}
                  </Text>
                  <Group gap={6}>
                    <Badge
                      color={step.isNecessary ? "blue" : "gray"}
                      variant="light"
                    >
                      {step.isNecessary ? "Necessary" : "Not necessary"}
                    </Badge>
                    <Badge
                      color={step.isInSufficientSet ? "teal" : "gray"}
                      variant="light"
                    >
                      {step.isInSufficientSet
                        ? "In sufficient set"
                        : "Outside sufficient set"}
                    </Badge>
                  </Group>
                </Group>
              </Paper>
            </Tooltip>
          ))}

          {!revealedSteps && (
            <Text size="sm" c="dimmed" fs="italic">
              No reasoning steps yet. Start the simulation.
            </Text>
          )}
        </Stack>

        {allRevealed && (
          <Paper
            p="md"
            radius="md"
            style={{ border: "1px solid #373a40", backgroundColor: "#141517" }}
          >
            <Stack gap="xs">
              <Text size="sm" c="dimmed">
                One sufficient subset in this toy example:
              </Text>
              <Code>
                {`{step ${HARD_CODED_EXAMPLE.sufficientSet.join(", step ")}}`}
              </Code>
              <Text size="md">
                Final answer: <strong>{HARD_CODED_EXAMPLE.finalAnswer}</strong>
              </Text>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
}
