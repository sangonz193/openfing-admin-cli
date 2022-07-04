import { exec } from "child_process";
import { ESLint } from "eslint";

import { fs } from "./fs";

export const writeFormattedFile = async (filePath: string, fileContent: string) => {
	const eslint = new ESLint({
		fix: true,
	});

	const lintResponse = (await eslint.lintText(fileContent))[0];

	if (lintResponse.errorCount > 0)
		console.error(`ESLint error found: ${JSON.stringify(lintResponse.messages[0], null, 2)}`);

	if (lintResponse.fixableErrorCount === 0) {
		await fs.writeFile(filePath, fileContent);

		await new Promise<void>((resolve, reject) =>
			exec(`eslint "${filePath}" --fix`, (err) => {
				if (err) reject(err);
				else resolve();
			})
		);
	} else await fs.writeFile(filePath, lintResponse.output || fileContent);
};
