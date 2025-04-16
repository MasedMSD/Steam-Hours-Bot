import { getAuthCode } from "steam-totp";
import SteamUser from "steam-user";

/**
 * @type {Array<number>}
 * @description Steam Game IDs
 *
 * @example [2881650, 1422450]
 */
import games from "./games.json" with { type: "json" };

const { ACCOUNT_NAME, PASSWORD, SHARED_SECRET } = process.env;
const user = new SteamUser({ language: "russian", autoRelogin: false, dataDirectory: null });
const twoFactorCode = SHARED_SECRET.length ? getAuthCode(SHARED_SECRET) : process.argv.slice(2)[0]?.toUpperCase();

user.logOn({ accountName: ACCOUNT_NAME, password: PASSWORD, twoFactorCode });

user.on("loggedOn", () => {
	console.log(`Logged into Steam as ${ACCOUNT_NAME} [${user.steamID?.getSteamID64()}]`);

	user.on("error", err => console.error(err));
	user.on("disconnected", (result, msg) => console.error(`Disconnected : [EResult: ${result}]\n ${msg}`));

	user.setPersona(7); // Invisible
	user.gamesPlayed(games);
});
