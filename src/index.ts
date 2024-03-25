import { resolve } from "path";
import { config } from "dotenv";
import SteamTotp from "steam-totp";
import SteamUser from "steam-user";

const user = new SteamUser({ language: "russian", autoRelogin: true });
config({ path: resolve(process.cwd(), ".env") });

const Games: Array<number> = [
	730, // CS2 | CS:GO
	1966720, // Lethal Company
	400040, // ShareX
	1905180, // OBS Studio
];

(async () => {
	user.logOn({
		accountName: process.env.ACCOUNT_NAME,
		password: process.env.PASSWORD,
		rememberPassword: true,
		twoFactorCode: process.env.SHARED_SECRET
			? SteamTotp.getAuthCode(process.env.SHARED_SECRET)
			: process.argv.slice(2)[0],
	});

	user.once("loggedOn", () => {
		console.log(`${process.env.ACCOUNT_NAME} logged on!`);

		user.setPersona(7); // Invisible
		user.on("error", (err) => console.error(err));
		user.on("disconnected", (result, msg) => console.error(`Disconnected : [EResult: ${result}]\n ${msg}`));
		user.gamesPlayed(Games);
	});
})();
