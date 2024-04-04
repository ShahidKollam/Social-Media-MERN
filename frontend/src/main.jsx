import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/theme-utils";
import { ColorModeScript } from "@chakra-ui/color-mode";
import { mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

import "./index.css";

const styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("gray.100", "#101010")(props),
    },
  }),
};

const config = {
  initialColorMode: "dark",
  usesystemColorMode: true,
};

const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  },
};

const theme = extendTheme({ styles, config, colors });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />

          <App />
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
