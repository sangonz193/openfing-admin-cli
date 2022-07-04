import gql from "graphql-tag";

export const setCourseClassLiveState = gql`
	mutation setCourseClassLiveState($input: SetCourseClassLiveStateInput!, $secret: String!) {
		setCourseClassLiveState(input: $input, secret: $secret) {
			__typename
			... on SetCourseClassLiveStatePayload {
				courseClassLiveState {
					id
				}
			}
		}
	}
`;
