import { dangerousKeysOf } from "@sangonz193/utils/dangerousKeysOf";
import { identity } from "lodash";
import { CommandModule } from "yargs";
import * as yup from "yup";

import { appConfig } from "../../appConfig";
import { createGraphqlClient } from "../../createGraphqlClient";
import { getCommonVisibility } from "../_utils/getCommonVisibility";
import { createCourse } from "./create-course.graphql";
import { CreateCourseMutation, CreateCourseMutationVariables } from "./create-course.graphql.generated";

type CreateCourseArgs = {
	code: string;
	name: string;
	eva?: string;
	visibility?: "hidden" | "public" | "disabled";
};

const command: CommandModule<{}, CreateCourseArgs> = {
	command: "create-course",

	describe: "Crea un nuevo curso.",

	builder: async (yargs) =>
		yargs
			.option("code", {
				describe: "Código del curso a crear",
				type: "string",
				alias: "c",
				demandOption: true,
			})
			.option("name", {
				describe: "Nombre del curso a crear",
				type: "string",
				alias: "n",
				demandOption: true,
			})
			.option("eva", {
				description: "Link al eva del curso",
				type: "string",
				alias: "e",
				demandOption: false,
			})
			.option("visibility", {
				description: "Nueva configuración de visibilidad para la clase a actualizar",
				choices: dangerousKeysOf(
					identity<Record<Required<CreateCourseArgs>["visibility"], 0>>({
						hidden: 0,
						disabled: 0,
						public: 0,
					})
				),
				demandOption: false,
			}),

	handler: async (args) => {
		const validatedData = await yup
			.object<CreateCourseArgs>({
				code: yup.string().min(1).max(20).required(),
				name: yup.string().min(1).max(300).required(),
				eva: yup.string().max(300).notRequired(),
				visibility: yup.mixed<Required<CreateCourseArgs>["visibility"]>().notRequired(),
			})
			.required()
			.validate(args);

		const apolloClient = createGraphqlClient();

		const response = await apolloClient.mutate<CreateCourseMutation, CreateCourseMutationVariables>({
			mutation: createCourse,
			variables: {
				input: {
					code: validatedData.code,
					name: validatedData.name,
					eva: validatedData.eva,
					visibility: validatedData.visibility && getCommonVisibility(validatedData.visibility),
				},
				secret: appConfig.secret,
			},
		});

		const { createCourse: createCourseResponse } = response.data || {};

		let message = "Error inesperado.";
		switch (createCourseResponse?.__typename) {
			case undefined: {
				break;
			}
			case "AuthenticationError": {
				message = "Error de autenticación.";
				break;
			}
			case "GenericError": {
				message = "Error al intentar crear el curso.";
				break;
			}
			case "CreateCoursePayload": {
				message = `Curso "${createCourseResponse.course.name}" creado con éxito\n`;
				message += `Código: ${createCourseResponse.course.code}`;
				break;
			}
		}

		console.log(message);
	},
};

export default command;
