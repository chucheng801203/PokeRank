import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import App from "../components/App";
import toggleRule from "../redux/actions/rule";
import toggleSeason from "../redux/actions/season";
import PageDataContext, { PageDataType } from "../PageDataContext";
import { getDefaultState, getParameterByName } from "../util";
import 'whatwg-fetch'

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

const Portal: React.FC = () => {
    const url = "https://pokerank.s3.ap-northeast-1.amazonaws.com/pr_data.json";

    const dispatch = useDispatch();

    const [pageData, setPageData] = useState<PageDataType>();

    useEffect(() => {
        if (!pageData) {
            window.fetch(url)
            .then(function(response) {
              return response.json();
            })
            .then(function(data) {
                let defaultState = getDefaultState(data);
    
                const rule = getParameterByName("rule");
                if (rule) {
                    const ruleValue = getValue(
                        parseInt(rule),
                        data.rules
                    );
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

    return pageData ? (
        <PageDataContext.Provider value={pageData}>
            <App />
        </PageDataContext.Provider>
    ) : (
        <>
            <App />
        </>
    );
};

export default Portal;
