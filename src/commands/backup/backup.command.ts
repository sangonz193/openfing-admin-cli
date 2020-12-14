import { CommandModule } from "yargs";

import { appConfig } from "../../appConfig";
import { createGraphqlClient } from "../../createGraphqlClient";
import { backupDb } from "./backup.graphql";
import { BackupDbMutation, BackupDbMutationVariables } from "./backup.graphql.generated";

const command: CommandModule<{}, {}> = {
	command: "backup",

	describe: "Genera un backup y hace push al repositorio.",

	builder: (yargs) => yargs,

	handler: async () => {
		const client = createGraphqlClient();

		await client.mutate<BackupDbMutation, BackupDbMutationVariables>({
			mutation: backupDb,
			variables: {
				secret: appConfig.secret,
			},
		});

		console.log("backup exitoso.");
	},
};

export default command;
