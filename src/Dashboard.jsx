import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Home from "./components/Home";
import SideMenu from "./components/SideMenu";
import Header from "./components/Header";
import PerformanceReviews from "./components/PerformanceReviews";
import PerformanceReviewForm from "./components/PerformanceReviews/PerformanceReviewForm";
import ScoreCards from "./components/ScoreCards";
import ScoreHistory from "./components/ScoreHistory";
import Resources from "./components/Resources";
import LeagueTables from "./components/LeagueTables";
import { isTokenValid, getUserDetails } from "./utils/auth";

import { Spinner } from "@nextui-org/react";
import AuditLog from "./components/AuditLog";
import Support from "./components/Support";
import VideoLibrary from "./components/VideoLibrary";
import { scoringConfig } from "./scoringConfig";
import Admin from "./components/Admin";
import MonthlyReports from "./components/MonthlyReports";

function Dashboard() {
	const navigate = useNavigate();
	const url = window.location.href;
	const { tab, reviewId } = useParams();
	const [appType, setAppType] = useState("");
	const activeTab = tab || (reviewId ? "performance-reviews" : "home");

	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState({});
	const [error, setError] = useState("");
	const [menuOpen, setMenuOpen] = useState(false);

	const logAccess = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.post(
				"https://europe-west2-sheets-system-95e8d.cloudfunctions.net/logAccess",
				{},
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			);
		} catch (error) {
			console.error("Error logging access:", error);
		}
	};

	useEffect(() => {
		const validateToken = async () => {
			const isValid = await isTokenValid();
			if (!isValid) {
				setIsLoading(false);
				navigate("/login");
			} else {
				if (isValid && !sessionStorage.getItem("loggedAccess")) {
					await logAccess();
					sessionStorage.setItem("loggedAccess", "true");
				}
				const user = await getUserDetails();
				if (!user) {
					setIsLoading(false);
					navigate("/login");
				}
				setUser(user);
				setAppType(user.company === "Demo" ? "video" : "phone");

				setIsLoading(false);
			}
			return true;
		};

		if (!url.includes("demo")) {
			validateToken();
		} else {
			setIsLoading(false);
			setUser({
				company: "Demo",
				email: "demo@email.com",
				focusedSites: ["Site A", "Site B", "Site C", "Site D"],
				level: "Director",
				name: "Demo",
				notificationsStatus: "read",
				role: "Director",
				site: "Group"
			});
			setAppType("video");
		}
	}, []);

	useEffect(() => {
		if (menuOpen) {
			document.body.classList.add("overflow-hidden");
		} else {
			document.body.classList.remove("overflow-hidden");
		}
		return () => {
			document.body.classList.remove("overflow-hidden");
		};
	}, [menuOpen]);

	return isLoading ? (
		<Spinner size="sm" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
	) : (
		<section id="dashboard-page" className="flex min-h-[100svh] w-full text-xs text-neutral-500">
			<SideMenu activeTab={activeTab} user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

			<div className="flex-grow flex flex-col p-3 md:p-8 relative overflow-hidden">
				<Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} setUser={setUser} />

				{activeTab === "home" ? (
					<Home
						error={error}
						user={user}
						setUser={setUser}
						menuOpen={menuOpen}
						setMenuOpen={setMenuOpen}
						appType={appType}
						config={scoringConfig[appType]}
					/>
				) : null}

				{activeTab === "admin" ? <Admin user={user} /> : null}

				{activeTab === "score-cards" ? (
					<ScoreCards user={user} config={scoringConfig[appType]} appType={appType} />
				) : null}

				{activeTab === "league-tables" ? (
					<LeagueTables user={user} config={scoringConfig[appType]} appType={appType} />
				) : null}

				{activeTab === "score-history" ? <ScoreHistory user={user} appType={appType} /> : null}

				{activeTab === "monthly-reports" ? <MonthlyReports user={user} /> : null}

				{activeTab === "performance-reviews" ? (
					reviewId ? (
						<PerformanceReviewForm reviewId={reviewId} user={user} />
					) : (
						<PerformanceReviews user={user} />
					)
				) : null}

				{activeTab === "resources" ? <Resources user={user} /> : null}

				{activeTab === "support" ? <Support user={user} /> : null}

				{activeTab === "video-tips" ? <VideoLibrary user={user} /> : null}

				{activeTab === "audit-log" ? <AuditLog user={user} /> : null}
			</div>
		</section>
	);
}

export default Dashboard;
