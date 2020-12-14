import yargs from "yargs";

yargs
	.scriptName("")
	.commandDir("commands", {
		visit: (commandModule) => commandModule.default,
		extensions: ["ts"],
	})
	.locale("en_US")
	.parserConfiguration({ "camel-case-expansion": false })
	.showHelpOnFail(false)
	.strict().argv;
