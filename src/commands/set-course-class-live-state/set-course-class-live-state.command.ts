import { isValid, parse } from "date-fns";
import { CommandModule } from "yargs";
import * as yup from "yup";

import { appConfig } from "../../appConfig";
import { createGraphqlClient } from "../../createGraphqlClient";
import { SetCourseClassLiveStateDataInput } from "../../generated/localSchema.types";
import { setCourseClassLiveState } from "./set-course-class-live-state.graphql";
import {
	SetCourseClassLiveStateMutation,
	SetCourseClassLiveStateMutationVariables,
} from "./set-course-class-live-state.graphql.generated";

type SetCourseClassLiveStateArgs = {
	courseClassListCode: string;
	courseClassNumber: number;
	html?: string;
	inProgress?: boolean;
	startDate?: string;
	removeStartDate?: boolean;
	removeHtml?: boolean;
};

const command: CommandModule<{}, SetCourseClassLiveStateArgs> = {
	command: "set-course-class-live-state",

	aliases: ["set-course-class-ls"],

	// describe: "Actualiza la información sobre la transmisión en vivo de una clase.",
	describe: false,

	builder: async (yargs) =>
		yargs
			.option("courseClassListCode", {
				describe: "Código de la lista de clases a la que la clase a actualizar pertenece.",
				type: "string",
				alias: "c",
				demandOption: true,
			})
			.option("courseClassNumber", {
				describe: "Número de la clase a actualizar",
				type: "number",
				alias: "n",
				demandOption: true,
			})
			.option("html", {
				describe: "Contenido html a mostrar en la web.",
				type: "string",
				demandOption: false,
			})
			.option("inProgress", {
				describe: "Si la clase comenzó.",
				type: "boolean",
				alias: "p",
				demandOption: false,
			})
			.option("startDate", {
				description: "Fecha de inicio de la clase en formato dd-mm-aaaa.",
				type: "string",
				alias: "d",
				demandOption: false,
			})
			.option("removeStartDate", {
				description: "Eliminar la fecha de comienzo de la clase.",
				type: "boolean",
				demandOption: false,
			})
			.option("removeHtml", {
				description: "Eliminar el contenido html de la clase.",
				type: "boolean",
				demandOption: false,
			}),

	handler: async (args) => {
		const validatedData = await yup
			.object<SetCourseClassLiveStateArgs>({
				courseClassListCode: yup.string().min(1).nullable(false).required(),
				courseClassNumber: yup.number().min(1).nullable(false).required(),
				html: yup.string().min(1).nullable(false).notRequired(),
				inProgress: yup.boolean().nullable(false).notRequired(),
				startDate: yup.string().nullable(false).notRequired(),
				removeHtml: yup.boolean().nullable(false).notRequired(),
				removeStartDate: yup.boolean().nullable(false).notRequired(),
			})
			.required()
			.validate(args);

		const apolloClient = createGraphqlClient();

		let data: SetCourseClassLiveStateDataInput | null = {};

		if (args.removeHtml) data.html = null;
		else if (typeof args.html === "string") data.html = args.html;

		if (args.removeStartDate) data.startDate = null;
		else if (typeof args.startDate === "string") {
			const parsedDate =
				validatedData.startDate === undefined
					? undefined
					: parse(validatedData.startDate, "dd-MM-uuuu", new Date());

			if (!isValid(parsedDate)) {
				console.log(`El formato de la fecha no cumple con el formato dd-mm-aaaa`);
				return;
			}

			data.startDate = parsedDate?.toISOString();
		}

		if (typeof validatedData.inProgress === "boolean") data.inProgress = validatedData.inProgress;

		if (Object.keys(data).length === 0) data = null;

		const variables: SetCourseClassLiveStateMutationVariables = {
			input: {
				courseClassRef: {
					byNumber: {
						courseClassList: {
							byCode: {
								code: validatedData.courseClassListCode,
							},
						},
						number: validatedData.courseClassNumber,
					},
				},
				data,
			},
			secret: appConfig.secret,
		};

		const response = await apolloClient.mutate<
			SetCourseClassLiveStateMutation,
			SetCourseClassLiveStateMutationVariables
		>({
			mutation: setCourseClassLiveState,
			variables: variables,
		});

		const { setCourseClassLiveState: setCourseClassLiveStateResponse } = response.data || {};

		let message = "Error inesperado.";
		switch (setCourseClassLiveStateResponse?.__typename) {
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
			case "SetCourseClassLiveStatePayload": {
				message = !!setCourseClassLiveStateResponse.courseClassLiveState
					? `El estado del vivo se actualizó con éxito.\n`
					: `La clase ya no aparece como una transmisión.\n`;
				break;
			}
		}

		console.log(message);
	},
};

export default command;
