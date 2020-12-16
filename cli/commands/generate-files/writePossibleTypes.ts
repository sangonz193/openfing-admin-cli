import axios from "axios";
import chalk from "chalk";
import path from "path";

import { hasProperty } from "../../../src/_utils/hasProperty";
import { isObject } from "../../../src/_utils/isObject";
import { fs } from "../../_utils/fs";
import { generateFilesConfig } from "./_utils/generateFilesConfig";

export const writePossibleTypes = async () => {
	const { graphqlEndpoint, generatedFolderPath } = generateFilesConfig;

	if (!graphqlEndpoint) {
		console.log(chalk.yellow("Can't connect to server. Skipping fragments request."));
		return;
	}

	const fragmentsResponse = await axios(graphqlEndpoint, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		data: {
			variables: {},
			query: `{__schema {types {kind,name,possibleTypes {name}}}}`,
		},
	});

	const fragmentsData = await fragmentsResponse.data;

	const isSuccessData = (
		value: unknown
	): value is {
		__schema: {
			types: Array<{
				kind: string;
				name: string;
				possibleTypes: Array<{
					name: string;
				}>;
			}>;
		};
	} => isObject(value) && hasProperty(value, "__schema");

	const responseData = fragmentsData?.data;
	if (isSuccessData(responseData)) {
		const possibleTypesMap: Record<string, string[]> = {};

		responseData.__schema.types.forEach((supertype) => {
			if (supertype.possibleTypes)
				possibleTypesMap[supertype.name] = supertype.possibleTypes.map((subtype) => subtype.name);
		});

		await fs.writeFile(
			path.resolve(generatedFolderPath, "remoteSchemaPossibleTypes.ts"),
			"export const possibleTypes = " + JSON.stringify(possibleTypesMap)
		);
	} else throw new Error(`Unexpected response ${JSON.stringify(responseData, undefined, 2)}`);
};
