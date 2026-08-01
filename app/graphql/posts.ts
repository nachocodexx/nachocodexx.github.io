import { gql } from '@apollo/client/core'

export type PostStatus = 'draft' | 'published'

export interface PostSummary {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string | null
  slug: string
  tags: string[]
  skills: string[]
  status: PostStatus
  createdAt: string
  publishedAt: string | null
  readCount: number
}

export interface PostDetail extends PostSummary {
  content: string
  isLiked: boolean
  likeCount: number
}

export interface PaginationInfo {
  current: number
  offset: number
  pages: number
  total: number
}

interface PostsConnection<T> {
  nodes: T[]
  paginationInfo: PaginationInfo | null
}

export interface PublishedPostsQuery {
  posts: PostsConnection<PostSummary>
}

export interface PostFilterInput {
  id?: {
    ne?: string
  }
  or?: Array<{
    skills?: {
      array_overlap: string[]
    }
    tags?: {
      array_overlap: string[]
    }
  }>
  status?: {
    eq: PostStatus
  }
}

export interface PublishedPostQuery {
  posts: PostsConnection<PostSummary & {
    content: string
    likes: {
      paginationInfo: Pick<PaginationInfo, 'total'> | null
    }
    viewerLikes: PostsConnection<{
      postId: string
      userId: string
    }>
  }>
}

export interface UserQuery {
  user: {
    firstSeenAt: string
    userId: string
  } | null
}

export interface RegisterUserMutation {
  registerUser: {
    firstSeenAt: string
    userId: string
  }
}

export interface LikePostMutation {
  likePost: {
    createdAt: string
    postId: string
    userId: string
  }
}

export interface UnlikePostMutation {
  unlikePost: boolean
}

export interface CreatePostInput {
  content: string
  imageUrl: string | null
  skills: string[]
  status: PostStatus
  subtitle: string | null
  tags: string[]
  title: string
}

export interface CreatePostMutation {
  createPost: PostSummary & {
    content: string
  }
}

const POST_SUMMARY_FIELDS = gql`
  fragment PostSummaryFields on Posts {
    id
    title
    subtitle
    imageUrl
    slug
    tags
    skills
    status
    createdAt
    publishedAt
    readCount
  }
`

export const PUBLISHED_POSTS_QUERY = gql`
  query PublishedPosts($limit: Int!, $offset: Int!) {
    posts(
      filters: { status: { eq: published } }
      orderBy: { publishedAt: DESC }
      pagination: { offset: { limit: $limit, offset: $offset } }
    ) {
      paginationInfo {
        current
        offset
        pages
        total
      }
      nodes {
        ...PostSummaryFields
      }
    }
  }
  ${POST_SUMMARY_FIELDS}
`

export const PUBLISHED_POSTS_BY_SKILL_QUERY = gql`
  query PublishedPostsBySkill($skill: String!, $limit: Int!, $offset: Int!) {
    posts(
      filters: {
        status: { eq: published }
        skills: { array_contains: [$skill] }
      }
      orderBy: { publishedAt: DESC }
      pagination: { offset: { limit: $limit, offset: $offset } }
    ) {
      paginationInfo {
        current
        offset
        pages
        total
      }
      nodes {
        ...PostSummaryFields
      }
    }
  }
  ${POST_SUMMARY_FIELDS}
`

export const RELATED_POSTS_QUERY = gql`
  query RelatedPosts($filters: PostFilterInput!, $limit: Int!) {
    posts(
      filters: $filters
      orderBy: { publishedAt: DESC }
      pagination: { offset: { limit: $limit, offset: 0 } }
    ) {
      paginationInfo {
        current
        offset
        pages
        total
      }
      nodes {
        ...PostSummaryFields
      }
    }
  }
  ${POST_SUMMARY_FIELDS}
`

export const PUBLISHED_POST_QUERY = gql`
  query PublishedPost($slug: String!, $userId: String!) {
    posts(
      filters: {
        slug: { eq: $slug }
        status: { eq: published }
      }
      pagination: { offset: { limit: 1, offset: 0 } }
    ) {
      paginationInfo {
        current
        offset
        pages
        total
      }
      nodes {
        ...PostSummaryFields
        content
        likes(pagination: { offset: { limit: 1, offset: 0 } }) {
          paginationInfo {
            total
          }
        }
        viewerLikes: likes(
          filters: { userId: { eq: $userId } }
          pagination: { offset: { limit: 1, offset: 0 } }
        ) {
          nodes {
            postId
            userId
          }
        }
      }
    }
  }
  ${POST_SUMMARY_FIELDS}
`

export const USER_QUERY = gql`
  query VisitorUser($userId: String!) {
    user(id: $userId) {
      userId
      firstSeenAt
    }
  }
`

export const REGISTER_USER_MUTATION = gql`
  mutation RegisterVisitor($userId: String!) {
    registerUser(userId: $userId) {
      userId
      firstSeenAt
    }
  }
`

export const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: String!, $userId: String!) {
    likePost(postId: $postId, userId: $userId) {
      postId
      userId
      createdAt
    }
  }
`

export const UNLIKE_POST_MUTATION = gql`
  mutation UnlikePost($postId: String!, $userId: String!) {
    unlikePost(postId: $postId, userId: $userId)
  }
`

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost(
    $title: String!
    $subtitle: String
    $imageUrl: String
    $content: String!
    $status: PostStatusEnum!
    $tags: [String!]
    $skills: [String!]
  ) {
    createPost(
      title: $title
      subtitle: $subtitle
      imageUrl: $imageUrl
      content: $content
      status: $status
      tags: $tags
      skills: $skills
    ) {
      ...PostSummaryFields
      content
    }
  }
  ${POST_SUMMARY_FIELDS}
`
