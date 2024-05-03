import Logo from "/images/blacklogo.png";

import React, { useState, useEffect } from "react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import { Button, Input, Spinner } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { getUserDetails, isTokenValid } from "./utils/auth";

import OtpInput from "./components/OTPInput";

function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [isEmailSent, setIsEmailSent] = useState(false);
	const [validatingCode, setValidatingCode] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();

	const validateEmail = email => /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(email);

	useEffect(() => {
		async function validateToken() {
			const isValid = await isTokenValid();
			if (isValid) {
				const user = await getUserDetails();

				if (!user) {
					setIsLoading(false);
				} else {
					setIsLoading(false);
					navigate("/home");
				}
			} else {
				setIsLoading(false);
			}
		}

		validateToken();
	}, []);

	const handleLogin = async () => {
		if (email === "") {
			setError("Please enter an email address.");
			return;
		}

		if (!validateEmail(email)) {
			setError("Please enter a valid email address.");
			return;
		}

		setIsLoading(true);

		try {
			const response = await axios.get(
				"https://europe-west2-sheets-system-95e8d.cloudfunctions.net/checkEmailAuthorizationAndSendCode?email=" +
					email
			);

			if (response.status === 200) {
				setIsEmailSent(true);
				setIsLoading(false);
			}
		} catch (error) {
			console.error(error);
			setError(error.response.data);
			setIsLoading(false);
		}
	};

	const handleCodeValidation = async code => {
		setValidatingCode(true);

		try {
			const response = await axios.get(
				`https://europe-west2-sheets-system-95e8d.cloudfunctions.net/validateCode?email=${email}&code=${code}`
			);

			if (response.status === 200) {
				localStorage.setItem("token", response.data.token);
				setValidatingCode(false);
				setIsSuccess(true);
				setTimeout(() => {
					navigate("/home");
				}, 2000);
			} else {
				setError("Invalid or expired code.");
				setValidatingCode(false);
			}
		} catch (error) {
			console.error(error);
			setError(error.response?.data || "An error occurred while validating the code.");
			setValidatingCode(false);
		}
	};

	return isLoading ? (
		<Spinner size="sm" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
	) : (
		<section id="login-page" className="flex h-screen overflow-hidden text-xs text-neutral-500">
			<div className="flex h-full w-full items-center justify-center">
				<div className="relative w-[400px] max-w-[80%] space-y-5">
					<img
						src={Logo}
						className="absolute -top-24 left-1/2 mx-auto block w-48 -translate-x-1/2 transform"
					/>

					{!isEmailSent && !isSuccess && (
						<>
							<Input
								type="email"
								label="Email address"
								variant="underlined"
								radius="full"
								value={email}
								onValueChange={value => {
									setEmail(value);
									setError("");
								}}
								description="Please enter your email address above to log in to Profit Box Buddy."
								errorMessage={error}
							/>

							<Button
								type="submit"
								color="primary"
								className="h-[45px] w-full rounded-full font-regular"
								isLoading={isLoading}
								onClick={handleLogin}
							>
								{!isLoading && (
									<span className="flex items-center gap-2">
										Continue{" "}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-arrow-narrow-right"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											strokeWidth="1.1"
											stroke="#EEEEEE"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M5 12l14 0" />
											<path d="M15 16l4 -4" />
											<path d="M15 8l4 4" />
										</svg>
									</span>
								)}
							</Button>
						</>
					)}

					{isEmailSent && !validatingCode && !isSuccess && (
						<>
							<p>
								We have sent a one-time code to your email address. Please enter it below to continue.
							</p>

							<OtpInput handleCodeValidation={handleCodeValidation} />

							<Button
								color="primary"
								className="mx-auto block rounded-full"
								isLoading={isLoading}
								size="sm"
								variant="bordered"
							>
								{!isLoading && "Resend code"}
							</Button>
						</>
					)}

					{validatingCode && <Spinner size="sm" className="flex justify-center" />}

					{isSuccess && (
						<Player
							autoplay
							keepLastFrame
							src="https://lottie.host/ebac3021-9abb-43b2-ba72-6f66a170c9e9/20Gev0mviR.json"
							style={{ height: "32px", width: "32px" }}
						></Player>
					)}

					{!validatingCode && !isSuccess && (
						<a href="mailto:clientsupport@profitbox.co.uk" className="inline-block underline">
							Need help?
						</a>
					)}
				</div>
			</div>
		</section>
	);
}

export default App;
