import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import toggleRule from "../redux/actions/rule";
import toggleSeason from "../redux/actions/season";
import PageDataContext, {
    PageDataType,
    defaultPageData,
} from "../PageDataContext";
import WikiDataContext, {
    WikiDataType,
    defaultWikiData,
} from "../WikiDataContext";
import { getDefaultState, getParameterByName } from "../util";
import "whatwg-fetch";

const getValue = (value: number, data: Array<{ value: number }>) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].value === value) {
            return [
                {
                    index: i,
                    value: data[i].value,
                },
            ];
        }
    }
};

const Portal: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const pr_url =
        "https://pokerank.s3.ap-northeast-1.amazonaws.com/pr_data.json";

    const dispatch = useDispatch();

    const [pageData, setPageData] = useState<PageDataType>();

    useEffect(() => {
        if (!pageData) {
            window
                .fetch(pr_url)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    let defaultState = getDefaultState(data);

                    const rule = getParameterByName("rule");
                    if (rule) {
                        const ruleValue = getValue(parseInt(rule), data.rules);
                        if (ruleValue) {
                            defaultState.rule = ruleValue;
                        }
                    }

                    const season = getParameterByName("season");
                    if (season) {
                        const seasonValue = getValue(
                            parseInt(season),
                            data.seasons
                        );
                        if (seasonValue) {
                            defaultState.season = seasonValue;
                        }
                    }

                    dispatch(toggleRule(defaultState.rule[0]));
                    dispatch(toggleSeason(defaultState.season[0]));

                    data.page_loading = false;
                    setPageData(data);
                })
                .catch((e) => {
                    alert("與伺服器連接失敗，請稍後在試。");
                    console.log(e);
                });
        }
    });

    const wiki_url =
        "https://pokerank.s3.ap-northeast-1.amazonaws.com/wiki_data.json";

    const [wikiData, setWikiData] = useState<WikiDataType>();

    useEffect(() => {
        if (!wikiData && pageData) {
            window
                .fetch(wiki_url)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    data.page_loading = false;
                    setWikiData(data);
                })
                .catch((e) => {
                    alert("與伺服器連接失敗，請稍後在試。");
                    console.log(e);
                });
        }
    });

    return (
        <PageDataContext.Provider value={pageData ? pageData : defaultPageData}>
            <WikiDataContext.Provider
                value={wikiData ? wikiData : defaultWikiData}
            >
                {children}
            </WikiDataContext.Provider>
        </PageDataContext.Provider>
    );
};

export default Portal;
