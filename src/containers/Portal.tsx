import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import App from "../components/App";
import toggleRule from "../redux/actions/rule";
import toggleSeason from "../redux/actions/season";
import PageDataContext, { PageDataType } from "../PageDataContext";
import { getDefaultState, getParameterByName } from "../util";

const Portal: React.FC = () => {
    const url = "https://pokerank.s3.ap-northeast-1.amazonaws.com/pr_data.json";

    const dispatch = useDispatch();

    const [pageData, setPageData] = useState<PageDataType>();

    useEffect(() => {
        if (!pageData) {
            import("axios").then((axios) => {
                axios.default
                    .get<PageDataType>(url)
                    .then(function (response) {
                        const { data } = response;

                        let defaultState = getDefaultState(data);

                        const rule = getParameterByName("rule");
                        if (rule) {
                            for (let i = 0; i < data.rules.length; i++) {
                                if (data.rules[i].value === parseInt(rule)) {
                                    defaultState.rule = [{
                                        index: i,
                                        value: data.rules[i].value,
                                    }];
                                    break;
                                }
                            }
                        }

                        const season = getParameterByName("season");
                        if (season) {
                            for (let i = 0; i < data.seasons.length; i++) {
                                if (data.seasons[i].value === parseInt(season)) {
                                    defaultState.season = [{
                                        index: i,
                                        value: data.seasons[i].value,
                                    }];
                                    break;
                                }
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
