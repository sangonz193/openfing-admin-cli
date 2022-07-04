import { executeCodegen } from "@graphql-codegen/cli";
import * as typescriptPlugin from "@graphql-codegen/typescript";
import * as typescriptOperationsPlugin from "@graphql-codegen/typescript-operations";
import * as typescriptReactApolloPlugin from "@graphql-codegen/typescript-react-apollo";
import path from "path";

import { fs } from "../../_utils/fs";
import { projectPath } from "../../_utils/projectPath";
import { generateFilesConfig } from "./_utils/generateFilesConfig";

export type WriteOperationFilesOptions = {
	remoteSchema: string;
};

export const writeOperationFiles = async (options: WriteOperationFilesOptions): Promise<void> => {
	const { remoteSchema } = options;
	const { generatedFolderPath } = generateFilesConfig;

	const typesFilePath = path.resolve(generatedFolderPath, "localSchema.types.ts");

	const graphqlFilesSources = [path.resolve(projectPath, "src", "**", "*.graphql.ts")];
	const codegenResult = await executeCodegen({
		schema: remoteSchema,
		pluginLoader: (name) => {
			if (name.endsWith("typescript")) return typescriptPlugin;
			if (name.endsWith("typescriptReactApollo")) return typescriptReactApolloPlugin;
			if (name.endsWith("typescriptOperations")) return typescriptOperationsPlugin;

			throw new Error(name + " not found");
		},
		generates: {
			[typesFilePath]: {
				plugins: [
					{
						typescript: {
							enumsAsTypes: true,
							nonOptionalTypename: true,
							scalars: {
								ISODate: "string",
								ISODateTime: "string",
							},
						},
					},
				],
			},
			[path.resolve(projectPath, "src")]: {
				preset: "near-operation-file",
				presetConfig: {
					extension: ".generated.ts",
					baseTypesPath: path.relative(path.resolve(projectPath, "src"), typesFilePath),
				},
				documents: graphqlFilesSources,
				plugins: [
					{
						typescriptOperations: {
							preResolveTypes: true,
							avoidOptionals: true,
							scalars: {
								ISODate: "string",
								ISODateTime: "string",
							},
						},
					},
					{
						typescriptReactApollo: {
							reactApolloVersion: 3,
							noNamespaces: true,
							withHooks: true,
							withHOC: false,
							withComponent: false,
							addDocBlocks: false,
							documentMode: "external",
							importDocumentNodeExternallyFrom: "near-operation-file",
						},
					},
				],
			},
		},
	});

	await Promise.all(
		codegenResult.map(async (i) => {
			await fs.writeFile(
				i.filename,
				i.content.includes("* as Types") && !i.content.match(/\bTypes\./)
					? i.content.replace(/import \* as Types.+\n(\n)?/, "")
					: i.content
			);
		})
	);
};
