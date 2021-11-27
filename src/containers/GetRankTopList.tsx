import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import RankTopList from "../components/RankTopList";
import RankTopListLoading from "../components/RankTopListLoading";
import { fetchTopListIfNeed } from "../redux/actions/topList";
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
    const topList = useSelector(getTopListState);

    useEffect(() => {
        if (!page_loading) dispatch(fetchTopListIfNeed());

        document.title = "寶可夢排行榜 - PokéRank";
    });

    if (page_loading) return <RankTopListLoading />;

    const currentList = topList[`${season[0].value}_${rule[0].value}`];

    const isFetching = !currentList || currentList.isFetching;

    return (
        <>
            {isFetching ? (
                <RankTopListLoading />
            ) : (
                <RankTopList
                    topList={topList}
                    season={season[0]}
                    rule={rule[0]}
                />
            )}
        </>
    );
};

export default GetRankTopList;
