import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    getKeyValue
} from "@nextui-org/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
    { key: "rank", label: "Rank" },
    { key: "name", label: "Name" },
    {
        key: "site",
        label: "Site",
        className: "hidden xl:table-cell text-center"
    },
    {
        key: "callsEvaluated",
        label: "Calls Evaluated",
        className: "hidden 2xl:table-cell text-center"
    },
    {
        key: "sentiment",
        label: "Sentiment",
        className: "hidden md:table-cell text-center"
    },
    {
        key: "conversion",
        label: "Conversion",
        className: "text-center"
    }
];

function SalesExecLeagueTablePreview({
    salesExecLeagueTable,
    focusedSites,
    currentMonth,
    isLoading,
    user,
    config,
    appType
}) {
    const navigate = useNavigate();

    const [isTopFadeVisible, setTopFadeVisible] = useState(false);
    const [isBottomFadeVisible, setBottomFadeVisible] = useState(true);
    const tableRef = useRef(null);

    const columns = config.columns.leagueTables[user.company].home2;

    useEffect(() => {
        if (!isLoading) {
            const tableElement = tableRef.current;

            const handleScroll = () => {
                if (!tableElement) return;
                const { scrollTop, scrollHeight, clientHeight } = tableElement;
                setTopFadeVisible(scrollTop > 0);
                setBottomFadeVisible(scrollTop < scrollHeight - clientHeight);
            };

            if (tableElement) {
                tableElement.addEventListener("scroll", handleScroll);
                handleScroll();

                return () => tableElement.removeEventListener("scroll", handleScroll);
            }
        }
    }, [isLoading]);

    return (
        <Card className="shadow-inner border p-2 text-neutral-500 md:col-span-2 relative min-h-[300px]">
            <CardHeader className="flex justify-between items-start">
                <div>
                    <span className="text-black text-sm font-medium block">
                        {appType === "phone" ? "Sales Team Member League Table" : "Video Technician League Table"}
                    </span>
                    <span className="uppercase text-[10px] tracking-wider">{user.site}</span>
                </div>
                {user.level === "Director" || user.level === "Manager" ? (
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
                ) : null}
            </CardHeader>
            <CardBody className="flex justify-center items-center">
                {isLoading ? (
                    <Spinner size="sm" />
                ) : (
                    <>
                        <div
                            className={`absolute inset-0 z-10 bg-gradient-to-t from-transparent from-[75%] to-white to-[90%] pointer-events-none ${
                                isTopFadeVisible ? "" : "hidden"
                            }`}
                        ></div>
                        <div
                            className={`absolute inset-0 z-10 bg-gradient-to-b from-transparent from-[75%] to-white to-[90%] pointer-events-none ${
                                isBottomFadeVisible ? "" : "hidden"
                            }`}
                        ></div>

                        <div
                            className="md:p-4 text-[11px] md:text-xs max-h-[237px] overflow-auto hide-scrollbar"
                            ref={tableRef}
                        >
                            <Table aria-label="Group league table" removeWrapper>
                                <TableHeader columns={columns}>
                                    {(column) => (
                                        <TableColumn
                                            key={column.key}
                                            className={`uppercase text-[9px] sm:text-[10px] tracking-wider text-center ${
                                                column.className || ""
                                            } ${
                                                column.key === "conversion" ||
                                                column.key === "sentiment" ||
                                                column.key === "rank"
                                                    ? "text-center"
                                                    : ""
                                            }
                                            ${user.site !== "Group" && column.key === "site" ? "!hidden" : ""}
                                            `}
                                        >
                                            {column.label}
                                        </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody
                                    items={salesExecLeagueTable.length > 0 ? salesExecLeagueTable : []}
                                    emptyContent={`Please note the initial performance data for ${currentMonth} will appear on or before the 4th ${currentMonth}`}
                                >
                                    {(item) => (
                                        <TableRow key={item.name}>
                                            {(columnKey) => (
                                                <TableCell
                                                    className={`text-xs text-center ${
                                                        columnKey === "conversion" ? "font-medium" : ""
                                                    }
                                                    
                                                    ${
                                                        columnKey === "conversion" &&
                                                        parseInt(getKeyValue(item, columnKey)) >= 80
                                                            ? "text-success"
                                                            : columnKey === "conversion" &&
                                                                parseInt(getKeyValue(item, columnKey)) >= 50
                                                              ? "text-warning"
                                                              : columnKey === "conversion"
                                                                ? "text-primary"
                                                                : ""
                                                    }
                                                
                                                    ${
                                                        columnKey === "conversion" ||
                                                        columnKey === "sentiment" ||
                                                        columnKey === "rank"
                                                            ? "text-center"
                                                            : ""
                                                    }
                                                    ${user.site !== "Group" && columnKey === "site" ? "!hidden" : ""}

                                                    ${
                                                        columns.find((column) => column.key === columnKey).className ||
                                                        ""
                                                    }
                                                    `}
                                                >
                                                    {getKeyValue(item, columnKey)}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </CardBody>
        </Card>
    );
}

export default SalesExecLeagueTablePreview;
