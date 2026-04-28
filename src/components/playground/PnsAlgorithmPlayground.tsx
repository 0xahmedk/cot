import React, { useState } from "react";
import { Paper, Stack, Text, Button, Code } from "@mantine/core";

export function PnsAlgorithmPlayground() {
  const [showCode, setShowCode] = useState(false);

  const simpleSteps = [
    {
      title: "Check initial answer",
      desc: "Roll out the original chain-of-thought and verify the answer matches the ground truth.",
    },
    {
      title: "Iterate steps",
      desc: "For each reasoning step, create a few alternative versions and see what answers they lead to.",
    },
    {
      title: "Validate alternatives",
      desc: "Use a validation model to score the answers produced from alternatives.",
    },
    {
      title: "Compute PNS",
      desc: "Turn the validation scores into a single PNS value that estimates how important the original step is.",
    },
    {
      title: "Prune conservatively",
      desc: "If the PNS value is low (below threshold α), you can drop the step; otherwise keep it.",
    },
  ];

  const detailed = `Input: initial CoT S_init, ground truth y, query q, threshold α
Output: optimized CoT S_final
ŷ_init <- Rollout(S_init, q)
if ŷ_init == y then
  S_final <- []
  for each step s_t in S_init do
    generate alternatives s_t^(1..k)
    V_scores <- []
    for j <- 1..k do
      S_alt <- RolloutContinuation(S_{<t}, s_t^(j), B)
      add V(S_alt) to V_scores
    PNS_val <- 1 - average(V_scores)
    if PNS_val > α then
      append s_t to S_final
else
  S_final <- S_init
return S_final`;

  return (
    <Paper p="md" radius="md" style={{ border: "1px solid #373a40" }}>
      <Stack gap="sm">
        <Text fw={700}>PNS Simply Explained</Text>
        <Stack gap={6}>
          {simpleSteps.map((s) => (
            <div key={s.title}>
              <Text fw={600} size="sm">
                {s.title}
              </Text>
              <Text c="dimmed" size="sm">
                {s.desc}
              </Text>
            </div>
          ))}
        </Stack>

        <Button
          variant="subtle"
          size="xs"
          onClick={() => setShowCode((v) => !v)}
        >
          {showCode ? "Hide detailed pseudocode" : "Show detailed pseudocode"}
        </Button>

        {showCode && (
          <Code block style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>
            {detailed}
          </Code>
        )}
      </Stack>
    </Paper>
  );
}
