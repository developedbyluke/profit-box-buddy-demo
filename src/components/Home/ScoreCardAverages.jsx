import { Card, CardBody, CardHeader, Divider, Spacer, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";

const phoneLabels = [
    {
        key: "welcoming",
        label: "Was the call answered by welcoming the customer to the Centre?"
    },
    {
        key: "verbalHandshake",
        label: "Was the verbal handshake used to take leadership of the call?"
    },
    {
        key: "previousContact",
        label: "Was the caller asked whether they had previously contacted Vantage?"
    },
    {
        key: "GDPR",
        label: "Was the GDPR FCN statement read to the caller?"
    },
    {
        key: "sourceOfEnquiry",
        label: "Was the source of enquiry established?"
    },
    {
        key: "telephoneNumber",
        label: "Was a telephone number obtained?"
    },
    {
        key: "triggeredInterest",
        label: "Did the Sales Executive establish what triggered the caller's interest in the model of interest?"
    },
    {
        key: "mainPurpose",
        label: "Did the Sales Executive establish what purpose the car will serve?"
    },
    {
        key: "offers",
        label: "Was the caller asked if they were aware of any of the current offers?"
    },
    {
        key: "warrantyOrApprovedUsed",
        label: "Did the Sales Executive mention the manufacturer warranty or Approved Used Car programme?"
    },
    {
        key: "partExchange",
        label: "Was it established whether a part exchange would be involved?"
    },
    {
        key: "invitedToLabelThemselves",
        label: "Was the caller invited to label themselves as a certain type of buyer?"
    },
    {
        key: "appointmentInvitation",
        label: "Was the caller invited to make an appointment?"
    },
    {
        key: "reservationFee",
        label: "Was the caller invited to leave a £99 reservation fee?"
    },
    {
        key: "clickAndCollect",
        label: "Was the caller made aware of the process associated with buying over the telephone?"
    },
    {
        key: "metRequirements",
        label: "Was the caller asked if the car met their requirements?"
    },
    {
        key: "invitedToPurchaseCar",
        label: "Was the caller invited to purchase the car (once they have identified themselves as a telephone buyer)?"
    },
    {
        key: "emailAddress",
        label: "Did the Sales Executive obtain an email address?"
    },
    {
        key: "additionalHelp",
        label: "Was the offer of additional help made at the end of the call?"
    },
    {
        key: "rapportBuilt",
        label: "Was rapport built around at least one topic?"
    }
];

const videoLabels = [
    { key: "raisedRamp", label: "Was the vehicle staged on a raised ramp?" },
    { key: "cleanArea", label: "If visible, was the area surrounding the vehicle clean and organised?" },
    { key: "bonnetOpen", label: "Was the bonnet open and upright?" },
    { key: "glovesWorn", label: "Did the technician wear gloves?" },
    {
        key: "protectiveItems",
        label: "Were protective items used on the vehicle e.g. bibs, seat covers, floor mats and/or steering wheel cover?"
    },
    { key: "suitableProps", label: "Did the technician use suitable props e.g. pointer, tyre depth gauge and chalk?" },
    { key: "introduceThemself", label: "Did the technician introduce themself?" },
    { key: "levelOfExperience", label: "Did the technician state their level of experience?" },
    { key: "customerNameUsed", label: "Did the technician use the customer's name in their introduction?" },
    {
        key: "customerAdvisorMention",
        label: "Did the technician mention the customer advisor who is managing the booking?"
    },
    {
        key: "correctEndOfVehicle",
        label: "Did the technician start at the end of the vehicle that was nearest to their first point of reference?"
    },
    { key: "augmentedReality", label: "Did the technician use the Augmented Reality (AR) function?" },
    {
        key: "evidenceTwoItems",
        label: "Did the technician evidence at least 2 items where applicable e.g. tyres and brakes?"
    },
    {
        key: "treadAndBrakePadPercentageConversion",
        label: "Where graded red/amber, did the technician convert tyre tread/brake pad depths into % worn?"
    },
    {
        key: "removeWheel",
        label: "Where brake condition was graded as red, did the technician remove at least one wheel to demonstrate brake condition with clarity?"
    },
    {
        key: "treadAndBrakePadAdditionalContext",
        label: "Where graded red/amber, did the technician provide additional context regarding brake/tyre wear e.g. starting point and legal limit?"
    },
    { key: "stateConsequence", label: "Did the technician state the consequence of any identified areas of repair?" },
    {
        key: "presentNewPartNextToOld",
        label: "Where graded red, did the technician present a new part next to a worn part e.g. brake pad/pollen filter?"
    },
    {
        key: "supportingDocuments",
        label: "Did the technician provide supporting documents (photographs of identified areas)?"
    },
    {
        key: "personalRecommendation",
        label: "Did the technician make one personal recommendation in respect of the required repairs?"
    },
    {
        key: "servicePlans",
        label: "Did the technician mention service plans during the video, they should mention this if a plan is not already in place?"
    },
    { key: "genuineParts", label: "Did the technician spark the (manufacturer) brand by mentioning genuine parts?" },
    {
        key: "nationalParts",
        label: "Did the technician spark the (manufacturer) brand by mentioning the national parts and labour warranty?"
    },
    {
        key: "pricePromise",
        label: "Did the technician spark the (manufacturer) brand by mentioning the price promise?"
    },
    { key: "nanoStatement", label: "Did the technician make a clear NANO statement at the end of the video?" },
    { key: "thankCustomer", label: "Did the technician thank the customer for choosing us?" }
];

const currentMonth = new Date().toLocaleString("en-us", { month: "long" });

function ScoreCardAverages({ scoreCardAverages, isLoading, user, appType, config }) {
    const [focusedSite, setFocusedSite] = useState(user?.site);

    const labels = appType === "video" ? videoLabels : phoneLabels;
    console.log(scoreCardAverages);

    const renderTopDevelopmentAreas = () => {
        if (scoreCardAverages && scoreCardAverages[`${user?.site.replace(" ", "")}`]) {
            const siteAverages = scoreCardAverages[`${user?.site.replace(" ", "")}`];

            if (!siteAverages || siteAverages.length === 0) {
                return (
                    <span className="text-neutral-400 text-[11px] block mx-auto">
                        Please note the initial performance data for {currentMonth} will appear on or before the 4th{" "}
                        {currentMonth}
                    </span>
                );
            }

            return siteAverages.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-2">
                    <span className="text-xs">{labels.find((label) => label.key === item.area).label}</span>
                    <div className="flex items-center">
                        <Divider orientation="vertical" className="h-6" />
                        <span
                            className={`text-sm font-semibold w-10 text-right ml-1
                                        ${
                                            item.averageScore >= 80
                                                ? "text-success"
                                                : item.averageScore >= 50
                                                  ? "text-warning"
                                                  : "text-primary"
                                        }
                                    `}
                        >
                            {item.averageScore}%
                        </span>
                    </div>
                </div>
            ));
        }

        return (
            <span className="text-neutral-400 text-[11px] block mx-auto">
                Please note the initial performance data for {currentMonth} will appear on or before the 4th{" "}
                {currentMonth}
            </span>
        );
    };

    return (
        <Card
            className={`shadow-inner border p-2 text-neutral-500 relative min-h-[300px] md:col-span-2 ${
                config?.companiesWithEnquiryType?.includes(user.company.replace(/ /g, ""))
                    ? "2xl:col-span-1"
                    : "2xl:col-span-2"
            }`}
        >
            <CardHeader>
                <div>
                    <span className="text-black text-sm font-medium block">Top 3 Development Areas</span>
                    <span className="uppercase text-[10px] tracking-wider">{user.site}</span>
                </div>
            </CardHeader>
            <CardBody className="flex justify-center">
                {isLoading || !scoreCardAverages || !user ? (
                    <Spinner size="sm" />
                ) : (
                    <div className="flex items-center justify-center">
                        <div className="space-y-3">{renderTopDevelopmentAreas()}</div>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}

export default ScoreCardAverages;
