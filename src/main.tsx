import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store.ts";

import "./index.css";
import { MantineProvider } from "@mantine/core";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <MantineProvider
            theme={{ colorScheme: "dark" }}
            withGlobalStyles
            withNormalizeCSS
        >
            <Provider store={store}>
                <App />
            </Provider>
        </MantineProvider>
    </React.StrictMode>
);
