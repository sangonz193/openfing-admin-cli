import path from "path";
import { CommandModule } from "yargs";

import { fs } from "./fs";

export const getCommandsFromDir = async (commandsDirPath: string) => {
	const commands: Array<CommandModule<unknown, unknown>> = [];

	const commandsDirItems = await fs.readdir(commandsDirPath);
	await Promise.all(
		commandsDirItems.map(async (commandsDirItem) => {
			const commandsDirItemPath = path.resolve(commandsDirPath, commandsDirItem);

			if ((await fs.lstat(commandsDirItemPath)).isDirectory()) {
				const nestedDirItems = await fs.readdir(commandsDirItemPath);

				const commandFile = nestedDirItems.find((nestedDirItem) => !!nestedDirItem.match(/.command.(t|j)s$/));

				if (commandFile) commands.push(require(path.resolve(commandsDirItemPath, commandFile)).default);
			}
		})
	);

	return commands;
};
