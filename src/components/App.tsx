import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SeasonSelector from "../containers/SeasonSelector";
import RankTopList from "../containers/RankTopList";
import PmList from "./PmList";
import PmRowLoading from "./PmRowLoading";
import HistoryContainer from "../containers/HistoryContainer";
import GetRankData from "../containers/GetRankData";
import MobilePokemonSelector from "../containers/MobilePokemonSelector";
import PageDataContext from "../PageDataContext";
import { getDefaultState } from "../util";
import styles from "./app.module.scss";

const App: React.FC = () => {
    const pageData = useContext(PageDataContext);

    let unMatch: React.ReactNode;

    if (pageData.page_loading) {
        unMatch = (
            <PmList className={styles["pr-app-list"]}>
                {Array.apply(null, Array(10)).map((v, i) => (
                    <PmRowLoading key={i} />
                ))}
            </PmList>
        );
    } else {
        const defaultState = getDefaultState(pageData);

        unMatch = (
            <Redirect
                to={{
                    pathname: "",
                    state: {
                        rule: defaultState.rule[0],
                        season: defaultState.season[0],
                    },
                }}
            />
        );
    }

    return (
        <div className={styles["pr-app"]}>
            {!pageData.page_loading && <HistoryContainer />}
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
                    <Route path="*">{unMatch}</Route>
                </Switch>
            </div>
            <Footer />
        </div>
    );
};

export default App;
