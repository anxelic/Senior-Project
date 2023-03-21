import { createTheme } from '@mui/material/styles';
import { createContext, useState, useMemo } from "react";

//our custome colors, and different shades of it, use figma 
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
      //main (used for overall background of the site) is set to greyish?
      main: {
        100: "#fdfdfd",
        200: "#fbfbfb",
        300: "#f9f9f9",
        400: "#f7f7f7",
        500: "#f5f5f5",
        600: "#c4c4c4",
        700: "#939393",
        800: "#626262",
        900: "#313131"
    },
      main: {
        100: "#212529", 
      },
      yellow: {
        100: "#FCDB3A",
        200: "#FCDB3A",
      },
      red: {
        100: "#ED2024",
        200: "#ED2018",
      },
      blue: {
        100: "#233044",
      },
    }
    :
    //same colors under light mode, i.e main now is white to indicate light background 
    {
      main: {
        100: "#f5f5f5",
      },
      yellow: {
        100: "#FCDB3A",
        200: "#FCDB3A",
      },
      red: {
        100: "#ED2024",
        200: "#ED2018",
      },
      blue: {
        100: "#f5f5f5",
      }
    }),
});

//dark and white palates/themes using our colors defined above 
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
          // palette values for dark mode
          primary: {
            main: colors.main[100],
          },
          secondary: {
            main: '#d500f9',
          },
          info: {
            main: '#2196f3',
          },
          success: {
            main: '#6ec124',
          },
          background: {
            default: colors.main[100],
          },
        }
        : {
          // palette values for light mode
          primary: {
            main: colors.main[100],
          },
          secondary: {
            main: '#d500f9',
          },
          info: {
            main: '#2196f3',
          },
          success: {
            main: '#6ec124',
          },
          background: {
            default: colors.main[100],
          },
        }),
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => { },
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};