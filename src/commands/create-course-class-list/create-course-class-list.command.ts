import { dangerousKeysOf } from "@sangonz193/utils/dangerousKeysOf";
import { identity } from "lodash";
import { CommandModule } from "yargs";
import * as yup from "yup";

import { appConfig } from "../../appConfig";
import { createGraphqlClient } from "../../createGraphqlClient";
import { getCommonVisibility } from "../_utils/getCommonVisibility";
import { createCourseClassList } from "./create-course-class-list.graphql";
import {
	CreateCourseClassListMutation,
	CreateCourseClassListMutationVariables,
} from "./create-course-class-list.graphql.generated";

type CreateCourseClassListArgs = {
	courseCode: string;
	courseClassListCode: string;
	name: string;
	semester: number;
	year: number;
	visibility?: "hidden" | "public" | "disabled";
};

const command: CommandModule<{}, CreateCourseClassListArgs> = {
	command: "create-course-class-list",

	aliases: "create-ccl",

	describe: "Crea una lista de clases para un curso.",

	builder: async (yargs) =>
		yargs
			.option("courseCode", {
				describe: "Código del curso al cual asignar la nueva lista de clases",
				type: "string",
				alias: "cc",
				demandOption: true,
			})
			.option("courseClassListCode", {
				describe: "Nombre del curso a crear",
				type: "string",
				alias: "cclc",
				demandOption: true,
			})
			.option("name", {
				description: "Nombre de la lista de clases a crear",
				type: "string",
				alias: "n",
				demandOption: true,
			})
			.option("semester", {
				description: "Semestre al que pertenece la lista",
				type: "number",
				alias: "s",
				demandOption: true,
				choices: [1, 2] as const,
			})
			.option("year", {
				description: "Año al que pertenece la lista",
				type: "number",
				alias: "y",
				demandOption: true,
			})
			.option("visibility", {
				description: "Nueva configuración de visibilidad para la clase a actualizar",
				choices: dangerousKeysOf(
					identity<Record<Required<CreateCourseClassListArgs>["visibility"], 0>>({
						hidden: 0,
						disabled: 0,
						public: 0,
					})
				),
				demandOption: false,
			}),

	handler: async (args) => {
		const validatedData = await yup
			.object<CreateCourseClassListArgs>({
				courseCode: yup.string().min(1).max(20).required(),
				courseClassListCode: yup.string().min(1).max(20).required(),
				name: yup.string().min(1).max(300).required(),
				semester: yup.number().integer().min(1).max(2).required(),
				year: yup.number().integer().min(2000).max(2050).required(),
				visibility: yup.mixed<Required<CreateCourseClassListArgs>["visibility"]>().notRequired(),
			})
			.required()
			.validate(args);

		const apolloClient = createGraphqlClient();

		const response = await apolloClient.mutate<
			CreateCourseClassListMutation,
			CreateCourseClassListMutationVariables
		>({
			mutation: createCourseClassList,
			variables: {
				input: {
					courseCode: validatedData.courseCode,
					code: validatedData.courseClassListCode,
					name: validatedData.name,
					semester: validatedData.semester,
					year: validatedData.year,
					visibility: validatedData.visibility && getCommonVisibility(validatedData.visibility),
				},
				secret: appConfig.secret,
			},
		});

		const { createCourseClassList: createCourseClassListResponse } = response.data || {};

		let message = "Error inesperado.";
		switch (createCourseClassListResponse?.__typename) {
			case undefined: {
				break;
			}
			case "AuthenticationError": {
				message = "Error de autenticación.";
				break;
			}
			case "GenericError": {
				message = "Error al intentar crear la lista de clases.";
				break;
			}
			case "CreateCourseClassListPayload": {
				message = `Lista "${createCourseClassListResponse.courseClassList.name ?? ""}" creada con éxito`;
				break;
			}
		}

		console.log(message);
	},
};

export default command;
