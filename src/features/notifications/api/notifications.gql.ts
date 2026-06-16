import { gql } from '@apollo/client';

export const FIND_MY_NOTIFICATIONS_QUERY = gql`
  query FindMyNotifications($filter: FindMyNotificationsInput) {
    findMyNotifications(filter: $filter) {
      id
      type
      isRead
      readAt
      createdAt
      postId
      chatId
      actor {
        id
        username
        name
      }
      message {
        id
        content
      }
      comment {
        id
        content
      }
    }
  }
`;

export const NOTIFICATIONS_UNREAD_COUNT_QUERY = gql`
  query NotificationsUnreadCount {
    notificationsUnreadCount {
      total
    }
  }
`;

export const MARK_NOTIFICATION_AS_READ_MUTATION = gql`
  mutation MarkNotificationAsRead($notificationId: String!) {
    markNotificationAsRead(notificationId: $notificationId)
  }
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;

export const NOTIFICATION_CREATED_FOR_USER_SUBSCRIPTION = gql`
  subscription NotificationCreatedForUser {
    notificationCreatedForUser {
      id
      type
      isRead
      readAt
      createdAt
      postId
      chatId
      actor {
        id
        username
        name
      }
      message {
        id
        content
      }
      comment {
        id
        content
      }
    }
  }
`;

export const NOTIFICATION_UPDATED_FOR_USER_SUBSCRIPTION = gql`
  subscription NotificationUpdatedForUser {
    notificationUpdatedForUser {
      id
      type
      isRead
      readAt
      createdAt
      postId
      chatId
      actor {
        id
        username
        name
      }
      message {
        id
        content
      }
      comment {
        id
        content
      }
    }
  }
`;

export type AppNotificationType =
  | 'POST_LIKE'
  | 'POST_COMMENT'
  | 'POST_COMMENT_REPLY'
  | 'NEW_FOLLOWER'
  | 'NEW_MESSAGE';

export type AppNotification = {
  id: string;
  type: AppNotificationType;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  postId: string | null;
  chatId: string | null;
  actor: {
    id: string;
    username: string;
    name: string | null;
  } | null;
  message: {
    id: string;
    content: string;
  } | null;
  comment: {
    id: string;
    content: string;
  } | null;
};

export type FindMyNotificationsData = {
  findMyNotifications: AppNotification[];
};

export type FindMyNotificationsVariables = {
  filter?: {
    skip?: number;
    take?: number;
    onlyUnread?: boolean;
  };
};

export type NotificationsUnreadCountData = {
  notificationsUnreadCount: {
    total: number;
  };
};

export type MarkNotificationAsReadData = {
  markNotificationAsRead: boolean;
};

export type MarkNotificationAsReadVariables = {
  notificationId: string;
};

export type MarkAllNotificationsAsReadData = {
  markAllNotificationsAsRead: boolean;
};

export type NotificationCreatedForUserData = {
  notificationCreatedForUser: AppNotification;
};

export type NotificationUpdatedForUserData = {
  notificationUpdatedForUser: AppNotification;
};
