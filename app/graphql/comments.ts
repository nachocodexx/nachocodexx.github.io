import { gql } from '@apollo/client/core'

export interface Comment {
  id: string
  postId: string
  userId: string
  authorName: string
  content: string
  parentId: string | null
  createdAt: string
}

export interface CommentsQuery {
  comments: {
    nodes: Comment[]
    paginationInfo: {
      total: number
    } | null
  }
}

export interface CreateCommentMutation {
  createComment: Comment
}

export const COMMENTS_QUERY = gql`
  query PostComments($postId: String!, $limit: Int!, $offset: Int!) {
    comments(
      filters: {
        postId: { eq: $postId }
        parentId: { is_null: true }
      }
      orderBy: { createdAt: DESC }
      pagination: { offset: { limit: $limit, offset: $offset } }
    ) {
      paginationInfo {
        total
      }
      nodes {
        id
        postId
        userId
        authorName
        content
        parentId
        createdAt
      }
    }
  }
`

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment(
    $postId: String!
    $userId: String!
    $authorName: String!
    $content: String!
  ) {
    createComment(
      postId: $postId
      userId: $userId
      authorName: $authorName
      content: $content
    ) {
      id
      postId
      userId
      authorName
      content
      parentId
      createdAt
    }
  }
`
