export interface Label {
  id: number
  url: string
  name: string
  color: string
  default: boolean
}

export interface User {
  id: number
  login: string
  url: string
  avatarUrl: string
  htmlUrl: string
}

export interface Repository {
  id: number
  name: string
  fullName: string
  description: string | null
  private: boolean
  owner: User
  fork: boolean
  url: string
  htmlUrl: string
  createdAt: string
  stargazersCount: number
  forks: number
  license: string | null
  defaultBranch: string
  openIssues: number
}

export interface Issue {
  id: number
  title: string
  number: number
  url: string
  htmlUrl: string
  label: Label
  user: User
  assignee: User
  assignees: User[]
  comments: number
  createdAt: string
  updatedAt: string
  closedAt: string | null
  authorAssociation: string
  body: string
}

export interface Branch {
  label: string
  ref: string
  sha: string
  user: User
  repo: Repository
}

export interface PullRequest extends Issue {
  locked: boolean
  head: Branch
  base: Branch
  commits: number
  additions: number
  deletions: number
  changedFiles: number
  merged: boolean
}

export interface PullRequestEventData {
  action:
    | 'assigned'
    | 'merged'
    | 'auto_merge_disabled'
    | 'auto_merge_enabled'
    | 'closed'
    | 'converted_to_draft'
    | 'edited'
    | 'labeled'
    | 'locked'
    | 'opened'
    | 'ready_for_review'
    | 'reopened'
    | 'review_request_removed'
    | 'review_requested'
    | 'synchronize'
    | 'unassigned'
    | 'unlabeled'
    | 'unlocked'
  pullRequest: PullRequest
  repository: Repository
  changes: {
    title: {
      from: string
    }
    body: {
      from: string
    }
  } | null
  assignee: User | null
  sender: User
}

export interface IssuesEventData {
  action:
    | 'opened'
    | 'edited'
    | 'deleted'
    | 'pinned'
    | 'unpinned'
    | 'closed'
    | 'reopened'
    | 'assigned'
    | 'unassigned'
    | 'labeled'
    | 'unlabeled'
    | 'locked'
    | 'unlocked'
    | 'transferred'
    | 'milestoned'
    | 'demilestoned'
  issue: Issue
  repository: Repository
  sender: User
  assignee?: User
}
