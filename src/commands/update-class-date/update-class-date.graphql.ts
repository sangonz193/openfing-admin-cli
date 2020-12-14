import gql from "graphql-tag";

export const updateCourseClass = gql`
	mutation updateCourseClass($ref: CourseClassRef!, $input: UpdateCourseClassInput!, $secret: String!) {
		updateCourseClass(ref: $ref, input: $input, secret: $secret) {
			__typename
			... on UpdateCourseClassPayload {
				courseClass {
					name
					number
					publishedAt
					courseClassList {
						code
					}
				}
			}
		}
	}
`;
