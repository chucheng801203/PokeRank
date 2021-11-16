import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "react-app-polyfill/ie11";
import "core-js/features/promise";
import "whatwg-fetch";
import "core-js/features/array/includes";
import "./global.scss";
import App from "./components/App";
import PageDataProvider from "./containers/PageDataProvider";
import store from "./redux/store";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <PageDataProvider>
                    <App />
                </PageDataProvider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
