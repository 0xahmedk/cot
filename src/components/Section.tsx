import {
  Box,
  Container,
  Title,
  Text,
  Stack,
  Grid,
  Paper,
  Divider,
} from "@mantine/core";
import type { ReactNode } from "react";
import { Zap } from "lucide-react";

interface SectionProps {
  id: string;
  stage: string;
  title: string;
  subtitle: string;
  theory: ReactNode;
  playground: ReactNode;
  layout?: "horizontal" | "vertical";
}

/**
 * Section Component
 *
 * A responsive section with theory content on the left/top
 * and an interactive playground on the right/bottom.
 */
export function Section({
  id,
  stage,
  title,
  subtitle,
  theory,
  playground,
  layout = "horizontal",
}: SectionProps) {
  return (
    <Box
      id={id}
      component="section"
      py={80}
      style={{
        minHeight: "100vh",
        borderBottom: "1px solid #373a40",
      }}
    >
      <Container size="xl">
        <Stack gap="xl">
          {/* Section Header */}
          <Box>
            <Text size="sm" fw={600} c="dimmed" mb="xs" tt="uppercase">
              {stage}
            </Text>
            <Title
              order={2}
              mb="xs"
              style={{
                background: "linear-gradient(135deg, #228be6 0%, #12b886 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </Title>
            <Text size="lg" c="dimmed">
              {subtitle}
            </Text>
          </Box>

          {/* Content Grid: Theory + Playground */}
          {layout === "vertical" ? (
            <Stack gap="xl">
              {/* Theory Section */}
              <Paper
                p={{ base: "md", sm: "xl" }}
                radius="lg"
                style={{
                  backgroundColor: "#1a1b1e",
                  border: "1px solid #373a40",
                }}
              >
                <Stack gap="lg">
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Zap size={20} color="#228be6" />
                    <Text fw={600} size="lg">
                      Intuition
                    </Text>
                  </Box>
                  <Divider />
                  <Box>{theory}</Box>
                </Stack>
              </Paper>

              {/* Playground Section */}
              <Box>{playground}</Box>
            </Stack>
          ) : (
            <Grid gutter={{ base: "md", sm: "xl" }}>
              {/* Theory Section - Mobile-first: span 12 (full width), Desktop: span 6 */}
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Paper
                  p={{ base: "md", sm: "xl" }}
                  radius="lg"
                  style={{
                    backgroundColor: "#1a1b1e",
                    border: "1px solid #373a40",
                    height: "100%",
                  }}
                >
                  <Stack gap="lg">
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Zap size={20} color="#228be6" />
                      <Text fw={600} size="lg">
                        Intuition
                      </Text>
                    </Box>
                    <Divider />
                    <Box>{theory}</Box>
                  </Stack>
                </Paper>
              </Grid.Col>

              {/* Playground Section - Mobile-first: span 12 (full width), Desktop: span 6 */}
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Box
                  style={{
                    position: "sticky",
                    top: 100,
                  }}
                  visibleFrom="md"
                >
                  {playground}
                </Box>
                {/* Non-sticky on mobile */}
                <Box hiddenFrom="md">{playground}</Box>
              </Grid.Col>
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
