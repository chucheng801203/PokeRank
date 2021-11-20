import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import RankTopList from "../components/RankTopList";
import RankTopListLoading from "../components/RankTopListLoading";
import topListAction from "../redux/actions/topList";
import {
    getSeasonState,
    getRuleState,
    getTopListState,
} from "../redux/selectors";
import PageDataContext from "../contexts/PageDataContext";

const GetRankTopList: React.FC = () => {
    const { page_loading } = useContext(PageDataContext);
    const dispatch = useDispatch();
    const season = useSelector(getSeasonState);
    const rule = useSelector(getRuleState);
    const topLists = useSelector(getTopListState);

    useEffect(() => {
        if (!page_loading && shouldLoading) dispatch(topListAction);

        document.title = "寶可夢排行榜 - PokéRank";
    });

    if (page_loading) return <RankTopListLoading />;

    const now = Date.now();

    const currentList = topLists[`${season[0].value}_${rule[0].value}`];

    const shouldLoading = !currentList || now > currentList.expires;

    return (
        <>
            {shouldLoading ? (
                <RankTopListLoading />
            ) : (
                <RankTopList
                    topList={topLists}
                    season={season[0]}
                    rule={rule[0]}
                />
            )}
        </>
    );
};

export default GetRankTopList;
