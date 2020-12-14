import path from "path";

import { projectPath } from "../../../_utils/projectPath";

const { API_CLIENT_URI } = process.env;

if (!API_CLIENT_URI) throw new Error(`API_CLIENT_URI is not defined`);

export const generateFilesConfig = {
	graphqlEndpoint: API_CLIENT_URI,
	generatedFolderPath: path.resolve(projectPath, "src", "generated"),
};
