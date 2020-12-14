import * as Types from '../../generated/localSchema.types';

import * as Operations from './backup.graphql';
import * as Apollo from '@apollo/client';
export type BackupDbMutationVariables = Types.Exact<{
  secret: Types.Scalars['String'];
}>;


export type BackupDbMutation = { __typename?: 'Mutation', backupDb: Types.Maybe<any> };


export type BackupDbMutationFn = Apollo.MutationFunction<BackupDbMutation, BackupDbMutationVariables>;
export function useBackupDbMutation(baseOptions?: Apollo.MutationHookOptions<BackupDbMutation, BackupDbMutationVariables>) {
        return Apollo.useMutation<BackupDbMutation, BackupDbMutationVariables>(Operations.backupDb, baseOptions);
      }
export type BackupDbMutationHookResult = ReturnType<typeof useBackupDbMutation>;
export type BackupDbMutationResult = Apollo.MutationResult<BackupDbMutation>;
export type BackupDbMutationOptions = Apollo.BaseMutationOptions<BackupDbMutation, BackupDbMutationVariables>;