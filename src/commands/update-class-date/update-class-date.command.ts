import { formatISO, isValid, parse } from "date-fns";
import { CommandModule } from "yargs";

import { appConfig } from "../../appConfig";
import { createGraphqlClient } from "../../createGraphqlClient";
import { updateCourseClass } from "./update-class-date.graphql";
import { UpdateCourseClassMutation, UpdateCourseClassMutationVariables } from "./update-class-date.graphql.generated";

type CreateVideoArgs = {
	courseClassListCode: string;
	classNumber: number;
	date: string;
	skipPopulateDb: boolean;
};

const command: CommandModule<{}, CreateVideoArgs> = {
	command: "update-class-date",

	describe: "Actualiza la fecha de publicación de una clase.",

	builder: async (yargs) =>
		yargs
			.option("courseClassListCode", {
				describe: "Código de la lista que contiene la clase a actualizar",
				type: "string",
				alias: "c",
				demandOption: true,
			})
			.option("classNumber", {
				describe: "Número de la clase a actualizar",
				type: "number",
				alias: "n",
				demandOption: true,
			})
			.option("date", {
				description: "Nueva fecha de publicación en formato dd-mm-aaaa",
				type: "string",
				alias: "d",
				demandOption: true,
			})
			.option("skipPopulateDb", {
				description: "Se saltea la llamada al script populateDB.js",
				type: "boolean",
				default: false,
				demandOption: false,
			}),

	handler: async (args) => {
		const client = createGraphqlClient();

		const parsedDate = parse(args.date, "dd-MM-uuuu", new Date());

		if (!isValid(parsedDate)) {
			console.log(`El formato de la fecha no cumple con el formato dd-mm-aaaa`);
			return;
		}

		const response = await client.mutate<UpdateCourseClassMutation, UpdateCourseClassMutationVariables>({
			mutation: updateCourseClass,
			variables: {
				ref: {
					byNumber: {
						courseClassList: {
							byCode: {
								code: args.courseClassListCode,
							},
						},
						number: args.classNumber,
					},
				},
				input: {
					publishedAt: formatISO(parsedDate, { representation: "date" }),
				},
				secret: appConfig.secret,
			},
		});

		const { updateCourseClass: updateCourseClassResponse } = response.data || {};

		let message = "Error inesperado.";
		switch (updateCourseClassResponse?.__typename) {
			case undefined: {
				break;
			}
			case "AuthenticationError": {
				message = "Error de autenticación.";
				break;
			}
			case "GenericError": {
				message = "No se pudo actualizar la clase.";
				break;
			}
			case "NotFoundError": {
				message = "No se encontró la clase.";
				break;
			}
			case "UpdateCourseClassPayload": {
				const { courseClass } = updateCourseClassResponse;

				message = `Clase ${courseClass.courseClassList?.code ?? ""} ${courseClass.number ?? ""} editada.\n`;
				message += `Fecha de publicación: ${courseClass.publishedAt ?? ""}`;
			}
		}

		console.log(message);
	},
};

export default command;
