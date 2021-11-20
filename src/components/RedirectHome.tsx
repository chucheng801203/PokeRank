import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import PageDataContext from "../contexts/PageDataContext";
import { getDefaultState } from "../redux/store";

const RedirectHome: React.FC = () => {
    const pageData = useContext(PageDataContext);

    const defaultState = getDefaultState(pageData);

    return pageData.page_loading ? null : (
        <Redirect
            to={{
                pathname: "",
                search: "",
                state: {
                    rule: defaultState.rule[0],
                    season: defaultState.season[0],
                    searchText: "",
                },
            }}
        />
    );
};

export default RedirectHome;
