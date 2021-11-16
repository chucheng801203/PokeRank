import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import toggleRule from "../redux/actions/rule";
import toggleSeason from "../redux/actions/season";
import PageDataContext, {
    PageDataType,
    defaultPageData,
} from "../contexts/PageDataContext";
import WikiDataContext, {
    WikiDataType,
    defaultWikiData,
} from "../contexts/WikiDataContext";
import { getParameterByName } from "../util";
import { getDefaultState } from "../redux/store";

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

const requestPageData = () => {
    const pr_url = `${process.env.REACT_APP_S3_HOST}/pr_data.json`;
    const wiki_url = `${process.env.REACT_APP_S3_HOST}/wiki_data.json`;

    return Promise.all([
        window.fetch(pr_url),
        window.fetch(wiki_url),
    ]).then(function (response) {
        return Promise.all([response[0].json(), response[1].json()]);
    });
};

const PageDataProvider: React.FC = ({ children }) => {
    const dispatch = useDispatch();

    const [pageData, setPageData] = useState<PageDataType>();
    const [wikiData, setWikiData] = useState<WikiDataType>();

    useEffect(() => {
        if (pageData) return;

        requestPageData()
            .then(function (data) {
                let defaultState = getDefaultState(data[0]);

                const rule = getParameterByName("rule");
                if (rule) {
                    const ruleValue = getValue(parseInt(rule), data[0].rules);
                    if (ruleValue) {
                        defaultState.rule = ruleValue;
                    }
                }

                const season = getParameterByName("season");
                if (season) {
                    const seasonValue = getValue(
                        parseInt(season),
                        data[0].seasons
                    );
                    if (seasonValue) {
                        defaultState.season = seasonValue;
                    }
                }

                dispatch(toggleRule(defaultState.rule[0]));
                dispatch(toggleSeason(defaultState.season[0]));

                data[0].page_loading = false;
                setPageData(data[0]);

                data[1].page_loading = false;
                setWikiData(data[1]);
            })
            .catch((e) => {
                alert("與伺服器連接失敗，請稍後在試。");
                console.log(e);
            });
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

export default PageDataProvider;
