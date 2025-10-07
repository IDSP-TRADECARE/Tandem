import { pgTable, serial, integer, varchar, text, timestamp, boolean, jsonb, index, primaryKey } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Community = InferSelectModel<typeof communities>;
export type NewCommunity = InferInsertModel<typeof communities>;

export type CommunityMember = InferSelectModel<typeof communityMembers>;
export type NewCommunityMember = InferInsertModel<typeof communityMembers>;

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

export type PostLike = InferSelectModel<typeof postLikes>;
export type NewPostLike = InferInsertModel<typeof postLikes>;

export type Comment = InferSelectModel<typeof comments>;
export type NewComment = InferInsertModel<typeof comments>;

export type CommentLike = InferSelectModel<typeof commentLikes>;
export type NewCommentLike = InferInsertModel<typeof commentLikes>;

export type Notification = InferSelectModel<typeof notifications>;
export type NewNotification = InferInsertModel<typeof notifications>;


//Users table 
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  occupation: varchar('occupation', { length: 100 }),
  profilePicture: varchar('profile_picture', { length: 500 }),
  bio: text('bio'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Communities table
export const communities = pgTable('communities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  description: text('description'),
  coverImage: varchar('cover_image', { length: 500 }),
  rules: jsonb('rules').$type<string[]>(), // Array of community rules
  category: varchar('category', { length: 100 }), 
  isPrivate: boolean('is_private').default(false),
  createdById: serial('created_by_id').notNull().references(() => users.id),
  memberCount: serial('member_count').default(0),
  postCount: serial('post_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  nameIdx: index('idx_communities_name').on(table.name),
  categoryIdx: index('idx_communities_category').on(table.category),
}));

// Community memberships (many-to-many between users and communities)
export const communityMembers = pgTable('community_members', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').notNull().references(() => users.id),
  communityId: serial('community_id').notNull().references(() => communities.id),
  role: varchar('role', { length: 50 }).$type<'member' | 'moderator' | 'admin'>().default('member'),
  joinedAt: timestamp('joined_at').defaultNow(),
}, (table) => ({
  userCommunityIdx: index('idx_user_community').on(table.userId, table.communityId),
  communityIdx: index('idx_community_members').on(table.communityId),
}));

// Posts table
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').notNull().references(() => users.id),
  communityId: serial('community_id').notNull().references(() => communities.id),
  title: varchar('title', { length: 300 }).notNull(),
  content: text('content').notNull(),
  images: jsonb('images').$type<string[]>(), // Array of image URLs
  type: varchar('type', { length: 50 }).$type<'text' | 'image' | 'link' | 'poll'>().default('text'),
  metadata: jsonb('metadata'), // For polls, links, etc.
  isPinned: boolean('is_pinned').default(false),
  isLocked: boolean('is_locked').default(false),
  likeCount: serial('like_count').default(0),
  commentCount: serial('comment_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdx: index('idx_posts_user').on(table.userId),
  communityIdx: index('idx_posts_community').on(table.communityId),
  createdAtIdx: index('idx_posts_created_at').on(table.createdAt),
  communityCreatedIdx: index('idx_posts_community_created').on(table.communityId, table.createdAt),
}));

// Post likes table
export const postLikes = pgTable('post_likes', {
  userId: serial('user_id').notNull().references(() => users.id),
  postId: serial('post_id').notNull().references(() => posts.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.postId] }),
  postIdx: index('idx_post_likes_post').on(table.postId),
}));

// Comments table
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  postId: integer('post_id').notNull().references(() => posts.id),
  parentId: integer('parent_id'), 
  content: text('content').notNull(),
  likeCount: integer('like_count').default(0),
  isEdited: boolean('is_edited').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  postIdx: index('idx_comments_post').on(table.postId),
  userIdx: index('idx_comments_user').on(table.userId),
  parentIdx: index('idx_comments_parent').on(table.parentId),
  postCreatedIdx: index('idx_comments_post_created').on(table.postId, table.createdAt),
}));

// Comment likes table
export const commentLikes = pgTable('comment_likes', {
  userId: serial('user_id').notNull().references(() => users.id),
  commentId: serial('comment_id').notNull().references(() => comments.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.commentId] }),
  commentIdx: index('idx_comment_likes_comment').on(table.commentId),
}));

// Notifications table 
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').notNull().references(() => users.id),
  type: varchar('type', { length: 50 }).$type<'post_like' | 'comment' | 'comment_like' | 'new_member' | 'mention'>().notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  relatedId: serial('related_id'), // ID of the post, comment, etc.
  relatedType: varchar('related_type', { length: 50 }), // 'post', 'comment', etc.
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('idx_notifications_user').on(table.userId),
  userUnreadIdx: index('idx_notifications_user_unread').on(table.userId, table.isRead),
}));


//relations for better querying
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  communityMemberships: many(communityMembers),
  createdCommunities: many(communities),
}));

export const communitiesRelations = relations(communities, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [communities.createdById],
    references: [users.id],
  }),
  members: many(communityMembers),
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  community: one(communities, {
    fields: [posts.communityId],
    references: [communities.id],
  }),
  comments: many(comments),
  likes: many(postLikes),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
  likes: many(commentLikes),
}));