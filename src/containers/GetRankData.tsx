import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Redirect } from "react-router-dom";
import RankDataPage from "../components/RankDataPage";
import rankDataAction from "../redux/actions/rankData";
import {
    getRuleState,
    getSeasonState,
    getRankDataState,
} from "../redux/selectors";
import PageDataContext from "../contexts/PageDataContext";
import { getDefaultState } from "../redux/store";

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

    useEffect(() => {
        if (pageData.page_loading || !shouldLoading || !isValidPmId) return;

        dispatch(rankDataAction(pmIdNum));
        document.title = `No. ${pmIdNum} ${pageData.pokemon[pmIdNum]} - PokéRank`;
        window.scroll(0, 0);
    });

    if (pageData.page_loading) return <RankDataPage isLoading={true} />;

    const now = Date.now();

    const isValidPmId = /^\d+$/.test(pmId) && /^\d+$/.test(formId);

    const currentRankData = rankData[season[0].value as number];

    const shouldLoading =
        !currentRankData ||
        !currentRankData[pmIdNum] ||
        now > currentRankData[pmIdNum].expires;

    return (
        <>
            {!isValidPmId ? (
                <Redirect
                    to={{
                        pathname: "",
                        state: {
                            rule: getDefaultState(pageData).rule[0],
                            season: getDefaultState(pageData).season[0],
                            searchText: "",
                        },
                    }}
                />
            ) : (
                <>
                    <RankDataPage
                        isLoading={shouldLoading}
                        rankData={rankData}
                        season={season[0]}
                        rule={rule[0]}
                        pmId={pmIdNum}
                        formId={formIdNum}
                    />
                </>
            )}
        </>
    );
};

export default GetRankData;
