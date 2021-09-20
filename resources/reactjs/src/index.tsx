import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import PrContext, { PR_DATA } from "./PrContext";
import App from "./components/App";
import store from "./redux/store";

import "react-app-polyfill/ie11";
import "core-js/features/promise";
import "core-js/features/array/includes";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <PrContext.Provider value={PR_DATA}>
                    <App />
                </PrContext.Provider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);
