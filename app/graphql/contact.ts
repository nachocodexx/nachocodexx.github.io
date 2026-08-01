import { gql } from '@apollo/client/core'

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}

export interface CreateContactMessageMutation {
  createContactMessage: ContactMessage
}

export interface CreateContactMessageVariables {
  name: string
  email: string
  message: string
}

export const CREATE_CONTACT_MESSAGE_MUTATION = gql`
  mutation CreateContactMessage($name: String!, $email: String!, $message: String!) {
    createContactMessage(name: $name, email: $email, message: $message) {
      id
      name
      email
      message
      createdAt
    }
  }
`
