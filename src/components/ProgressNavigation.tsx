import {
  Box,
  Text,
  Progress as MantineProgress,
  Stack,
  Group,
  Badge,
  ActionIcon,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { CheckCircle, Circle, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Section {
  id: string;
  title: string;
  subtitle: string;
}

const sections: Section[] = [
  {
    id: "section-1",
    title: "Section 1",
    subtitle: "Necessity and Sufficiency",
  },
  {
    id: "section-2",
    title: "Section B",
    subtitle: "Necessity vs. Sufficiency Game",
  },
  {
    id: "section-3",
    title: "Section 3",
    subtitle: "PNS Estimation & Algorithm",
  },
];

export function ProgressNavigation() {
  const [activeSection, setActiveSection] = useState<string>("section-1");
  const [progress, setProgress] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // Find which section is currently in view
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          setProgress(((i + 1) / sections.length) * 100);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Box
      style={{
        position: "fixed",
        top: 80,
        right: isMinimized ? -140 : 40,
        zIndex: 100,
        width: 280,
        transition: "right 0.3s ease",
      }}
      visibleFrom="lg"
      hiddenFrom="base"
    >
      {/* Minimize/Expand Button */}
      <ActionIcon
        variant="filled"
        size="lg"
        color="dark"
        style={{
          position: "absolute",
          left: -20,
          top: 13,
          borderRadius: "50%",
          border: "1px solid #373a40",
        }}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        {isMinimized ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </ActionIcon>

      <Box
        p="lg"
        style={{
          backgroundColor: "#1a1b1e",
          border: "1px solid #373a40",
          borderRadius: 12,
        }}
      >
        <AnimatePresence>
          {!isMinimized ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={600} c="dimmed">
                  YOUR JOURNEY
                </Text>
                <Badge variant="light" size="sm">
                  {Math.round(progress)}%
                </Badge>
              </Group>

              <MantineProgress
                value={progress}
                size="sm"
                mb="lg"
                color="teal"
              />

              <Stack gap="md">
                {sections.map((section, index) => {
                  const isActive = activeSection === section.id;
                  const isPassed =
                    sections.findIndex((s) => s.id === activeSection) > index;

                  return (
                    <motion.div
                      key={section.id}
                      whileHover={{ x: 4 }}
                      style={{ cursor: "pointer" }}
                      onClick={() => scrollToSection(section.id)}
                    >
                      <Group gap="sm" wrap="nowrap">
                        <Box style={{ flexShrink: 0 }}>
                          {isPassed ? (
                            <CheckCircle size={20} color="#12b886" />
                          ) : (
                            <Circle
                              size={20}
                              color={isActive ? "#228be6" : "#5c5f66"}
                              fill={isActive ? "#228be6" : "transparent"}
                            />
                          )}
                        </Box>
                        <Box style={{ flex: 1 }}>
                          <Text
                            size="xs"
                            fw={600}
                            c={isActive ? "blue" : isPassed ? "teal" : "dimmed"}
                          >
                            {section.title}
                          </Text>
                          <Text
                            size="xs"
                            c={isActive ? "white" : "dimmed"}
                            lineClamp={1}
                          >
                            {section.subtitle}
                          </Text>
                        </Box>
                      </Group>
                    </motion.div>
                  );
                })}
              </Stack>
            </motion.div>
          ) : (
            <Text size="sm" fw={600} c="dimmed">
              YOUR JOURNEY
            </Text>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
