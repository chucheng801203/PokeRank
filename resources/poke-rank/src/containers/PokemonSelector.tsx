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
import PrContext from "../PrContext";

type PokemonInputSelector = React.FC<{
    className?: string;
    SufixIconBtn?: React.ComponentType<any>;
    placeholder?: string;
}>;

const PokemonInputSelector: PokemonInputSelector = ({ ...props }) => {
    const prData = useContext(PrContext);

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
            {Object.keys(prData.pokemon).map((i) => {
                const index = parseInt(i);
                return (
                    <Option key={i} value={i} text={prData.pokemon[index]}>
                        <Link
                            style={{ color: "#d6d6d6", textDecoration: "none" }}
                            to={{
                                pathname: `/${i}/0`,
                                search: `?season=${season[0].value}&rule=${rule[0].value}`,
                                state: {
                                    rule: rule[0],
                                    season: season[0],
                                    searchText: prData.pokemon[index],
                                },
                            }}
                        >
                            <PmSelectListItem
                                pmAvatar={`/storage/pokemon_images/cap${i}_f0_s0.png`}
                                pmId={index}
                                pmName={prData.pokemon[index]}
                            />
                        </Link>
                    </Option>
                );
            })}
        </TextInputSelector>
    );
};

export default PokemonInputSelector;
