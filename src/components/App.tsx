import React, { useContext, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SeasonSelector from "../containers/SeasonSelector";
import PmList from "./PmList";
import PmRowLoading from "./PmRowLoading";
import HistoryContainer from "../containers/HistoryContainer";
import PageDataContext from "../contexts/PageDataContext";
import { getDefaultState } from "../redux/store";
import styles from "./app.module.scss";

const GetRankTopList = React.lazy(() => import('../containers/GetRankTopList'));
const GetRankData = React.lazy(() => import('../containers/GetRankData'));
const MobilePokemonSelector = React.lazy(() => import('../containers/MobilePokemonSelector'));

const App: React.FC = () => {
    const pageData = useContext(PageDataContext);

    let unMatch: React.ReactNode;

    if (pageData.page_loading) {
        unMatch = (
            <PmList className={styles["app-list"]}>
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
        <div className={styles["app"]}>
            {!pageData.page_loading && <HistoryContainer />}
            <Header />
            <div className="container">
                <div className={styles["app-season-selector"]}>
                    <SeasonSelector />
                </div>
                <Suspense fallback={<div className="center">Loading...</div>}>
                    <Switch>
                        <Route exact path="/">
                            <GetRankTopList className={styles["app-list"]} />
                        </Route>
                        <Route exact path="/mobile/search/">
                            <MobilePokemonSelector />
                        </Route>
                        <Route exact path="/:pmId/:formId/">
                            <GetRankData />
                        </Route>
                        <Route path="*">{unMatch}</Route>
                    </Switch>
                </Suspense>
            </div>
            <Footer />
        </div>
    );
};

export default App;
