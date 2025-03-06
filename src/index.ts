import SteamTOTP from "steam-totp";
import SteamUser from "steam-user";

/**
 * @type {Array<number>}
 * @description Steam Game IDs
 *
 * @example [2881650, 1422450]
 */
import games from "./games.json" with { type: "json" };

const user = new SteamUser({ language: "russian", autoRelogin: false, dataDirectory: null });

const accountName = process.env.ACCOUNT_NAME;
const password = process.env.PASSWORD;
const twoFactorCode = process.env.SHARED_SECRET.length
	? SteamTOTP.getAuthCode(process.env.SHARED_SECRET)
	: process.argv.slice(2)[0]?.toUpperCase();

user.logOn({ accountName, password, twoFactorCode });

user.on("loggedOn", () => {
	console.log(`Logged into Steam as ${process.env.ACCOUNT_NAME} [${user.steamID?.getSteamID64()}]`);

	user.on("error", err => console.error(err));
	user.on("disconnected", (result, msg) => console.error(`Disconnected : [EResult: ${result}]\n ${msg}`));

	user.setPersona(7); // Invisible
	user.gamesPlayed(games);
});
