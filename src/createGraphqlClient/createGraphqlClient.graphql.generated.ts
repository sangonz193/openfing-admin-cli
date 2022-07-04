import * as Types from '../generated/localSchema.types';

import * as Operations from './createGraphqlClient.graphql';
import * as Apollo from '@apollo/client';
export type CourseByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type CourseByIdQuery = { __typename?: 'Query', courseById: { __typename?: 'Course', id: string } | { __typename?: 'NotFoundError' } };

export type CourseByCodeQueryVariables = Types.Exact<{
  code: Types.Scalars['String'];
}>;


export type CourseByCodeQuery = { __typename?: 'Query', courseByCode: { __typename?: 'Course', id: string } | { __typename?: 'NotFoundError' } };

export type CourseClassByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type CourseClassByIdQuery = { __typename?: 'Query', courseClassById: { __typename?: 'CourseClass', id: string } | { __typename?: 'NotFoundError' } };


export function useCourseByIdQuery(baseOptions: Apollo.QueryHookOptions<CourseByIdQuery, CourseByIdQueryVariables>) {
        return Apollo.useQuery<CourseByIdQuery, CourseByIdQueryVariables>(Operations.courseById, baseOptions);
      }
export function useCourseByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CourseByIdQuery, CourseByIdQueryVariables>) {
          return Apollo.useLazyQuery<CourseByIdQuery, CourseByIdQueryVariables>(Operations.courseById, baseOptions);
        }
export type CourseByIdQueryHookResult = ReturnType<typeof useCourseByIdQuery>;
export type CourseByIdLazyQueryHookResult = ReturnType<typeof useCourseByIdLazyQuery>;
export type CourseByIdQueryResult = Apollo.QueryResult<CourseByIdQuery, CourseByIdQueryVariables>;
export function useCourseByCodeQuery(baseOptions: Apollo.QueryHookOptions<CourseByCodeQuery, CourseByCodeQueryVariables>) {
        return Apollo.useQuery<CourseByCodeQuery, CourseByCodeQueryVariables>(Operations.courseByCode, baseOptions);
      }
export function useCourseByCodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CourseByCodeQuery, CourseByCodeQueryVariables>) {
          return Apollo.useLazyQuery<CourseByCodeQuery, CourseByCodeQueryVariables>(Operations.courseByCode, baseOptions);
        }
export type CourseByCodeQueryHookResult = ReturnType<typeof useCourseByCodeQuery>;
export type CourseByCodeLazyQueryHookResult = ReturnType<typeof useCourseByCodeLazyQuery>;
export type CourseByCodeQueryResult = Apollo.QueryResult<CourseByCodeQuery, CourseByCodeQueryVariables>;
export function useCourseClassByIdQuery(baseOptions: Apollo.QueryHookOptions<CourseClassByIdQuery, CourseClassByIdQueryVariables>) {
        return Apollo.useQuery<CourseClassByIdQuery, CourseClassByIdQueryVariables>(Operations.courseClassById, baseOptions);
      }
export function useCourseClassByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CourseClassByIdQuery, CourseClassByIdQueryVariables>) {
          return Apollo.useLazyQuery<CourseClassByIdQuery, CourseClassByIdQueryVariables>(Operations.courseClassById, baseOptions);
        }
export type CourseClassByIdQueryHookResult = ReturnType<typeof useCourseClassByIdQuery>;
export type CourseClassByIdLazyQueryHookResult = ReturnType<typeof useCourseClassByIdLazyQuery>;
export type CourseClassByIdQueryResult = Apollo.QueryResult<CourseClassByIdQuery, CourseClassByIdQueryVariables>;