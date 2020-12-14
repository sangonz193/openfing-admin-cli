import gql from "graphql-tag";

export const courseById = gql`
	query courseById($id: ID!) {
		courseById(id: $id) {
			... on Course {
				id
			}
		}
	}
`;

export const courseByCode = gql`
	query courseByCode($code: String!) {
		courseByCode(code: $code) {
			... on Course {
				id
			}
		}
	}
`;

export const courseClassById = gql`
	query courseClassById($id: ID!) {
		courseClassById(id: $id) {
			... on CourseClass {
				id
			}
		}
	}
`;
