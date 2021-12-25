import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import RankDataPage from "../components/RankDataPage";
import { fetchRankDataIfNeed } from "../redux/actions/rankData";
import {
    getRuleState,
    getSeasonState,
    getRankDataState,
} from "../redux/selectors";
import PageDataContext from "../contexts/PageDataContext";
import RedirectHome from "../components/RedirectHome";

const GetRankData: React.FC = () => {
    const { pmId, formId } = useParams<{
        pmId: string;
        formId: string;
    }>();
    const pageData = useContext(PageDataContext);
    const dispatch = useDispatch();
    const season = useSelector(getSeasonState);
    const rule = useSelector(getRuleState);
    const rankData = useSelector(getRankDataState);

    const pmIdNum = parseInt(pmId);
    const formIdNum = parseInt(formId);
    const isValidPmId = /^\d+$/.test(pmId) && /^\d+$/.test(formId);

    useEffect(() => {
        if (pageData.page_loading || !isValidPmId) return;

        dispatch(fetchRankDataIfNeed(pmIdNum));
    });

    useEffect(() => {
        document.title = `No. ${pmIdNum} ${pageData.pokemon[pmIdNum]} - PokéRank`;
        window.scroll(0, 0);
    });

    if (pageData.page_loading || !season || !rule)
        return <RankDataPage isLoading={true} />;

    const currentRankData = rankData[season.value as number];

    const isFetching =
        !currentRankData ||
        !currentRankData[pmIdNum] ||
        currentRankData[pmIdNum].isFetching;

    return (
        <>
            {!isValidPmId ? (
                <RedirectHome />
            ) : (
                <RankDataPage
                    isLoading={isFetching}
                    rankData={rankData}
                    season={season}
                    rule={rule}
                    pmId={pmIdNum}
                    formId={formIdNum}
                />
            )}
        </>
    );
};

export default GetRankData;
