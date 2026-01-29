import axios from "axios";

let cachedToken = null;
let tokenExpiresAt = 0;

export const getKrogerAccessToken = async () => {
	if (cachedToken && Date.now() < tokenExpiresAt) {
		return cachedToken;
	}

	const response = await axios.post(
		"https://api.kroger.com/v1/connect/oauth2/token",
		new URLSearchParams({
			grant_type: "client_credentials",
			scope: "product.compact",
		}),
		{
			headers: {
				Authorization:
					"Basic " +
					Buffer.from(
						`${process.env.KROGER_CLIENT_ID}:${process.env.KROGER_CLIENT_SECRET}`,
					).toString("base64"),
				"Content-Type": "application/x-www-form-urlencoded",
			},
		},
	);

	cachedToken = response.data.access_token;
	tokenExpiresAt = Date.now() + response.data.expires_in * 1000;

	console.log("New Kroger access token acquired");

	return cachedToken;
};
