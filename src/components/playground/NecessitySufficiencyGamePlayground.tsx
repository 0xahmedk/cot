import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Code,
  Divider,
  Group,
  Paper,
  Progress,
  Stack,
  Switch,
  Text,
  Tooltip,
} from "@mantine/core";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";

type StepId = 1 | 2 | 3;

interface ReasoningStep {
  id: StepId;
  label: string;
  hoverExplanation: string;
}

const reasoningSteps: ReasoningStep[] = [
  {
    id: 1,
    label: "Use identity: n^2 + n + 1 = n(n+1) + 1; compute 99×100 = 9900.",
    hoverExplanation:
      "A concise algebraic identity that directly produces the subtotal needed for the final answer.",
  },
  {
    id: 2,
    label: "Algebraic expansion: (100-1)^2 = 10000 - 200 + 1 = 9801.",
    hoverExplanation:
      "A longer algebraic path that computes 99^2 explicitly; useful math but redundant when the identity in Step 1 is used to compute the final answer more directly.",
  },
  {
    id: 3,
    label:
      "Combine amounts / conclude: 9801 + 99 + 1 = 9901 (or 9900 + 1 = 9901).",
    hoverExplanation:
      "Final assembly step that produces the numeric answer from computed quantities.",
  },
];

const fullTrace: Record<StepId, boolean> = { 1: true, 2: true, 3: true };

interface Evaluation {
  isCorrect: boolean;
  producedAnswer: string;
  reason: string;
}

function evaluateTrace(enabled: Record<StepId, boolean>): Evaluation {
  const hasStep1 = enabled[1];
  const hasStep2 = enabled[2];
  const hasStep3 = enabled[3];

  // Correct if we have the final assembly step and at least one computational path
  if (hasStep3 && (hasStep1 || hasStep2)) {
    return {
      isCorrect: true,
      producedAnswer: "9901",
      reason: hasStep1
        ? "Identity path present; final assembly produces 9901."
        : "Expansion path present; final assembly produces 9901.",
    };
  }

  if (!hasStep3) {
    return {
      isCorrect: false,
      producedAnswer: "No final answer produced",
      reason:
        "Without the final assembly step the trace reports intermediate facts but no answer.",
    };
  }

  return {
    isCorrect: false,
    producedAnswer: "Cannot derive reliably",
    reason:
      "The active subset lacks any computational path to the numeric subtotal.",
  };
}

export function NecessitySufficiencyGamePlayground() {
  const [enabledSteps, setEnabledSteps] = useState<Record<StepId, boolean>>({
    1: true,
    2: true,
    3: true,
  });
  const [focusedStep, setFocusedStep] = useState<StepId>(2);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  const currentEvaluation = useMemo(
    () => evaluateTrace(enabledSteps),
    [enabledSteps],
  );

  const necessityOfFocusedStep = useMemo(() => {
    const intervention: Record<StepId, boolean> = {
      ...fullTrace,
      [focusedStep]: false,
    };
    return !evaluateTrace(intervention).isCorrect;
  }, [focusedStep]);

  const sufficiencyOfCurrentSet = currentEvaluation.isCorrect;

  const toggleStep = (stepId: StepId) => {
    setEnabledSteps((current) => ({
      ...current,
      [stepId]: !current[stepId],
    }));
    setHasEvaluated(false);
  };

  const runChallengeStep2 = () => {
    setFocusedStep(2);
    setEnabledSteps({ 1: true, 2: false, 3: true });
    setHasEvaluated(true);
  };

  const resetAll = () => {
    setEnabledSteps({ 1: true, 2: true, 3: true });
    setFocusedStep(2);
    setHasEvaluated(false);
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
        <Stack gap="xs">
          <Text fw={600} size="lg">
            Section B: Necessity vs. Sufficiency
          </Text>
          <Text size="sm" c="dimmed" style={{ lineHeight: 1.7 }}>
            Correct final answer is fixed: <strong>9901</strong>. Intervene on
            steps and watch what happens to correctness.
          </Text>
        </Stack>

        <Paper
          p="md"
          radius="md"
          style={{ border: "1px solid #373a40", backgroundColor: "#141517" }}
        >
          <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>
            Paper example
          </Text>
          <Text size="sm" style={{ lineHeight: 1.65 }}>
            Compute 99^2 + 99 + 1 in your head. Which steps are necessary or
            redundant to reach the final answer 9901?
          </Text>
        </Paper>

        <Alert
          color="blue"
          icon={<HelpCircle size={16} />}
          title="Interactive Challenge"
        >
          Remove Step 2 and evaluate. If the answer stays correct, Step 2 is
          redundant. If it breaks, Step 2 is necessary.
        </Alert>

        <Group gap="sm" wrap="wrap">
          <Button variant="light" onClick={runChallengeStep2}>
            Try: Remove Step 2
          </Button>
          <Button onClick={() => setHasEvaluated(true)}>
            Evaluate current set
          </Button>
          <Button variant="subtle" color="gray" onClick={resetAll}>
            Reset
          </Button>
        </Group>

        <Divider />

        <Stack gap="sm">
          {reasoningSteps.map((step) => {
            const isActive = enabledSteps[step.id];
            const interventionWithoutThis = evaluateTrace({
              ...fullTrace,
              [step.id]: false,
            });
            const isNecessary = !interventionWithoutThis.isCorrect;

            return (
              <Paper
                key={step.id}
                p="sm"
                radius="md"
                onClick={() => setFocusedStep(step.id)}
                style={{
                  border:
                    focusedStep === step.id
                      ? "1px solid #228be6"
                      : "1px solid #373a40",
                  backgroundColor: "#141517",
                  cursor: "pointer",
                }}
              >
                <Group justify="space-between" align="center" wrap="nowrap">
                  <Stack gap={6} style={{ flex: 1 }}>
                    <Group gap={8} wrap="wrap">
                      <Text size="sm" fw={600}>
                        Step {step.id}
                      </Text>
                      <Badge
                        variant="light"
                        color={isNecessary ? "blue" : "gray"}
                      >
                        {isNecessary ? "Necessary" : "Redundant"}
                      </Badge>
                      {!isActive && (
                        <Badge variant="outline" color="red">
                          Removed
                        </Badge>
                      )}
                    </Group>
                    <Tooltip
                      withArrow
                      multiline
                      openDelay={120}
                      label={step.hoverExplanation}
                    >
                      <Text size="sm" style={{ lineHeight: 1.6 }}>
                        {step.label}
                      </Text>
                    </Tooltip>
                  </Stack>

                  <Switch
                    checked={isActive}
                    onChange={() => toggleStep(step.id)}
                    onClick={(event) => event.stopPropagation()}
                    label={isActive ? "Included" : "Excluded"}
                    size="md"
                  />
                </Group>
              </Paper>
            );
          })}
        </Stack>

        <Divider />

        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm" fw={600}>
              Necessity scale (focused step)
            </Text>
            <Badge
              color={necessityOfFocusedStep ? "blue" : "gray"}
              variant="light"
            >
              {necessityOfFocusedStep ? "Necessary" : "Redundant"}
            </Badge>
          </Group>
          <Progress value={necessityOfFocusedStep ? 100 : 0} color="blue" />

          <Group justify="space-between" mt="sm">
            <Text size="sm" fw={600}>
              Sufficiency scale (active subset)
            </Text>
            <Badge
              color={sufficiencyOfCurrentSet ? "teal" : "red"}
              variant="light"
            >
              {sufficiencyOfCurrentSet ? "Sufficient" : "Insufficient"}
            </Badge>
          </Group>
          <Progress value={sufficiencyOfCurrentSet ? 100 : 20} color="teal" />
        </Stack>

        {hasEvaluated && (
          <Paper
            p="md"
            radius="md"
            style={{ border: "1px solid #373a40", backgroundColor: "#141517" }}
          >
            <Stack gap="xs">
              <Group gap="xs" align="center">
                {currentEvaluation.isCorrect ? (
                  <CheckCircle2 size={16} color="#12b886" />
                ) : (
                  <XCircle size={16} color="#fa5252" />
                )}
                <Text fw={600} size="sm">
                  {currentEvaluation.isCorrect
                    ? "Answer preserved"
                    : "Answer breaks"}
                </Text>
              </Group>

              <Text size="sm" c="dimmed" style={{ lineHeight: 1.7 }}>
                {currentEvaluation.reason}
              </Text>

              <Text size="sm">
                Model output from active subset:{" "}
                <Code>{currentEvaluation.producedAnswer}</Code>
              </Text>

              <Text size="xs" c="dimmed">
                Tip: Click any step card to focus it, then read the Necessity
                scale to test whether removing that step from the full trace
                breaks correctness.
              </Text>
            </Stack>
          </Paper>
        )}

        <Text size="xs" c="dimmed" ta="center">
          In this example, Step 1 and Step 3 are necessary. Step 2 is
          intentionally redundant to make intervention effects obvious.
        </Text>
      </Stack>
    </Paper>
  );
}
