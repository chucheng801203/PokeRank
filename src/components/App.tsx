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

const RankTopList = React.lazy(() => import('../containers/RankTopList'));
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
                <Switch>
                    <Route exact path="/">
                        <Suspense fallback={null}>
                            <RankTopList className={styles["app-list"]} />
                        </Suspense>
                    </Route>
                    <Route exact path="/mobile/search/">
                        <Suspense fallback={null}>
                            <MobilePokemonSelector />
                        </Suspense>
                    </Route>
                    <Route exact path="/:pmId/:formId/">
                        <Suspense fallback={null}>
                            <GetRankData />
                        </Suspense>
                    </Route>
                    <Route path="*">{unMatch}</Route>
                </Switch>
            </div>
            <Footer />
        </div>
    );
};

export default App;
