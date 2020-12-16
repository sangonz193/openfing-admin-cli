import gql from "graphql-tag";

export const createCourseClass = gql`
	mutation createCourseClass($input: CreateCourseClassInput!, $secret: String!) {
		createCourseClass(input: $input, secret: $secret) {
			__typename
			... on CreateCourseClassPayload {
				courseClass {
					name
					number
					courseClassList {
						code
					}
				}
			}
		}
	}
`;
