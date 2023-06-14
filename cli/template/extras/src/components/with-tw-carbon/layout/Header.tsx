import { BrightnessContrast } from "@carbon/icons-react";
import {
  Header as CarbonHeader,
  HeaderName,
  HeaderGlobalAction,
  HeaderGlobalBar,
} from "@carbon/react";
import useTheme from "~/atoms/useTheme";

export default function Header() {
  const [theme, setTheme] = useTheme();

  return (
    <CarbonHeader aria-label="CEN [project-name]">
      <HeaderName href="/" prefix="CEN">
        [project-name]
      </HeaderName>
      <HeaderGlobalBar>
        <HeaderGlobalAction aria-label="Theme Switcher" tooltipAlignment="start">
          <BrightnessContrast
            size={20}
            onClick={() => {
              setTheme(theme === "g90" ? "white" : "g90");
            }}
          />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </CarbonHeader>
  );
}
