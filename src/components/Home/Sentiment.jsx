import { Card, CardBody, CardFooter, CardHeader, Spinner, Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Sentiment({ isLoading, leagueTable, currentMonth, leagueTableLastMonth, user }) {
    const navigate = useNavigate();

    const [averageSentimentPosition, setAverageSentimentPosition] = useState(50);
    const [siteSentimentPosition, setSiteSentimentPosition] = useState(50);
    const [lowestSentiment, setLowestSentiment] = useState(null);
    const [highestSentiment, setHighestSentiment] = useState(null);
    const [sitesWithHighestSentiment, setSitesWithHighestSentiment] = useState([]);
    const [sitesWithLowestSentiment, setSitesWithLowestSentiment] = useState([]);

    const calculatePosition = (sentiment, lowest, highest) => {
        const value = parseFloat(sentiment);
        const minValue = parseFloat(lowest);
        const maxValue = parseFloat(highest);

        let position = Math.round(((value - minValue) / (maxValue - minValue)) * 100);
        if (position < 13) position = 12.7;
        if (position > 87) position = 87.3;

        return position;
    };

    useEffect(() => {
        if (leagueTable.length > 0) {
            const sortedBySentiment = [...leagueTable].sort((a, b) => {
                const sentimentA = parseFloat(a.sentiment);
                const sentimentB = parseFloat(b.sentiment);
                return sentimentA - sentimentB;
            });

            setLowestSentiment(parseFloat(sortedBySentiment[0].sentiment).toFixed(1));
            setHighestSentiment(parseFloat(sortedBySentiment[sortedBySentiment.length - 1].sentiment).toFixed(1));

            const highestSentiment = parseFloat(leagueTable[0].sentiment).toFixed(1);
            const highestSentimentSites = leagueTable
                .filter((row) => parseFloat(row.sentiment) === highestSentiment)
                .map((row) => row.site);

            setSitesWithHighestSentiment(highestSentimentSites);

            const averageSentiment = leagueTable[leagueTable.length - 1]?.sentiment;
            setAverageSentimentPosition(calculatePosition(averageSentiment, lowestSentiment, highestSentiment));

            let userSiteSentiment;
            if (user.site !== "Group") {
                userSiteSentiment = leagueTable.find((item) => item.site === user.site)?.sentiment || 0;
                setSiteSentimentPosition(calculatePosition(userSiteSentiment, lowestSentiment, highestSentiment));
            }
        }
    }, [leagueTable, user.site]);

    useEffect(() => {
        if (lowestSentiment != null && leagueTable.length > 0) {
            calculatePosition(
                parseFloat(leagueTable[leagueTable.length - 1]?.sentiment),
                lowestSentiment,
                parseFloat(leagueTable[0]?.sentiment)
            );

            const lowestSentimentSites = leagueTable
                .filter((row) => parseFloat(row.sentiment) === lowestSentiment)
                .map((row) => row.site);

            setSitesWithLowestSentiment(lowestSentimentSites);
        }
    }, [lowestSentiment, leagueTable]);

    const averageSentiment =
        Array.isArray(leagueTable) && leagueTable.length > 0 ? leagueTable[leagueTable.length - 1]?.sentiment : null;
    const averageSentimentLastMonth =
        Array.isArray(leagueTableLastMonth) && leagueTable.length > 0
            ? leagueTableLastMonth[leagueTableLastMonth.length - 1]?.sentiment
            : null;

    const siteSentiment =
        user.site === "Group"
            ? null
            : Array.isArray(leagueTable) && leagueTable.length > 0
              ? leagueTable.find((item) => item.site === user.site)?.sentiment
                  ? parseFloat(leagueTable.find((item) => item.site === user.site).sentiment).toFixed(1)
                  : null
              : null;

    return (
        <Card className="shadow-inner border p-2 text-neutral-500 md:col-span-2 relative min-h-[300px]">
            <CardHeader className="flex justify-between items-start">
                <div>
                    <span className="text-black text-sm font-medium block">Sentiment</span>
                    <span className="uppercase text-[10px] tracking-wider">{user.site}</span>
                </div>
                <Button
                    className="flex items-center text-white bg-black transition-all absolute right-4 top-4"
                    isIconOnly
                    size="sm"
                    radius="full"
                    onPress={() => navigate("/league-tables")}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current icon icon-tabler icon-tabler-external-link"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        strokeWidth="1.75"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
                        <path d="M11 13l9 -9" />
                        <path d="M15 4h5v5" />
                    </svg>
                </Button>
            </CardHeader>
            {isLoading ? (
                <Spinner size="sm" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            ) : (
                <>
                    <CardBody className="flex justify-center items-center px-4 pt-0">
                        {leagueTable?.length ? (
                            <div className="w-3/4 max-w-[500px] h-[1.5px] bg-neutral-700 relative">
                                <div className="absolute -left-6 -top-6 w-12 h-12 flex justify-center items-center bg-white border-primary border-2 rounded-full">
                                    {/* <ul className="text-[11px] absolute -bottom-2 translate-y-full w-max font-medium text-center">
                                                            {sitesWithLowestSentiment.map(
                                                                (site, index) => {
                                                                    if (index < 5) {
                                                                        return (
                                                                            <li key={site}>{site}</li>
                                                                        );
                                                                    }
                                                                }
                                                            )}
                                                        </ul> */}
                                    <span className="text-black font-semibold">
                                        {isNaN(lowestSentiment) ? "" : lowestSentiment}
                                    </span>
                                    <svg
                                        className="absolute bottom-0 translate-y-full fill-primary"
                                        height="8"
                                        width="8"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z" />
                                    </svg>
                                    <span className="absolute -bottom-3 translate-y-full text-[11px] w-max text-center">
                                        Lowest sentiment
                                    </span>
                                </div>

                                <div
                                    className={`absolute left-1/2 -top-6 w-12 h-12 flex justify-center items-center bg-white border-neutral-300 border-2 rounded-full transition-all duration-1000 transform -translate-x-1/2`}
                                    style={{
                                        left: `${averageSentimentPosition}%`
                                    }}
                                >
                                    <span className="text-black font-semibold">{averageSentiment || ""}</span>
                                    <svg
                                        className="absolute top-0 -translate-y-full rotate-180 fill-neutral-300"
                                        height="8"
                                        width="8"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z" />
                                    </svg>
                                    <span className="absolute -top-3 -translate-y-full text-[11px] w-max text-center">
                                        Average sentiment
                                    </span>
                                </div>

                                {user.site === "Group" ? null : (
                                    <div
                                        className={`absolute left-1/2 -top-6 w-12 h-12 flex justify-center items-center bg-white border-black border-2 rounded-full transition-all duration-1000 transform -translate-x-1/2`}
                                        style={{
                                            left: `${siteSentimentPosition}%`
                                        }}
                                    >
                                        <span className="text-black font-semibold">{siteSentiment || ""}</span>
                                        {/* <svg
                                        className="absolute top-0 -translate-y-full rotate-180 fill-black"
                                        height="8"
                                        width="8"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z" />
                                    </svg> */}
                                        {/* <span className="absolute -top-3 -translate-y-full text-[11px] w-max text-center text-black">
                                        {user.site}
                                    </span> */}
                                    </div>
                                )}

                                <div className="absolute -right-6 -top-6 w-12 h-12 flex justify-center items-center bg-white border-success border-2 rounded-full">
                                    {/* <ul className="text-[11px] absolute -bottom-2 translate-y-full w-max font-medium text-center">
                                                            {sitesWithHighestSentiment.map(
                                                                (site, index) => {
                                                                    if (index < 5) {
                                                                        return (
                                                                            <li key={site}>{site}</li>
                                                                        );
                                                                    }
                                                                }
                                                            )}
                                                        </ul> */}
                                    <span className="text-black font-semibold">{leagueTable[0]?.sentiment || ""}</span>
                                    <svg
                                        className="absolute bottom-0 translate-y-full fill-success"
                                        height="8"
                                        width="8"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z" />
                                    </svg>
                                    <span className="absolute -bottom-3 translate-y-full text-[11px] w-max text-center">
                                        Highest sentiment
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <span className="max-w-[90%] text-neutral-400 text-center">
                                Please note the initial performance data for {currentMonth} will appear on or before the
                                4th {currentMonth}
                            </span>
                        )}
                    </CardBody>
                </>
            )}
            {leagueTable?.length ? (
                !averageSentiment || !averageSentimentLastMonth ? null : (
                    <CardFooter className="text-center">
                        <div className="w-full flex gap-0.5 justify-center">
                            <p>
                                Average sentiment is{" "}
                                {averageSentiment - averageSentimentLastMonth > 0
                                    ? "up"
                                    : averageSentiment === averageSentimentLastMonth
                                      ? "the same"
                                      : "down"}
                            </p>
                            {averageSentiment === averageSentimentLastMonth ? null : averageSentiment -
                                  averageSentimentLastMonth >
                              0 ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="stroke-success inline-block icon icon-tabler icon-tabler-trending-up"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.75"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M3 17l6 -6l4 4l8 -8" />
                                    <path d="M14 7l7 0l0 7" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="stroke-primary inline-block icon icon-tabler icon-tabler-trending-down"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.75"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M3 7l6 6l4 -4l8 8" />
                                    <path d="M21 10l0 7l-7 0" />
                                </svg>
                            )}

                            <p>
                                {averageSentiment !== averageSentimentLastMonth ? (
                                    <span
                                        className={`${
                                            averageSentiment - averageSentimentLastMonth > 0
                                                ? "text-success"
                                                : "text-primary"
                                        } font-medium`}
                                    >
                                        {Math.abs((averageSentiment - averageSentimentLastMonth).toFixed(2))}
                                    </span>
                                ) : null}{" "}
                                {averageSentiment === averageSentimentLastMonth ? "as" : "from"} last month.
                            </p>
                        </div>
                    </CardFooter>
                )
            ) : null}
        </Card>
    );
}

export default Sentiment;
