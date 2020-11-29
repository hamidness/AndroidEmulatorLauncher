import React, { useState, useEffect } from "react";
import { App, ParentAppContainer } from "./Home.style";
import { androidSdkExists } from "../../utils/AndroidSdkUtils";
import ManagePage from "../manage-page/ManagePage";
import InitSdkPage from "../init-sdk-page/InitSdkPage";
import { AppContextProvider } from "../../context/Context";
import LogPage from "../log-page/LogPage";
import { BrowserRouter, HashRouter, Route, Switch } from "react-router-dom";
import CreateAvdPage from "../create-avd-page/CreateAvdPage";

export default () => {
  const [sdkExists, setSdkExists] = useState(false);

  useEffect(() => {
    androidSdkExists().then(
      (result) => setSdkExists(result),
      () => setSdkExists(false)
    );
  }, []);

  const renderMainPage = () => {
    if (sdkExists) {
      return <ManagePage />;
    } else {
      return <InitSdkPage />;
    }
  };

  return (
    <App>
      <AppContextProvider>
        <ParentAppContainer>
          <BrowserRouter>
            <Switch>
              <Route path="/">
                <HashRouter>
                  <Switch>
                    <Route path="/new-avd">
                      <CreateAvdPage />
                    </Route>
                    <Route path="/log-report">
                      <LogPage />
                    </Route>
                    <Route path="/">{renderMainPage()}</Route>
                  </Switch>
                </HashRouter>
              </Route>
            </Switch>
          </BrowserRouter>
        </ParentAppContainer>
      </AppContextProvider>
    </App>
  );
};
