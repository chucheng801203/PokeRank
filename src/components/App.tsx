import React, { useContext, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./HeaderComponent/Header";
import Footer from "./Footer";
import TitleWithSeasonInfo from "./TitleWithSeasonInfo";
import SeasonSelector from "../containers/SeasonSelector";
import PmList from "./ListComponent/PmList";
import PmRowLoading from "./ListComponent/PmRowLoading";
import RedirectHome from "./RedirectHome";
import HistoryContainer from "../containers/HistoryContainer";
import PageDataContext from "../contexts/PageDataContext";
import styles from "./app.module.scss";

const GetRankTopList = React.lazy(() => import("../containers/GetRankTopList"));
const GetRankData = React.lazy(() => import("../containers/GetRankData"));
const GetActivePokemon = React.lazy(
    () => import("../containers/GetActivePokemon")
);
const MobilePokemonSelector = React.lazy(
    () => import("../containers/MobilePokemonSelector")
);

const App: React.FC = () => {
    const pageData = useContext(PageDataContext);

    return (
        <div className={styles["app"]}>
            <HistoryContainer />
            <Header />
            <div className="container">
                <div className={styles["app-season-selector"]}>
                    <SeasonSelector />
                </div>
                <Suspense fallback={<div className="center">Loading...</div>}>
                    <Switch>
                        <Route exact path="/">
                            <TitleWithSeasonInfo title="寶可夢排行榜" />
                            <GetRankTopList />
                        </Route>
                        <Route exact path="/mobile/search/">
                            <MobilePokemonSelector />
                        </Route>
                        <Route exact path="/active-pokemon/:pageNum">
                            <TitleWithSeasonInfo title="可使用的寶可夢" />
                            <GetActivePokemon />
                        </Route>
                        <Route exact path="/:pmId/:formId/">
                            <GetRankData />
                        </Route>
                        <Route path="*">
                            {pageData.page_loading ? (
                                <PmList className={styles["app-list"]}>
                                    {Array.apply(null, Array(10)).map(
                                        (v, i) => (
                                            <PmRowLoading key={i} />
                                        )
                                    )}
                                </PmList>
                            ) : (
                                <RedirectHome />
                            )}
                        </Route>
                    </Switch>
                </Suspense>
            </div>
            <Footer />
        </div>
    );
};

export default App;
