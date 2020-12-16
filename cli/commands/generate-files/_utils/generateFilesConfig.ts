import path from "path";

import { projectPath } from "../../../_utils/projectPath";

const { API_CLIENT_URI } = process.env;

export const generateFilesConfig = {
	graphqlEndpoint: API_CLIENT_URI,
	generatedFolderPath: path.resolve(projectPath, "src", "generated"),
};
