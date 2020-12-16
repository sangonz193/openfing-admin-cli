import { CommandModule } from "yargs";
import * as yup from "yup";

import { appConfig } from "../../appConfig";
import { createGraphqlClient } from "../../createGraphqlClient";
import { createCourseClass } from "./create-course-class.graphql";
import { CreateCourseClassMutation, CreateCourseClassMutationVariables } from "./create-course-class.graphql.generated";

type CreateCourseClassArgs = {
	courseClassListCode: string;
	classNumber: number;
	classTitle?: string;
};

const command: CommandModule<{}, CreateCourseClassArgs> = {
	command: "create-course-class",

	aliases: "create-cc",

	describe: "Crea una nueva clase.",

	builder: async (yargs) =>
		yargs
			.option("courseClassListCode", {
				describe: "Código de la lista de clases en el que crear la clase",
				type: "string",
				alias: "c",
				demandOption: true,
			})
			.option("classNumber", {
				describe: "Número de la clase a crear",
				type: "number",
				alias: "n",
				demandOption: true,
			})
			.option("classTitle", {
				description: "Título de la clase",
				type: "string",
				alias: "t",
				demandOption: false,
			}),

	handler: async (args) => {
		const validatedData = await yup
			.object<CreateCourseClassArgs>({
				courseClassListCode: yup.string().trim().required(),
				classNumber: yup.number().positive("Debe ser positivo").integer("Debe ser un numero entero").required(),
				classTitle: yup.string().trim().notRequired(),
			})
			.required()
			.validate(args);

		const apolloClient = createGraphqlClient();

		const response = await apolloClient.mutate<CreateCourseClassMutation, CreateCourseClassMutationVariables>({
			mutation: createCourseClass,
			variables: {
				input: {
					courseClassListRef: {
						byCode: {
							code: validatedData.courseClassListCode,
						},
					},
					name: validatedData.classTitle ?? `Clase ${validatedData.classNumber}`,
					number: validatedData.classNumber,
				},
				secret: appConfig.secret,
			},
		});

		const { createCourseClass: createCourseClassResponse } = response.data || {};

		let message = "Error inesperado.";
		switch (createCourseClassResponse?.__typename) {
			case undefined: {
				break;
			}
			case "AuthenticationError": {
				message = "Error de autenticación.";
				break;
			}
			case "GenericError": {
				message = "Error al intentar crear la clase.";
				break;
			}
			case "CreateCourseClassPayload": {
				message = `Clase "${createCourseClassResponse.courseClass.name ?? ""}" creada con éxito\n`;
				message += `Código de la lista de clases: ${
					createCourseClassResponse.courseClass.courseClassList?.code ?? ""
				}\n`;
				message += `Número de clase: ${createCourseClassResponse.courseClass.number ?? ""}`;
				break;
			}
		}

		console.log(message);
	},
};

export default command;
