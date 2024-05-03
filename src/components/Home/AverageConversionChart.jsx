import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, Button, Spinner } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const demoData = [
    { name: "Jan", Group: 22.5, "Site A": 32, "Site B": 26, "Site C": 12, "Site D": 20 },
    { name: "Feb", Group: 30.0, "Site A": 44, "Site B": 32, "Site C": 20, "Site D": 24 },
    { name: "Mar", Group: 31.25, "Site A": 35, "Site B": 42, "Site C": 22, "Site D": 26 },
    { name: "Apr", Group: 39.5, "Site A": 52, "Site B": 44, "Site C": 26, "Site D": 36 },
    { name: "May", Group: 45.75, "Site A": 52, "Site B": 46, "Site C": 26, "Site D": 59 },
    { name: "Jun", Group: 51.0, "Site A": 58, "Site B": 50, "Site C": 28, "Site D": 68 },
    { name: "Jul", Group: 58.25, "Site A": 68, "Site B": 55, "Site C": 30, "Site D": 80 },
    { name: "Aug", Group: 55.5, "Site A": 64, "Site B": 55, "Site C": 25, "Site D": 78 },
    { name: "Sep", Group: 59.75, "Site A": 72, "Site B": 50, "Site C": 35, "Site D": 82 },
    { name: "Oct", Group: 63.25, "Site A": 72, "Site B": 57, "Site C": 40, "Site D": 84 },
    { name: "Nov", Group: 70.25, "Site A": 88, "Site B": 65, "Site C": 44, "Site D": 84 },
    { name: "Dec", Group: 75.0, "Site A": 92, "Site B": 72, "Site C": 52, "Site D": 84 }
];

const showAxisLines = false;
const showCartesianGrid = true;
const lineType = "linear";

const monthOrder = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12
};

const formatYAxisTick = (value) => {
    return `${value}%`;
};

const formatTooltipValue = (value) => {
    return `${value}%`;
};

const formatTooltipLabel = (value) => {
    switch (value) {
        case "Jan":
            return "January";
        case "Feb":
            return "February";
        case "Mar":
            return "March";
        case "Apr":
            return "April";
        case "May":
            return "May";
        case "Jun":
            return "June";
        case "Jul":
            return "July";
        case "Aug":
            return "August";
        case "Sep":
            return "September";
        case "Oct":
            return "October";
        case "Nov":
            return "November";
        case "Dec":
            return "December";
        default:
            return value;
    }
};

const CustomLegend = ({ payload }) => {
    return payload.length > 4 ? null : (
        <ul className="list-none p-0 mt-2 flex items-center justify-center">
            {payload.map((entry) => (
                <li key={entry.value} className="flex items-center gap-1 mr-2">
                    <div>
                        <svg width={10} height={10}>
                            <circle cx="5" cy="5" r="3" fill={entry.value === "Group" ? "#bbb" : entry.color} />
                        </svg>
                    </div>
                    <span className="text-[10px]">{entry.value}</span>
                </li>
            ))}
        </ul>
    );
};

const getCurrentYear = () => new Date().getFullYear().toString();

const colors = [
    "#000",
    "#1e1e1e",
    "#5b5e5e",
    "#6e5e6e",
    "#7a6b70",
    "#8a7b7e",
    "#8a8b8c",
    "#9a9b9a",
    "#aaa",
    "#b5b5bd",
    "#c5c5c5",
    "#d0d0d8",
    "#d0d0d8",
    "#d5d5d5"
];

const colors2 = ["#000", "#7a6b70", "#9a9b9a", "#c5c5c5", "#d0d0d8"];

function averageConversionChart({ scoreHistorySites, currentYear, isLoading, config, user }) {
    const navigate = useNavigate();

    const colorStep = useMemo(() => {
        const totalSites = scoreHistorySites.length;
        return Math.floor(colors.length / totalSites);
    }, [scoreHistorySites.length]);

    const getColorForSite = (siteName, index, totalSites) => {
        if (siteName === "Group") return "#bbb";

        if (totalSites <= 3) {
            return colors[index * colorStep];
        } else {
            return colors[(index % (colors.length - 1)) + 1];
        }
    };

    const chartData = useMemo(() => {
        const initData = [
            { name: "Jan", value: null },
            { name: "Feb", value: null },
            { name: "Mar", value: null },
            { name: "Apr", value: null },
            { name: "May", value: null },
            { name: "Jun", value: null },
            { name: "Jul", value: null },
            { name: "Aug", value: null },
            { name: "Sep", value: null },
            { name: "Oct", value: null },
            { name: "Nov", value: null },
            { name: "Dec", value: null }
        ];

        scoreHistorySites.forEach((site) => {
            Object.entries(site).forEach(([key, value]) => {
                const [month, year] = key.split(" ");

                if (year === (user.company === "Demo" ? "2023" : getCurrentYear()) && monthOrder[month]) {
                    const index = monthOrder[month] - 1;

                    if (!initData[index][site.site]) {
                        initData[index][site.site] = parseFloat(value.replace("%", ""));
                    }
                }
            });
        });

        return initData;
    }, [scoreHistorySites, user.company]);

    return (
        <Card className="shadow-inner border p-2 text-neutral-500 md:col-span-2 relative min-h-[300px] overflow-visible">
            <CardHeader className="flex justify-between items-start">
                <span className="text-black text-sm font-medium">
                    {user.company === "Demo" ? "2023" : currentYear} Average Conversion
                </span>
                {user.level === "Director" || user.level === "Manager" ? (
                    <Button
                        className="flex items-center text-white bg-black transition-all absolute right-4 top-4"
                        isIconOnly
                        size="sm"
                        radius="full"
                        onPress={() => navigate("/score-history")}
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
                ) : null}
            </CardHeader>
            <CardBody className="flex justify-center items-center scrollbar-hide overflow-visible">
                {isLoading ? (
                    <Spinner
                        size="sm"
                        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                ) : (
                    <ResponsiveContainer width="100%" height="100%" className="max-w-[700px]" maxHeight={250}>
                        <LineChart
                            data={user.company === "Demo" ? demoData : chartData}
                            // data={chartData}
                            margin={{ top: 10, right: 40, left: -15, bottom: 0 }}
                        >
                            {scoreHistorySites.map((site, index) => (
                                <Line
                                    key={site.site}
                                    type={lineType}
                                    dataKey={site.site}
                                    // stroke={`${
                                    //     user.company === "Demo"
                                    //         ? user.site !== "Group"
                                    //             ? site.site === user.site
                                    //                 ? "#000"
                                    //                 : "#bbb"
                                    //             : site.site === "Group"
                                    //               ? "#bbb"
                                    //               : colors2[index - 1]
                                    //         : site.site === "Group"
                                    //           ? "#bbb"
                                    //           : index > colors.length
                                    //             ? "#eee"
                                    //             : colors[index - 1]
                                    // }`}
                                    stroke={getColorForSite(site.site, index, scoreHistorySites.length)}
                                    name={site.site}
                                    strokeWidth={1.35}
                                    isAnimationActive={true}
                                />
                            ))}
                            <Legend verticalAlign="bottom" content={CustomLegend} wrapperStyle={{ left: 20 }} />
                            <Tooltip
                                formatter={formatTooltipValue}
                                labelFormatter={formatTooltipLabel}
                                contentStyle={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "5px"
                                }}
                                wrapperStyle={{
                                    zIndex: 9999
                                }}
                            />
                            {showCartesianGrid && (
                                <CartesianGrid stroke="#aaa" strokeDasharray="2 2" strokeOpacity={0.4} />
                            )}
                            <XAxis dataKey="name" axisLine={showAxisLines} tickLine={showAxisLines} tickMargin={7} />
                            <YAxis
                                axisLine={showAxisLines}
                                tickLine={showAxisLines}
                                tickFormatter={formatYAxisTick}
                                tickMargin={7}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardBody>
        </Card>
    );
}

export default averageConversionChart;
