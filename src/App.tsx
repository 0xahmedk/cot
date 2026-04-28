import { useState } from "react";
import { Container, Text, Stack, Box, Alert } from "@mantine/core";
import { Info } from "lucide-react";

import "./App.css";
import { ProgressNavigation } from "./components/ProgressNavigation";
import { IntroductionSection } from "./components/IntroductionSection";
import { Section } from "./components/Section";
import { CotIntuitionPlayground } from "./components/playground/CotIntuitionPlayground";
import { NecessitySufficiencyGamePlayground } from "./components/playground/NecessitySufficiencyGamePlayground";
import { PnsAlgorithmPlayground } from "./components/playground/PnsAlgorithmPlayground";

function App() {
  const [showMobileWarning, setShowMobileWarning] = useState(true);

  return (
    <Box
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {showMobileWarning && (
        <Alert
          icon={<Info size={16} />}
          title="Desktop Recommended"
          color="blue"
          withCloseButton
          onClose={() => setShowMobileWarning(false)}
          hiddenFrom="sm"
          styles={{ root: { borderRadius: 0 } }}
        >
          For the best educational experience, please use the desktop version.
        </Alert>
      )}

      <Box component="main" style={{ flex: 1 }}>
        <ProgressNavigation />

        <IntroductionSection />

        <Section
          id="section-1"
          stage="Section 1"
          title="Necessity and Sufficiency"
          subtitle="From intuition to causal tests: what parts of reasoning truly matter?"
          theory={
            <Stack gap="md">
              <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }}>
                Now that we have the core intuition, we can formalize it. Think
                of a generated chain-of-thought as a set of reasoning fragments.
              </Text>
              <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }}>
                A fragment is <strong>necessary</strong> if removing it degrades
                the final answer. A fragment is <strong>sufficient</strong> if
                keeping it (and dropping the rest) still preserves the final
                answer.
              </Text>
              <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }}>
                This section will use interactive examples to test both
                directions and build intuition for causal attribution in
                reasoning traces.
              </Text>
            </Stack>
          }
          playground={<CotIntuitionPlayground />}
        />

        <Section
          id="section-2"
          stage="Section 2"
          title="Necessity vs. Sufficiency"
          subtitle="Intervene on reasoning steps and observe when the answer survives or breaks"
          theory={
            <Stack gap="md">
              <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }}>
                We use the paper's toy example: compute 99^2 + 99 + 1 = 9901.
                The interactive playground on the right exposes three reasoning
                fragments (steps) the model might produce.
              </Text>

              <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }}>
                Step 1 (identity): use the algebraic identity n^2 + n + 1 =
                n(n+1) + 1 to compute 99×100 = 9900, a short, direct path.
              </Text>

              <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }}>
                Step 2 (expansion): expand (100−1)^2 to compute 99^2 = 9801, a
                longer but valid arithmetic route. This is the path the paper
                highlights as an alternative derivation.
              </Text>

              <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }}>
                Step 3 (assembly): combine the computed subtotal with the
                remaining terms to produce the final numeric answer (9901).
                Crucially, Step 3 is the answer-producing step.
              </Text>

              <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }}>
                Why is Step 2 redundant here? Because the playground's evaluator
                treats Step 1 and Step 2 as two alternative computational paths
                to the same subtotal. If you keep Step 1 (identity) and Step 3
                (assembly), the answer is correct even when Step 2 is removed,
                demonstrating redundancy. If instead you remove Step 1 but keep
                Step 2+3, the answer is also preserved because Step 2 provides
                the computational path that Step 1 would have.
              </Text>

              <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }}>
                In causal terms: - A step is necessary if removing it (from the
                full trace) makes the final answer incorrect. - A set is
                sufficient if keeping only that set still yields the correct
                answer.
              </Text>

              <Text c="dimmed" size="sm" style={{ lineHeight: 1.7 }}>
                Use the toggles to remove or restore steps. Observe the
                "Necessity" badge for the focused step and the "Sufficiency"
                indicator for the active subset to build intuition about these
                causal notions.
              </Text>
            </Stack>
          }
          playground={<NecessitySufficiencyGamePlayground />}
        />

        <Section
          id="section-3"
          stage="Section 3"
          title="PNS Estimation & Algorithm"
          subtitle="How the paper finds sufficient and necessary CoT fragments"
          theory={
            <Stack gap="md">
              <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }}>
                The paper proposes an algorithm to estimate which steps in a
                chain-of-thought are "possibly necessary and sufficient" (PNS)
                for producing a correct answer. The algorithm inspects each
                step, generates alternative continuations, and uses a validation
                model to measure whether keeping that step is required to
                maintain correctness.
              </Text>

              <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }}>
                Key ingredients:
              </Text>
              <ul style={{ color: "#98a0a6", lineHeight: 1.7 }}>
                <li>
                  <strong>Rollout model (B):</strong> used to generate
                  continuations when testing alternatives.
                </li>
                <li>
                  <strong>Validation model (V):</strong> scores whether a
                  produced final answer matches the ground-truth.
                </li>
                <li>
                  <strong>Threshold α:</strong> controls how conservative the
                  algorithm is when labeling a step necessary.
                </li>
              </ul>

              <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }}>
                In plain terms, for each step s_t in the initial chain the
                algorithm:
              </Text>
              <ol style={{ color: "#98a0a6", lineHeight: 1.7 }}>
                <li>Generate alternative versions of s_t.</li>
                <li>Rollout continuations from each alternative using B.</li>
                <li>
                  Score the resulting answers with V to form a validation set.
                </li>
                <li>Compute a PNS score from these validation scores.</li>
                <li>If the PNS score &gt; α, keep s_t; otherwise drop it.</li>
              </ol>

              <Text c="dimmed" size="sm" style={{ lineHeight: 1.7 }}>
                The interactive panel on the right shows a minimal, easy-English
                walkthrough of the paper's algorithm; toggle to view the more
                detailed pseudocode if needed.
              </Text>

              <Text c="dimmed" size="sm" style={{ lineHeight: 1.7 }}>
                The algorithm is conservative: it only prunes steps when the
                validation-backed PNS score indicates the step is unlikely to be
                needed for correctness. This reconstruction produces a compact
                CoT that preserves answer accuracy while exposing which
                fragments are truly causally important.
              </Text>
            </Stack>
          }
          playground={<PnsAlgorithmPlayground />}
        />

        {/* Closing Thoughts Section */}
        {/* <Box
          style={{
            padding: "4rem 0",
            borderTop: "1px solid var(--mantine-color-dark-4)",
          }}
        >
          <Container size="md">
            <Paper
              p="xl"
              radius="lg"
              style={{
                backgroundColor: "#1a1b1e",
                border: "1px solid #373a40",
              }}
            >
              <Stack gap="lg">
                <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }}>
                  closing thoughts paragraph 1
                </Text>

                <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }}>
                  closing thoughts paragraph 2
                </Text>
              </Stack>
            </Paper>
          </Container>
        </Box> */}

        {/* Buy Me a Coffee Section */}
        {/* <Box
          style={{
            padding: "4rem 0",
            textAlign: "center",
            borderTop: "1px solid var(--mantine-color-dark-4)",
          }}
        >
          <Container size="sm">
            <Stack gap="md" align="center">
              <Text size="md" c="dimmed" maw={500} ta="center">
                If this interactive journey through [this blog post] ... buy me
                a coffee
              </Text>
              <a
                href="https://www.buymeacoffee.com/ahmedpro"
                target="_blank"
                rel="noopener noreferrer"
                className="coffee-btn"
              >
                ☕ Buy me a coffee
              </a>
            </Stack>
          </Container>
        </Box>*/}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        style={{
          borderTop: "1px solid var(--mantine-color-dark-4)",
          padding: "2rem 0",
        }}
      >
        <Container size="lg">
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* <Text size="sm" c="dimmed">
              Built with ❤️ by Ahmed
            </Text> */}
          </Box>

          {/* Social Icons
          <Stack gap="sm" align="center">
            <Text size="xs" c="dimmed">
              find Ahmed here 👇
            </Text>
            <Box
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <a
                href="https://github.com/0xahmedk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                style={{ color: "inherit", transition: "opacity 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 .297a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.58A12 12 0 0012 .297z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/0xahmedkhan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{ color: "inherit", transition: "opacity 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.49 6S0 4.88 0 3.5 1.12 1 2.49 1s2.49 1.12 2.49 2.5zM.22 8h4.54V24H.22zM8.98 8h4.36v2.2h.06c.61-1.16 2.1-2.4 4.33-2.4 4.63 0 5.48 3.05 5.48 7.02V24h-4.54v-7.07c0-1.69-.03-3.86-2.36-3.86-2.37 0-2.73 1.85-2.73 3.75V24H8.98V8z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/0xahmedk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: "inherit", transition: "opacity 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.5A4.5 4.5 0 1016.5 13 4.5 4.5 0 0012 8.5zm6.75-1.88a1.12 1.12 0 11-1.12-1.12 1.12 1.12 0 011.12 1.12z" />
                </svg>
              </a>
            </Box>
          </Stack> */}
        </Container>
      </Box>
    </Box>
  );
}

export default App;
