import { dangerousKeysOf } from "@sangonz193/utils/dangerousKeysOf";
import { formatISO, isValid, parse } from "date-fns";
import { identity } from "lodash";
import { CommandModule } from "yargs";
import * as yup from "yup";

import { appConfig } from "../../appConfig";
import { createGraphqlClient } from "../../createGraphqlClient";
import { updateCourseClass } from "./update-course-class.graphql";
import { UpdateCourseClassMutation, UpdateCourseClassMutationVariables } from "./update-course-class.graphql.generated";

type UpdateCourseClassArgs = {
	courseClassListCode: string;
	classNumber: number;
	newDate?: string;
	newClassNumber?: number;
	newName?: string;
	newVisibility?: "public" | "disabled";
};

const command: CommandModule<{}, UpdateCourseClassArgs> = {
	command: "update-course-class",

	aliases: "update-cc",

	describe: "Actualiza ciertos aspectos de una clase.",

	builder: async (yargs) =>
		yargs
			.option("courseClassListCode", {
				describe: "Código de la lista que contiene la clase a actualizar",
				type: "string",
				alias: "c",
				demandOption: true,
			})
			.option("classNumber", {
				describe: "Número actual de la clase a actualizar",
				type: "number",
				alias: "n",
				demandOption: true,
			})
			.option("newDate", {
				description: "Nueva fecha de publicación en formato dd-mm-aaaa",
				type: "string",
				alias: "d",
				demandOption: false,
			})
			.option("newClassNumber", {
				description: "Nuevo número para la clase a actualizar",
				type: "number",
				demandOption: false,
			})
			.option("newName", {
				description: "Nuevo nombre para la clase a actualizar",
				type: "string",
				demandOption: false,
			})
			.option("newVisibility", {
				description: "Nueva configuración de visibilidad para la clase a actualizar",
				choices: dangerousKeysOf(
					identity<Record<Required<UpdateCourseClassArgs>["newVisibility"], 0>>({
						disabled: 0,
						public: 0,
					})
				),
				demandOption: false,
			}),

	handler: async (args) => {
		const validatedData = await yup
			.object<UpdateCourseClassArgs>({
				courseClassListCode: yup.string().trim().required(),
				classNumber: yup.number().positive("Debe ser positivo").integer("Debe ser un numero entero").required(),
				newName: yup.string().min(1).max(200).notRequired(),
				newDate: yup.string().notRequired(),
				newClassNumber: yup.number().min(0).max(1000).notRequired(),
				newVisibility: yup.mixed<Required<UpdateCourseClassArgs>["newVisibility"]>().notRequired(),
			})
			.required()
			.validate(args);

		const client = createGraphqlClient();
		const parsedDate =
			validatedData.newDate === undefined ? undefined : parse(validatedData.newDate, "dd-MM-uuuu", new Date());

		if (parsedDate && !isValid(parsedDate)) {
			console.log(`El formato de la fecha no cumple con el formato dd-mm-aaaa`);
			return;
		}

		const visibility =
			validatedData.newVisibility &&
			identity<
				Record<
					Required<UpdateCourseClassArgs>["newVisibility"],
					UpdateCourseClassMutationVariables["input"]["visibility"]
				>
			>({
				public: "PUBLIC",
				disabled: "DISABLED",
			})[validatedData.newVisibility];

		const response = await client.mutate<UpdateCourseClassMutation, UpdateCourseClassMutationVariables>({
			mutation: updateCourseClass,
			variables: {
				ref: {
					byNumber: {
						courseClassList: {
							byCode: {
								code: validatedData.courseClassListCode,
							},
						},
						number: validatedData.classNumber,
					},
				},
				input: {
					publishedAt: parsedDate && formatISO(parsedDate),
					name: validatedData.newName,
					number: validatedData.newClassNumber,
					visibility,
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
				message += `Nombre: ${courseClass.name ?? ""}\n`;
				message += `Número: ${courseClass.number ?? ""}\n`;
				message += `Fecha de publicación: ${courseClass.publishedAt ?? ""}`;
			}
		}

		console.log(message);
	},
};

export default command;
