import { fs } from "../../_utils/fs";

export const typeAsset = async (assetPath: string) => {
	const assetModuleFilePath = assetPath + ".d.ts";

	const constName = assetPath.endsWith(".svg")
		? "svgPath"
		: [".png", ".jpeg", ".jpg"].some((e) => assetPath.endsWith(e))
		? "imagePath"
		: assetPath.endsWith(".ttf")
		? "fontPath"
		: undefined;

	if (constName)
		await fs.writeFile(
			assetModuleFilePath,
			`declare const ${constName}: string;\n` + `export default ${constName};\n`
		);
};
