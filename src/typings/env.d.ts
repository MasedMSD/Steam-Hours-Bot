declare type ConfigKey = "ACCOUNT_NAME" | "PASSWORD" | "SHARED_SECRET";

declare type EnvKeys = {
	[key in ConfigKey]: string;
};

declare namespace NodeJS {
	interface ProcessEnv extends EnvKeys {}
}
