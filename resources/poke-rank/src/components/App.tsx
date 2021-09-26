import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SeasonSelector from "../containers/SeasonSelector";
import RankTopList from "../containers/RankTopList";
import HistoryContainer from "../containers/HistoryContainer";
import GetRankData from "../containers/GetRankData";
import MobilePokemonSelector from "../containers/MobilePokemonSelector";
import { defaultState } from "../redux/store";
import styles from "./index.module.scss";

const App: React.FC = () => (
    <div className={styles["pr-app"]}>
        <HistoryContainer />
        <Header />
        <div className="container">
            <div className={styles["pr-app-season-selector"]}>
                <SeasonSelector />
            </div>
            <Switch>
                <Route exact path="/">
                    <RankTopList className={styles["pr-app-list"]} />
                </Route>
                <Route exact path="/mobile/search/">
                    <MobilePokemonSelector />
                </Route>
                <Route exact path="/:pmId/:formId/">
                    <GetRankData />
                </Route>
                <Route path="*">
                    <Redirect
                        to={{
                            pathname: "",
                            state: {
                                rule: defaultState.rule[0],
                                season: defaultState.season[0],
                            },
                        }}
                    />
                </Route>
            </Switch>
        </div>
        <Footer />
    </div>
);

export default App;
