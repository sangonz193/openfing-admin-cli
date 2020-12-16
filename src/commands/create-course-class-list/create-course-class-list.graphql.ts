import gql from "graphql-tag";

export const createCourseClassList = gql`
	mutation createCourseClassList($input: CreateCourseClassListInput!, $secret: String!) {
		createCourseClassList(input: $input, secret: $secret) {
			__typename
			... on CreateCourseClassListPayload {
				courseClassList {
					id
					name
				}
			}
		}
	}
`;
