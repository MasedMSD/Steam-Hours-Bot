import { config } from "dotenv";
import { resolve } from "path";
import SteamTotp from "steam-totp";
import SteamUser from "steam-user";

const user = new SteamUser({ language: "russian", autoRelogin: true });
config({ path: resolve(process.cwd(), ".env") });

/**
 * @type {Array<number>}
 * @description Steam Game IDs
 *
 * @example [2881650, 1422450]
 */
const games: Array<number> = require("./games.json");

(async () => {
	user.logOn({
		accountName: process.env.ACCOUNT_NAME,
		password: process.env.PASSWORD,
		rememberPassword: true,
		twoFactorCode: process.env.SHARED_SECRET
			? SteamTotp.getAuthCode(process.env.SHARED_SECRET)
			: process.argv.slice(2)[0]?.toUpperCase(),
	});

	user.once("loggedOn", () => {
		console.log(`${process.env.ACCOUNT_NAME} logged on!`);

		user.on("error", err => console.error(err));
		user.on("disconnected", (result, msg) => console.error(`Disconnected : [EResult: ${result}]\n ${msg}`));

		user.setPersona(7); // Invisible
		user.gamesPlayed(games);
	});
})();
