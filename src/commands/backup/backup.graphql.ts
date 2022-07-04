import gql from "graphql-tag";

export const backupDb = gql`
	mutation backupDb($secret: String!) {
		backupDb(secret: $secret)
	}
`;
