import { InMemoryCache, TypePolicies } from "@apollo/client/cache";
import { ApolloClient, ApolloLink } from "@apollo/client/core";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import fetch from "cross-fetch";
import { GraphQLError } from "graphql/error/GraphQLError";
import { execute } from "graphql/execution/execute";
import { print } from "graphql/language/printer";
import { buildSchema } from "graphql/utilities/buildASTSchema";

import { hasProperty } from "../_utils/hasProperty";
import { isObject } from "../_utils/isObject";
import { appConfig } from "../appConfig";
import { remoteSchema } from "../generated/remoteSchema.graphql";
import { possibleTypes } from "../generated/remoteSchemaPossibleTypes";

let getSchema = () => {
	const schema = buildSchema(print(remoteSchema));
	getSchema = () => schema;

	return schema;
};

const ValidationAndCacheLink = () => {
	return new ApolloLink((operation, forward) => {
		const schema = getSchema();

		return forward(operation).map((value) => {
			const execResult = execute({
				schema,
				document: operation.query,
				rootValue: value.data,
				variableValues: operation.variables,
			});

			const isPromise = (value: unknown): value is Promise<unknown> =>
				isObject(value) && hasProperty(value, "then") && typeof value.then === "function";

			value.errors = [new GraphQLError("Unexpected promise returned from `execute`")];

			return isPromise(execResult)
				? {
						data: {},
						graphQLErrors: [new GraphQLError("Unexpected promise returned from `execute`")],
				  }
				: {
						data: execResult.data ?? {},
						errors: execResult.errors,
				  };
		});
	});
};

export const createGraphqlClient = () => {
	const typePolicies: TypePolicies = {
		Query: {
			fields: {
				courseById: {
					read: (existing, options) =>
						existing || options.toReference({ __typename: "Course", id: options.args?.id }),
				},

				courseByCode: {
					read: (existing, options) => {
						if (existing) return existing;

						// eslint-disable-next-line @typescript-eslint/no-use-before-define
						const id = Object.values(cache.extract()).find(
							(i) => i?.__typename === "Course" && (i.code ?? "") === options.args?.code
						)?.id;

						return options.toReference({ __typename: "Course", id });
					},
				},

				courseClassById: {
					read: (existing, options) =>
						existing || options.toReference({ __typename: "CourseClass", id: options.args?.id }),
				},

				courseClassListById: {
					read: (existing, options) =>
						existing || options.toReference({ __typename: "CourseClassList", id: options.args?.id }),
				},

				courseClassListByCode: {
					read: (existing, options) => {
						if (options.args?.code === "prog3-2018") debugger;
						if (existing) return existing;

						// eslint-disable-next-line @typescript-eslint/no-use-before-define
						const id = Object.values(cache.extract()).find(
							(i) => i?.__typename === "CourseClassList" && (i.code ?? "") === options.args?.code
						)?.id;

						return options.toReference({ __typename: "CourseClassList", id });
					},
				},

				courseEditionById: {
					read: (existing, options) =>
						existing || options.toReference({ __typename: "CourseEdition", id: options.args?.id }),
				},
			},
		},
	};

	const cache: InMemoryCache = new InMemoryCache({
		addTypename: true,
		possibleTypes,
		typePolicies: typePolicies as Required<typeof typePolicies>,
	});

	const apolloClient = new ApolloClient({
		connectToDevTools: true,
		link: ApolloLink.from([ValidationAndCacheLink(), new BatchHttpLink({ uri: appConfig.apiUri, fetch })]),
		cache,
		version: process.env.npm_package_version,
	});

	return apolloClient;
};
