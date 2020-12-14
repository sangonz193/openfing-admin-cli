import dotenv from "dotenv";
import path from "path";
import * as yup from "yup";

import { projectPath } from "./_utils/projectPath";

dotenv.config({ path: path.resolve(projectPath, ".env") });

const envValues = yup
	.object({
		SECRET: yup.string().required(),
		API_CLIENT_URI: yup.string().required(),
	})
	.required()
	.validateSync(process.env);

export const appConfig = {
	apiUri: envValues.API_CLIENT_URI,
	secret: envValues.SECRET,
};
