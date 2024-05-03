import { Button, Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

const renderCustomisedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    const label = (percent * 100).toFixed(0);

    if (label === "0") {
        return null;
    }
    return (
        <text
            x={x}
            y={y}
            fill={index < 2 ? "#fff" : "#000"}
            fontWeight={600}
            fontSize={12}
            textAnchor={x > cx ? "middle" : "start"}
            dominantBaseline="central"
        >
            {`${label}%`}
        </text>
    );
};

const CustomLegend = ({ payload }) => {
    return (
        <ul className="list-none p-0 pr-8 mt-2 flex items-center justify-center">
            {payload.map((entry) => (
                <li key={entry?.value} className="flex items-center gap-1 mr-2">
                    <div>
                        <svg width={10} height={10}>
                            <circle cx="5" cy="5" r="3" fill={entry?.value === "Group" ? "#bbb" : entry?.color} />
                        </svg>
                    </div>
                    <span className={`text-[10px] font-medium`}>
                        {entry?.value === "N"
                            ? "New Car Enquiries"
                            : entry?.value === "U"
                              ? "Used Car Enquiries"
                              : entry?.value === "E"
                                ? "Either"
                                : ""}
                    </span>
                </li>
            ))}
        </ul>
    );
};

const colors = ["#003249", "#88B4C8", "#d6e4f1"];

export default function EnquiryTypeChart({ isLoading, user, data, currentMonth }) {
    const navigate = useNavigate();

    if (user.site === "Group") {
        data = data?.Group_enquiryTypeSplits;
    } else {
        data = data?.[`${user?.site?.replace(" ", "")}_enquiryTypeSplits`];
    }

    let chartData = [];
    const labelOrder = ["N", "U", "E"];
    if (data) {
        chartData = labelOrder.map((label) => ({
            name: label,
            value: data[label]
        }));
    }

    return (
        <Card className="shadow-inner border p-2 text-neutral-500 md:col-span-2 2xl:col-span-1 relative min-h-[350px] overflow-visible">
            <CardHeader className="flex justify-between items-start">
                <div>
                    <span className="text-black text-sm font-medium block">Enquiry Type</span>
                    <span className="uppercase text-[10px] tracking-wider">{user.site}</span>
                </div>
                <Button
                    className="flex items-center text-white bg-black transition-all absolute right-4 top-4"
                    isIconOnly
                    size="sm"
                    radius="full"
                    onPress={() => navigate("/score-cards")}
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
            <CardBody className="flex justify-center items-center scrollbar-hide overflow-visible">
                {isLoading ? (
                    <Spinner
                        size="sm"
                        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                ) : chartData[0].value === 0 && chartData[1].value === 0 && chartData[2].value === 0 ? (
                    <span className="text-neutral-400 text-[11px]">
                        Please note the initial performance data for {currentMonth} will appear on or before the 4th{" "}
                        {currentMonth}
                    </span>
                ) : (
                    <ResponsiveContainer width="100%" height="100%" className="max-w-[700px]" maxHeight={250}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={90}
                                labelLine={false}
                                label={renderCustomisedLabel}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${entry?.name}`} fill={colors[index]} />
                                ))}
                            </Pie>
                            <Legend verticalAlign="bottom" content={CustomLegend} wrapperStyle={{ left: 20 }} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardBody>
        </Card>
    );
}
