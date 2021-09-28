import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import PmSelectListItem from "../components/PmSelectListItem";
import { TextInputSelector, Option } from "../components/SelectorComponent";
import { SelectValue } from "../components/SelectorComponent/DefaultSelector";
import searchTextAction from "../redux/actions/searchText";
import {
    getSeasonState,
    getRuleState,
    getSearchTextState,
} from "../redux/selectors";
import PageDataContext from "../PageDataContext";

const PokemonInputSelector: React.FC<{
    className?: string;
    SufixIconBtn?: React.ComponentType<any>;
    placeholder?: string;
}> = ({ ...props }) => {
    const pageData = useContext(PageDataContext);

    const dispatch = useDispatch();
    const season = useSelector(getSeasonState);
    const rule = useSelector(getRuleState);
    const searchText = useSelector(getSearchTextState);

    const history = useHistory();

    const onChangeHandler = (v: string) => {
        dispatch(searchTextAction(v));
    };

    const onSubmitHandler = (v: SelectValue) => {
        history.push(
            `/${v[0].value}/0?season=${season[0].value}&rule=${rule[0].value}`,
            {
                rule: rule[0],
                season: season[0],
                searchText: v[0].text,
            }
        );
    };

    return (
        <TextInputSelector
            onChange={onChangeHandler}
            onSubmit={onSubmitHandler}
            onSufixIconBtnClick={onSubmitHandler}
            value={searchText}
            {...props}
        >
            {Object.keys(pageData.pokemon).map((i) => {
                const index = parseInt(i);
                return (
                    <Option key={i} value={i} text={pageData.pokemon[index]}>
                        <Link
                            style={{ color: "#d6d6d6", textDecoration: "none" }}
                            to={{
                                pathname: `/${i}/0`,
                                search: `?season=${season[0].value}&rule=${rule[0].value}`,
                                state: {
                                    rule: rule[0],
                                    season: season[0],
                                    searchText: pageData.pokemon[index],
                                },
                            }}
                        >
                            <PmSelectListItem
                                pmAvatar={`https://pokerank.s3.ap-northeast-1.amazonaws.com/images/cap${i}_f0_s0.png`}
                                pmId={index}
                                pmName={pageData.pokemon[index]}
                            />
                        </Link>
                    </Option>
                );
            })}
        </TextInputSelector>
    );
};

export default PokemonInputSelector;
