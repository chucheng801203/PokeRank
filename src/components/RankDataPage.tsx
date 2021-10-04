import React from "react";
import PmList from "./PmList";
import PmInfoBlock from "./PmInfoBlock";
import PmRowLoading from "./PmRowLoading";
import PercentageRow from "./PercentageRow";

const RankDataPage: React.FC<{
    isLoading?: boolean;
    pmInfo?: React.ReactNode;
    teamPokemons?: React.ReactNode;
    move?: React.ReactNode;
    ability?: React.ReactNode;
    nature?: React.ReactNode;
    item?: React.ReactNode;
    winPokemons?: React.ReactNode;
    winMove?: React.ReactNode;
    losePokemons?: React.ReactNode;
    loseMove?: React.ReactNode;
}> = ({
    isLoading,
    pmInfo,
    teamPokemons,
    move,
    ability,
    nature,
    item,
    winPokemons,
    winMove,
    losePokemons,
    loseMove,
}) => (
    <>
        {isLoading ? <PmInfoBlock isLoading={true} /> : pmInfo}

        <div className="row">
            {(isLoading || (!isLoading && teamPokemons)) && (
                <div className="col-12 col-md-6 col-xl-4 mb-3">
                    <PmList listTitle="一起加入對戰隊伍的寶可夢TOP10">
                        {isLoading
                            ? Array.apply(null, Array(10)).map((v, i) => (
                                <PmRowLoading key={i} />
                            ))
                            : teamPokemons}
                    </PmList>
                </div>
            )}

            <div className="col-12 col-md-6 col-xl-8">
                <div className="row">
                    {(isLoading || (!isLoading && (move || nature))) && (
                        <div className="col-12 col-xl-6">
                            {isLoading ? (
                                <>
                                    <PmList
                                        className="mb-3"
                                        listTitle="招式"
                                    >
                                        {Array.apply(null, Array(10)).map(
                                            (v, i) => (
                                                <PercentageRow
                                                    key={i}
                                                    isLoading={true}
                                                />
                                            )
                                        )}
                                    </PmList>

                                    <PmList
                                        className="mb-3"
                                        listTitle="性格"
                                    >
                                        {Array.apply(null, Array(8)).map(
                                            (v, i) => (
                                                <PercentageRow
                                                    key={i}
                                                    isLoading={true}
                                                />
                                            )
                                        )}
                                    </PmList>
                                </>
                            ) : (
                                <>
                                    {move && (
                                        <PmList
                                            className="mb-3"
                                            listTitle="招式"
                                        >
                                            {move}
                                        </PmList>
                                    )}

                                    {nature && (
                                        <PmList
                                            className="mb-3"
                                            listTitle="性格"
                                        >
                                            {nature}
                                        </PmList>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {(isLoading || (!isLoading && (ability || item))) && (
                        <div className="col-12 col-xl-6">
                            {isLoading ? (
                                <>
                                    <PmList
                                        className="mb-3"
                                        listTitle="特性"
                                    >
                                        {Array.apply(null, Array(2)).map(
                                            (v, i) => (
                                                <PercentageRow
                                                    key={i}
                                                    isLoading={true}
                                                />
                                            )
                                        )}
                                    </PmList>
                                    <PmList
                                        className="mb-3"
                                        listTitle="道具"
                                    >
                                        {Array.apply(null, Array(10)).map(
                                            (v, i) => (
                                                <PercentageRow
                                                    key={i}
                                                    isLoading={true}
                                                />
                                            )
                                        )}
                                    </PmList>
                                </>
                            ) : (
                                <>
                                    {ability && (
                                        <PmList
                                            className="mb-3"
                                            listTitle="特性"
                                        >
                                            {ability}
                                        </PmList>
                                    )}

                                    {item && (
                                        <PmList
                                            className="mb-3"
                                            listTitle="道具"
                                        >
                                            {item}
                                        </PmList>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {(isLoading || winPokemons || winMove) && (
            <div className="mb-4" style={{ border: "1px solid #5e5e5e" }} />
        )}

        <div className="row">
            {(isLoading || winPokemons) && (
                <div className="col-12 col-md-6 mb-3">
                    <PmList listTitle="這隻寶可夢打倒的寶可夢TOP10">
                        {isLoading
                            ? Array.apply(null, Array(10)).map((v, i) => (
                                <PmRowLoading key={i} />
                            ))
                            : winPokemons}
                    </PmList>
                </div>
            )}

            {(isLoading || winMove) && (
                <div className="col-12 col-md-6 mb-3">
                    <PmList listTitle="這隻寶可夢打倒對手時使用的招式TOP10">
                        {isLoading
                            ? Array.apply(null, Array(10)).map((v, i) => (
                                <PercentageRow key={i} isLoading={true} />
                            ))
                            : winMove}
                    </PmList>
                </div>
            )}
        </div>

        {(isLoading || losePokemons || loseMove) && (
            <div className="mb-4" style={{ border: "1px solid #5e5e5e" }} />
        )}

        <div className="row">
            {(isLoading || losePokemons) && (
                <div className="col-12 col-md-6 mb-3">
                    <PmList listTitle="打倒這隻寶可夢的寶可夢TOP10">
                        {isLoading
                            ? Array.apply(null, Array(10)).map((v, i) => (
                                <PmRowLoading key={i} />
                            ))
                            : losePokemons}
                    </PmList>
                </div>
            )}

            {(isLoading || loseMove) && (
                <div className="col-12 col-md-6 mb-3">
                    <PmList listTitle="對手打倒這隻寶可夢時使用的招式TOP10">
                        {isLoading
                            ? Array.apply(null, Array(10)).map((v, i) => (
                                <PercentageRow key={i} isLoading={true} />
                            ))
                            : loseMove}
                    </PmList>
                </div>
            )}
        </div>
    </>
);

export default RankDataPage;
