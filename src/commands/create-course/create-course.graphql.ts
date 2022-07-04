import gql from "graphql-tag";

export const createCourse = gql`
	mutation createCourse($input: CreateCourseInput!, $secret: String!) {
		createCourse(input: $input, secret: $secret) {
			__typename
			... on CreateCoursePayload {
				course {
					id
					code
					name
				}
			}
		}
	}
`;
