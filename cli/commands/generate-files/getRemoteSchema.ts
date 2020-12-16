import { CodeFileLoader } from "@graphql-tools/code-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { UrlLoader } from "@graphql-tools/url-loader";
import chalk from "chalk";
import { printSchema } from "graphql";
import path from "path";

import { fs } from "../../_utils/fs";
import { generateFilesConfig } from "./_utils/generateFilesConfig";

export const getRemoteSchema = async (): Promise<{
	remoteSchemaPath: string;
	remoteSchema: string;
	fetchedFromRemote: boolean;
}> => {
	const { graphqlEndpoint, generatedFolderPath } = generateFilesConfig;

	let fetchedFromRemote = true;

	const remoteSchemaPath = path.resolve(generatedFolderPath, "remoteSchema.graphql.ts");
	let remoteSchema: string | null = graphqlEndpoint
		? await loadSchema(graphqlEndpoint, { loaders: [new UrlLoader()] })
				.then((schema) => printSchema(schema))
				.catch(() => null)
		: null;

	if (!remoteSchema) {
		console.log(chalk.yellow("Could not connect to server. Skipping remote schema update."));
		remoteSchema = printSchema(await loadSchema(remoteSchemaPath, { loaders: [new CodeFileLoader()] }));
		fetchedFromRemote = false;
	} else
		await fs.writeFile(
			remoteSchemaPath,
			'import gql from "graphql-tag";\n\n' +
				"export const remoteSchema = gql`" +
				remoteSchema.replace(/`/g, "\\`") +
				"`"
		);

	return {
		remoteSchemaPath,
		remoteSchema,
		fetchedFromRemote,
	};
};
