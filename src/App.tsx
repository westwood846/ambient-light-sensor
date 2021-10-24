import { ReactNode, useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";

function App() {
  const { lightLevel, error, isSupported } = useAmbientLightLevel();
  return (
    <AutoThemeProvider lightLevel={lightLevel}>
      <Container>
        <div>Current ambient light level:</div>
        <Level>{lightLevel === null ? "Unknown" : `${lightLevel} lux`}</Level>
        <code>{JSON.stringify({ error, isSupported })}</code>
        <Help>
          This is a demo for the <code>AmbientLightSensor</code> sensor API. Try
          looking at this page at different ambient light levels. Your device
          needs to have an ambient light sensor. Also not all browsers support
          this and those that do might require you to toggle a flag like{" "}
          <a href="chrome://flags/#enable-generic-sensor-extra-classes">
            <code>enable-generic-sensor-extra-classes</code>
          </a>{" "}
          first. See the{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/AmbientLightSensor#browser_compatibility">
            MDN
          </a>{" "}
          for more info.
        </Help>
      </Container>
    </AutoThemeProvider>
  );
}

const useAmbientLightLevel = () => {
  const [lightLevel, setLightLevel] = useState<number | null>(null);
  const [error, setError] = useState<any | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(function subToSensor() {
    if (!("AmbientLightSensor" in window)) {
      setIsSupported(false);
      return;
    }

    try {
      const sensor = new AmbientLightSensor();
      const onreading = () => setLightLevel(sensor.illuminance);
      const onerror = (event: { error: any }) => setError(event.error);

      sensor.onreading = onreading;
      sensor.onerror = onerror;

      sensor.start();

      setIsSupported(true);
    } catch (error) {
      setError(error);
    }
  }, []);

  return { lightLevel, error, isSupported } as const;
};

const AutoThemeProvider = ({
  lightLevel,
  children,
  ...props
}: {
  children: ReactNode;
  lightLevel: number | null;
}) => {
  const [themeName, setThemeName] = useState<ThemeName>("light");
  useEffect(
    function updateThemeWhenLightLevelChanges() {
      if (lightLevel === null) return;
      setThemeName(lightLevel > 100 ? "light" : "dark");
    },
    [lightLevel]
  );
  return (
    <ThemeProvider theme={themes[themeName]} {...props}>
      {children}
    </ThemeProvider>
  );
};

type ThemeName = "light" | "dark";

const themes: Record<ThemeName, Record<string, any>> = {
  light: { bg: "white", color: "black" },
  dark: { bg: "black", color: "white" },
};

const Container = styled.main`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  box-sizing: border-box;

  background: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.color};
`;

const Level = styled.h1`
  font-size: 92px;
  font-weight: bold;
  margin: 0;
`;

const Help = styled.p`
  max-width: 500px;
`;

export default App;
