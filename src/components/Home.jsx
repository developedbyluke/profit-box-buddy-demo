import { useEffect, useState } from "react";
import { db } from "../../firebase.config";
import { doc, onSnapshot } from "firebase/firestore";
import { getCurrentMonthYear, getPreviousMonthYear } from "../utils/dateUtils";
import AverageConversionChart from "./Home/AverageConversionChart";
import LeagueTablePreview from "./Home/LeagueTablePreview";
import Sentiment from "./Home/Sentiment";
import BestAndWorstCalls from "./Home/BestAndWorstCalls";
import SalesExecLeagueTablePreview from "./Home/SalesExecLeagueTablePreview";
import ScoreCardAverages from "./Home/ScoreCardAverages";
import EnquiryTypeChart from "./Home/EnquiryTypeChart";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { ChevronDownIcon } from "./ScoreCards/ChevronDownIcon";

const { currentMonth, currentYear } = getCurrentMonthYear();
const { previousMonth, previousYear } = getPreviousMonthYear();

function Home({ user, setUser, appType, config }) {
	const [focusedSites, setFocusedSites] = useState([]);
	const [bestCalls, setBestCalls] = useState([]);
	const [worstCalls, setWorstCalls] = useState([]);
	const [recentCalls, setRecentCalls] = useState([]);
	const [leagueTable, setLeagueTable] = useState([]);
	const [leagueTableLastMonth, setLeagueTableLastMonth] = useState([]);
	const [salesExecLeagueTable, setSalesExecLeagueTable] = useState([]);
	const [scoreCardAverages, setScoreCardAverages] = useState([]);

	const [scoreHistorySites, setScoreHistorySites] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const [selectedSite, setSelectedSite] = useState(user.site);

	useEffect(() => {
		setUser(prev => ({ ...prev, site: selectedSite }));
	}, [selectedSite]);

	useEffect(() => {
		setIsLoading(true);

		const docRef = doc(db, "cachedData", user.company.replace(/ /g, ""));
		const unsubscribe = onSnapshot(
			docRef,
			doc => {
				if (doc.exists()) {
					const data = doc.data();
					setData(data);
					setIsLoading(false);
				} else {
					console.warn("Document does not exist!");
					setIsLoading(false);
				}
			},
			error => {
				console.error("Error fetching document: ", error);
				setIsLoading(false);
			}
		);

		const featuredCallsDocRef = doc(
			db,
			appType === "video" ? "videoData_featuredVideos" : "data_featuredCalls",
			user.company.replace(/ /g, "")
		);
		const featuredCallsUnsubscribe = onSnapshot(
			featuredCallsDocRef,
			doc => {
				if (doc.exists()) {
					const data = doc.data();

					if (appType === "video") {
						setBestCalls(data.bestVideos);
						setRecentCalls(data.recentVideos);
						return;
					}

					setBestCalls(data[user.site.replace(" ", "")].bestCalls, appType);
					setRecentCalls(data[user.site.replace(" ", "")].recentCalls, appType);
				} else {
					console.warn("Document does not exist!");
				}
			},
			error => {
				console.error("Error fetching document: ", error);
			}
		);

		const scoreHistorySitesDocRef = doc(
			db,
			appType === "video" ? "videoData_scoreHistory" : "data_scoreHistory",
			user.company.replace(/ /g, "")
		);
		const scoreHistorySitesUnsubscribe = onSnapshot(
			scoreHistorySitesDocRef,
			doc => {
				if (doc.exists()) {
					const data = doc.data();
					setScoreHistorySitesData(data, appType);
				} else {
					console.warn("Document does not exist!");
				}
			},
			error => {
				console.error("Error fetching document: ", error);
			}
		);

		const leagueTablesDocRef = doc(
			db,
			appType === "video" ? "videoData_leagueTables" : "data_leagueTables",
			user.company
		);
		const leagueTablesUnsubscribe = onSnapshot(
			leagueTablesDocRef,
			doc => {
				if (doc.exists()) {
					const data = doc.data();
					setLeagueTablesData(data);
				} else {
					console.warn("Document does not exist!");
				}
			},
			error => {
				console.error("Error fetching document: ", error);
			}
		);

		const scoreCardAveragesRef = doc(
			db,
			appType === "video" ? "videoData_scoreCardAverages" : "data_scoreCardAverages",
			user.company
		);
		const scoreCardAveragesUnsubscribe = onSnapshot(
			scoreCardAveragesRef,
			doc => {
				if (doc.exists()) {
					const data = doc.data();
					setScoreCardAverages(data);
				} else {
					console.warn("Document does not exist!");
				}
			},
			error => {
				console.error("Error fetching document: ", error);
			}
		);

		return () => {
			unsubscribe();
			scoreHistorySitesUnsubscribe();
			leagueTablesUnsubscribe();
			scoreCardAveragesUnsubscribe();
			featuredCallsUnsubscribe();
		};
	}, [user.company, user.site, appType, selectedSite]);

	const setData = data => {
		setFocusedSites(user.focusedSites ? user.focusedSites : []);
	};

	const setScoreHistorySitesData = (data, appType) => {
		let groupScoreHistory = [];
		let sitesData = [];

		if (appType === "video") {
			sitesData = [...data.sites]; // Clone to avoid modifying the original data
		} else {
			sitesData = [...data.conversion.sites];
		}

		const averageTotalIndex = sitesData.findIndex(site => site.site === "Average Total");
		if (averageTotalIndex > -1) {
			sitesData[averageTotalIndex].site = "Group";
			groupScoreHistory = sitesData.splice(averageTotalIndex, 1);
		}

		let focusedScoreHistorySites = sitesData.filter(site => user.site === "Group" || site.site === user.site);

		if (appType === "video") {
			focusedScoreHistorySites = focusedScoreHistorySites.slice(0, 4);
		}

		setScoreHistorySites([...focusedScoreHistorySites, ...groupScoreHistory]);

		// if (appType === "video") {
		//     groupScoreHistory = data.sites.filter((site) => site.site === "Average Total");

		//     if (groupScoreHistory.length > 0) {
		//         groupScoreHistory[0].site = "Group";
		//     }

		//     setScoreHistorySites([...groupScoreHistory, data.sites[0], data.sites[1], data.sites[2], data.sites[3]]);
		//     return;
		// }

		// groupScoreHistory = data.conversion.sites.filter((site) => site.site === "Average Total");

		// if (groupScoreHistory.length > 0) {
		//     groupScoreHistory[0].site = "Group";
		// }

		// setScoreHistorySites(groupScoreHistory);

		// let focusedScoreHistorySites = data.conversion.sites
		//     ? data.conversion.sites.filter((site) => user.site === "Group" || site.site === user.site)
		//     : [];

		// console.log(focusedScoreHistorySites);

		// setScoreHistorySites((prev) => [...prev, ...focusedScoreHistorySites]);
	};

	const setLeagueTablesData = data => {
		const currentMonthYearStr = `${currentMonth}${currentYear}`;
		const previousMonthYearStr = `${previousMonth}${previousYear}`;

		if (user.company === "Demo") {
			const currentMonthSiteComparison = data["SiteComparison"]?.["December2023"] || [];
			updateAverageTotalRow(currentMonthSiteComparison);
			setLeagueTable(currentMonthSiteComparison);

			const previousMonthSiteComparison = data["SiteComparison"]?.["November2023"] || [];
			updateAverageTotalRow(previousMonthSiteComparison);
			setLeagueTableLastMonth(previousMonthSiteComparison);

			setSalesExecLeagueTable(data["Group"]?.["December2023"] || []);
			return;
		}

		const currentMonthSiteComparison =
			data["SiteComparison"]?.[currentMonthYearStr] ||
			data["SiteComparison"][currentMonthYearStr.replace(" ", "")] ||
			[];

		updateAverageTotalRow(currentMonthSiteComparison);
		setLeagueTable(currentMonthSiteComparison);

		const previousMonthSiteComparison = data["SiteComparison"]?.[previousMonthYearStr] || [];
		updateAverageTotalRow(previousMonthSiteComparison);
		setLeagueTableLastMonth(previousMonthSiteComparison);

		setSalesExecLeagueTable(data[user.site.replace(" ", "")]?.[currentMonthYearStr] || []);
	};

	const updateAverageTotalRow = leagueTableData => {
		leagueTableData.forEach(row => {
			if (row.rank === "Average Total") {
				row.rank = null;
				row.site = "Group Average";
			}
		});
	};

	return (
		<>
			{user.focusedSites && user.focusedSites.length > 1 ? (
				<Dropdown>
					<DropdownTrigger>
						<Button
							variant="light"
							size="sm"
							className="border max-w-fit bg-white mb-3"
							endContent={<ChevronDownIcon className="text-xs" />}
						>
							{selectedSite}
						</Button>
					</DropdownTrigger>
					<DropdownMenu
						aria-label="centre dropdown"
						itemClasses={{ title: "text-xs", wrapper: "hover:bg-red-500" }}
						color="secondary"
						items={
							user.level === "Director"
								? [
										{ key: "Group", label: "Group" },
										...user.focusedSites?.map(site => ({ key: site, label: site }))
								  ]
								: [...user.focusedSites?.map(site => ({ key: site, label: site }))]
						}
						selectedKeys={[selectedSite]}
						onAction={key => setSelectedSite(key)}
					>
						{item => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
					</DropdownMenu>
				</Dropdown>
			) : null}

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 h-full">
				<BestAndWorstCalls
					bestCalls={bestCalls}
					worstCalls={worstCalls}
					recentCalls={recentCalls}
					currentMonth={currentMonth}
					isLoading={isLoading}
					appType={appType}
					selectedSite={selectedSite}
					user={user}
					config={config}
				/>

				<AverageConversionChart
					scoreHistorySites={scoreHistorySites}
					currentYear={currentYear}
					isLoading={isLoading}
					user={user}
				/>

				<LeagueTablePreview
					leagueTable={leagueTable}
					focusedSites={focusedSites}
					currentMonth={currentMonth}
					isLoading={isLoading}
					setIsLoading={setIsLoading}
					user={user}
					config={config}
				/>

				<SalesExecLeagueTablePreview
					salesExecLeagueTable={salesExecLeagueTable}
					focusedSites={focusedSites}
					currentMonth={currentMonth}
					isLoading={isLoading}
					setIsLoading={setIsLoading}
					user={user}
					config={config}
					appType={appType}
				/>

				{appType === "phone" && config.companiesWithSentiment.includes(user.company.replace(/ /g, "")) ? (
					<Sentiment
						isLoading={isLoading}
						leagueTable={leagueTable}
						leagueTableLastMonth={leagueTableLastMonth}
						currentMonth={currentMonth}
						user={user}
					/>
				) : null}

				<ScoreCardAverages
					scoreCardAverages={scoreCardAverages}
					isLoading={isLoading}
					user={user}
					appType={appType}
					config={config}
				/>

				{config.companiesWithEnquiryType &&
				config.companiesWithEnquiryType.includes(user.company.replace(/ /g, "")) ? (
					<EnquiryTypeChart
						data={scoreCardAverages}
						isLoading={isLoading}
						user={user}
						currentMonth={currentMonth}
					/>
				) : null}
			</div>
		</>
	);
}

export default Home;
