import path from "path";

import { fs } from "../../_utils/fs";
import { projectPath } from "../../_utils/projectPath";
import { typeAsset } from "./typeAsset";

export const typeAssetsFilesToWatchGlob = ["svg", "png", "jpeg", "jpg", "ttf"].map((ext: string) =>
	path.resolve(projectPath, "src", "**", "*." + ext)
);

export const typeAssets = async () => {
	const srcPath = path.resolve(projectPath, path.join("src"));

	const handleFolder = async (folderPath: string) => {
		await Promise.all(
			(await fs.readdir(folderPath)).map(async (item) => {
				const itemPath = path.resolve(folderPath, item);

				if ((await fs.stat(itemPath)).isDirectory()) await handleFolder(itemPath);
				else await typeAsset(itemPath);
			})
		);
	};

	await handleFolder(srcPath);
};
