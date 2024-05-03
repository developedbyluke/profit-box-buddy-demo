import { useState, useEffect } from "react";
import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Spinner,
	CircularProgress,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter
} from "@nextui-org/react";
import "../../styles/animation.scss";

function formatDateTime(dateTimeStr) {
	if (!dateTimeStr) return "";

	const [datePart, timePart] = dateTimeStr?.split(" @ ");
	const [day, month, year] = datePart?.split("/").map(num => parseInt(num, 10));

	const dateObj = new Date(2000 + year, month - 1, day);

	const formattedDate = dateObj.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric"
	});
	return `${formattedDate} at ${timePart}`;
}

const CustomModalEntry = ({ label, body }) => {
	return (
		<div className="flex flex-col">
			<span className="font-medium">{label}</span>
			<span className="text-xs">{body}</span>
		</div>
	);
};

function formatDate(date) {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const formattedToday = formatDate(today);
const formattedYesterday = formatDate(yesterday);

function BestAndWorstCalls({
	bestCalls,
	worstCalls,
	recentCalls,
	isLoading,
	currentMonth,
	appType,
	selectedSite,
	user,
	config
}) {
	const [isBestCallsModalOpen, setIsBestCallsModalOpen] = useState(false);
	const [isWorstCallsModalOpen, setIsWorstCallsModalOpen] = useState(false);
	const [isRecentCallsModalOpen, setIsRecentCallsModalOpen] = useState(false);
	const [bestCallIndex, setBestCallIndex] = useState(0);
	const [worstCallIndex, setWorstCallIndex] = useState(0);
	const [recentCallIndex, setRecentCallIndex] = useState(0);
	const [animateOut, setAnimateOut] = useState(false);

	useEffect(() => {
		if (selectedSite) {
			setBestCallIndex(0);
			setRecentCallIndex(0);
		}
	}, [selectedSite]);

	useEffect(() => {
		if (isNaN(bestCallIndex)) {
			setBestCallIndex(0);
		}
		if (isNaN(recentCallIndex)) {
			setRecentCallIndex(0);
		}
	}, [bestCallIndex, recentCallIndex]);

	const handleModalOpen = type => {
		if (type === "best") {
			setIsBestCallsModalOpen(true);
		}
		if (type === "worst") {
			setIsWorstCallsModalOpen(true);
		}
		if (type === "recent") {
			setIsRecentCallsModalOpen(true);
		}
	};

	const handleModalClose = type => {
		if (type === "best") {
			setIsBestCallsModalOpen(false);
		}
		if (type === "worst") {
			setIsWorstCallsModalOpen(false);
		}
		if (type === "recent") {
			setIsRecentCallsModalOpen(false);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (isBestCallsModalOpen || isWorstCallsModalOpen || isRecentCallsModalOpen) return;

			setAnimateOut(true);

			setTimeout(() => {
				setAnimateOut(false);
				setBestCallIndex(prevIndex => (prevIndex + 1) % bestCalls.length);
				if (recentCalls.length > 0) setRecentCallIndex(prevIndex => (prevIndex + 1) % recentCalls.length);
			}, 350);
		}, 4000);

		return () => clearInterval(interval);
	}, [bestCalls, isBestCallsModalOpen, isWorstCallsModalOpen, isRecentCallsModalOpen]);

	return (
		<>
			{appType === "phone" ? (
				<>
					<Modal size="2xl" isOpen={isBestCallsModalOpen} onClose={() => handleModalClose("best")}>
						<ModalContent>
							<ModalHeader className="flex flex-col">
								<span className="font-medium">{bestCalls[bestCallIndex]?.name}</span>
								<span className="uppercase text-[10px] tracking-wider font-normal text-neutral-500 leading-3">
									{bestCalls[bestCallIndex]?.sheetName.split("(")[1].replace(")", "")}
								</span>
							</ModalHeader>
							<ModalBody className="text-sm pb-6">
								<CustomModalEntry
									label="Date"
									body={formatDateTime(bestCalls[bestCallIndex]?.dateAndTime)}
								/>
								<CustomModalEntry label="Conversion" body={`${bestCalls[bestCallIndex]?.score}%`} />
								{config.companiesWithSentiment.includes(user.company) ? (
									<CustomModalEntry
										label="Sentiment"
										body={`${bestCalls[bestCallIndex]?.sentiment}`}
									/>
								) : null}
								<CustomModalEntry label="Comment" body={`${bestCalls[bestCallIndex]?.comment}`} />
							</ModalBody>
						</ModalContent>
					</Modal>

					<Modal size="2xl" isOpen={isRecentCallsModalOpen} onClose={() => handleModalClose("recent")}>
						<ModalContent>
							<ModalHeader className="flex flex-col">
								<span className="font-medium">{recentCalls[recentCallIndex]?.name}</span>
								<span className="uppercase text-[10px] tracking-wider font-normal text-neutral-500 leading-3">
									{recentCalls[recentCallIndex]?.sheetName.split("(")[1].replace(")", "")}
								</span>
							</ModalHeader>
							<ModalBody className="text-sm pb-6">
								<CustomModalEntry
									label="Date"
									body={formatDateTime(recentCalls[recentCallIndex]?.dateAndTime)}
								/>
								<CustomModalEntry label="Conversion" body={`${recentCalls[recentCallIndex]?.score}%`} />
								{config.companiesWithSentiment.includes(user.company) ? (
									<CustomModalEntry
										label="Sentiment"
										body={`${recentCalls[recentCallIndex]?.sentiment}`}
									/>
								) : null}
								<CustomModalEntry label="Comment" body={`${recentCalls[recentCallIndex]?.comment}`} />
							</ModalBody>
						</ModalContent>
					</Modal>
				</>
			) : (
				<>
					<Modal size="2xl" isOpen={isBestCallsModalOpen} onClose={() => handleModalClose("best")}>
						<ModalContent>
							<ModalHeader className="flex flex-col">
								<span className="font-medium">{bestCalls[bestCallIndex]?.name}</span>
								<span className="uppercase text-[10px] tracking-wider font-normal text-neutral-500 leading-3">
									{bestCalls[bestCallIndex]?.sheetName.split("(")[1].replace(")", "")}
								</span>
							</ModalHeader>
							<ModalBody className="text-sm pb-6">
								<CustomModalEntry label="Date" body={bestCalls[bestCallIndex]?.date} />
								<CustomModalEntry label="Conversion" body={`${bestCalls[bestCallIndex]?.score}%`} />
								<CustomModalEntry label="Comment" body={`${bestCalls[bestCallIndex]?.comment}`} />
							</ModalBody>
						</ModalContent>
					</Modal>

					<Modal size="2xl" isOpen={isRecentCallsModalOpen} onClose={() => handleModalClose("recent")}>
						<ModalContent>
							<ModalHeader className="flex flex-col">
								<span className="font-medium">{recentCalls[recentCallIndex]?.name}</span>
								<span className="uppercase text-[10px] tracking-wider font-normal text-neutral-500 leading-3">
									{recentCalls[recentCallIndex]?.sheetName.split("(")[1].replace(")", "")}
								</span>
							</ModalHeader>
							<ModalBody className="text-sm pb-6">
								<CustomModalEntry label="Date" body={recentCalls[recentCallIndex]?.date} />
								<CustomModalEntry label="Conversion" body={`${recentCalls[recentCallIndex]?.score}%`} />
								<CustomModalEntry label="Comment" body={`${recentCalls[recentCallIndex]?.comment}`} />
							</ModalBody>
						</ModalContent>
					</Modal>
				</>
			)}

			<div
				onClick={() => {
					if (bestCalls.length === 0) return;
					handleModalOpen("best");
				}}
			>
				<Card
					className={`shadow-inner border p-2 text-neutral-500 h-full min-h-[300px] ${
						bestCalls.length > 0 ? "cursor-pointer" : ""
					}`}
				>
					<CardHeader className="flex justify-between">
						<span className="text-black text-sm font-medium">
							{appType === "phone"
								? `Best Call${bestCalls?.length > 1 ? "s" : ""} of the Month`
								: "Best Videos of the Month"}
						</span>
						<span className="tracking-widest">
							{bestCalls?.length ? bestCallIndex + 1 : 0}/{bestCalls?.length || 0}
						</span>
					</CardHeader>
					{isLoading ? (
						<Spinner size="sm" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
					) : (
						<>
							<CardBody className={`flex justify-center items-center`}>
								<CircularProgress
									classNames={{
										svg: "w-36 h-36 2xl:w-44 2xl:h-44",
										value: "text-black text-2xl 2xl:text-3xl font-semibold select-none",
										indicator:
											bestCalls[bestCallIndex]?.score >= 80
												? "stroke-success"
												: bestCalls[bestCallIndex]?.score >= 50
												? "stroke-warning"
												: "stroke-primary"
									}}
									value={bestCalls?.length > 0 ? bestCalls[bestCallIndex]?.score : 0}
									showValueLabel
									aria-label="Best calls of the month"
								/>
							</CardBody>
							<CardFooter
								className={`flex flex-col ${
									animateOut && bestCalls.length > 1 ? "slide-out" : "slide-in"
								}`}
							>
								{bestCalls?.length > 0 ? (
									<>
										<span className="font-medium text-sm text-center text-black">
											{bestCalls[bestCallIndex]?.name}
										</span>
										<span className="uppercase text-[10px] tracking-wider">
											{bestCalls[bestCallIndex]?.sheetName.split("(")[1].replace(")", "")}
										</span>
									</>
								) : (
									<span className="text-neutral-400 text-[11px]">
										Please note the initial performance data for {currentMonth} will appear on or
										before the 4th {currentMonth}
									</span>
								)}
							</CardFooter>
						</>
					)}
				</Card>
			</div>

			<div
				onClick={() => {
					if (recentCalls.length === 0) return;
					handleModalOpen("recent");
				}}
			>
				<Card
					className={`shadow-inner border p-2 text-neutral-500 h-full min-h-[300px] ${
						recentCalls.length > 0 ? "cursor-pointer" : ""
					}`}
				>
					<CardHeader className="flex justify-between">
						<span className="text-black text-sm font-medium">
							{appType === "phone"
								? recentCalls?.length
									? recentCalls[0].dateScored === formattedToday
										? "Calls Evaluated Today"
										: recentCalls[0].dateScored === formattedYesterday
										? "Calls Evaluated Yesterday"
										: "Recent Calls"
									: "Recent Calls"
								: "Recent Videos"}
						</span>
						<span className="tracking-widest">
							{recentCalls?.length ? recentCallIndex + 1 : 0}/{recentCalls?.length || 0}
						</span>
					</CardHeader>
					{isLoading ? (
						<Spinner size="sm" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
					) : (
						<>
							<CardBody className={`flex justify-center items-center`}>
								{isLoading ? (
									<Spinner size="sm" />
								) : (
									<CircularProgress
										classNames={{
											svg: "w-36 h-36 2xl:w-44 2xl:h-44",
											value: "text-black text-2xl 2xl:text-3xl font-semibold select-none",
											indicator:
												recentCalls[recentCallIndex]?.score >= 80
													? "stroke-success"
													: recentCalls[recentCallIndex]?.score >= 50
													? "stroke-warning"
													: "stroke-primary"
										}}
										value={recentCalls?.length > 0 ? recentCalls[recentCallIndex]?.score : 0}
										showValueLabel
										aria-label="Worst calls of the month"
									/>
								)}
							</CardBody>
							<CardFooter
								className={`flex flex-col ${
									animateOut && recentCalls.length > 1 ? "slide-out" : "slide-in"
								}`}
							>
								{recentCalls?.length > 0 ? (
									<>
										<span className="font-medium text-sm text-center text-black">
											{recentCalls[recentCallIndex]?.name}
										</span>
										<span className="uppercase text-[10px] tracking-wider">
											{recentCalls[recentCallIndex]?.sheetName.split("(")[1].replace(")", "")}
										</span>
									</>
								) : (
									<span className="text-neutral-400 text-[11px]">
										Please note the initial performance data for {currentMonth} will appear on or
										before the 4th {currentMonth}
									</span>
								)}
							</CardFooter>
						</>
					)}
				</Card>
			</div>
		</>
	);
}

export default BestAndWorstCalls;
