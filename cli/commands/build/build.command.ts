import { exec } from "child_process";
import path from "path";
import { CommandModule } from "yargs";

import { fs } from "../../../src/_utils/fs";
import { fsExists } from "../../../src/_utils/fsExists";
import { projectPath } from "../../../src/_utils/projectPath";

const command: CommandModule<{}, {}> = {
	command: "build" as const,

	describe: "Bundles the app to be deployed",

	builder: (yargs) => yargs,

	handler: async () => {
		const distPath = path.resolve(projectPath, "dist");

		if (await fsExists(distPath)) await fs.rmdir(distPath, { recursive: true });

		await new Promise((resolve, reject) => {
			const babelExec = path.resolve(projectPath, "node_modules", ".bin", "babel");
			const childProcess = exec(
				`${babelExec} src --out-dir dist --copy-files --extensions '.ts,.js'`,
				(error) => {
					if (error) reject(error);
					else resolve();
				}
			);

			childProcess.stdout?.pipe(process.stdout);
			childProcess.stderr?.pipe(process.stderr);
		});
	},
};

export default command;
