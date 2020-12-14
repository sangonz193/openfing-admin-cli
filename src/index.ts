import path from "path";
import yargs from "yargs";

import { getCommandsFromDir } from "./_utils/getCommandsFromDir";

(async () => {
	const nestedCommands = await getCommandsFromDir(path.resolve(__dirname, "commands"));

	const _yargs = yargs.scriptName("openfing");
	nestedCommands.forEach((command) => _yargs.command(command));

	_yargs.locale("en_US").parserConfiguration({ "camel-case-expansion": false }).showHelpOnFail(false).strict().argv;
})();
