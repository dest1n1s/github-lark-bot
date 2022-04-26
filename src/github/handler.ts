import { IssuesEventData, PullRequestEventData } from '../types'
import t from '../i18n/i18n.config'

export const handle = (eventType: string, data: any) => {
  switch (eventType) {
    case 'issues':
      return handleIssue(data)
    case 'pull_request':
      return handlePullRequest(data)
  }
  return null
}

const handleIssue = (data: IssuesEventData) => {
  const config = {
    wide_screen_mode: true
  }
  const header = {
    template: t(`color.${data.action}`, { context: 'issue' }),
    title: {
      content: `[${t(`tag.${data.action}`, { context: 'issue' })}] #${data.issue.number} ${
        data.issue.title
      }`,
      tag: 'plain_text'
    }
  }
  const content = {
    tag: 'div',
    text: {
      content: `${t(`content.${data.action}`, {
        context: 'issue',
        user: `[${data.issue.user.login}](${data.issue.user.htmlUrl})`,
        assignee: `[@${data.assignee?.login}](${data.assignee?.htmlUrl})`
      })}\n**[#${data.issue.number} ${data.issue.title}](${data.issue.htmlUrl})**\n${
        data.issue.body || ''
      }`,
      tag: 'lark_md'
    }
  }
  const assignees = {
    tag: 'div',
    text: {
      content: t('assignees', {
        assignees: data.issue.assignees.map((v) => `[@${v.login}](${v.htmlUrl})`)
      }),
      tag: 'lark_md'
    }
  }
  const commentAndTime = {
    fields: [
      {
        is_short: true,
        text: {
          content: `**Comments**\n${data.issue.comments}`,
          tag: 'lark_md'
        }
      },
      {
        is_short: true,
        text: {
          content: `**时间**\n${new Date(data.issue.updatedAt).toLocaleDateString()}`,
          tag: 'lark_md'
        }
      }
    ],
    tag: 'div'
  }
  const hr = {
    tag: 'hr'
  }
  const note = {
    elements: [
      {
        content: `[${data.repository.fullName}](${data.repository.htmlUrl})`,
        tag: 'lark_md'
      }
    ],
    tag: 'note'
  }
  console.log(data.issue.assignees)
  const elements = [
    content,
    ...(data.assignee && data.issue.assignees.length > 0 ? [assignees] : []),
    commentAndTime,
    hr,
    note
  ]
  return {
    config,
    header,
    elements
  }
}

const handlePullRequest = (data: PullRequestEventData) => {
  const config = {
    wide_screen_mode: true
  }
  const header = {
    template: t(`color.${data.action}`, { context: 'pull_request' }),
    title: {
      content: `[${t('tag.' + data.action, { context: 'pull_request' })}] #${
        data.pullRequest.number
      } ${data.pullRequest.title}`,
      tag: 'plain_text'
    }
  }
  const content = {
    tag: 'div',
    text: {
      content: `${t(`content.${data.action}`, {
        context: 'pull_request',
        user: `[${data.pullRequest.user.login}](${data.pullRequest.user.htmlUrl})`,
        assignee: `[@${data.assignee?.login}](${data.assignee?.htmlUrl})`
      })}\n**[#${data.pullRequest.number} ${data.pullRequest.title}](${
        data.pullRequest.htmlUrl
      })**\n${data.pullRequest.body || ''}`,
      tag: 'lark_md'
    }
  }
  const branchFromTo = {
    tag: 'div',
    text: {
      content: `From [${data.pullRequest.head.label}](${data.pullRequest.head.repo.htmlUrl}/trees/${data.pullRequest.head.ref}) to [${data.pullRequest.base.label}](${data.pullRequest.base.repo.htmlUrl}/trees/${data.pullRequest.base.ref})`,
      tag: 'lark_md'
    }
  }
  const changeDescription = {
    tag: 'div',
    text: {
      content: t('change_description', {
        context: 'pull_request',
        commits: data.pullRequest.commits,
        changedFiles: data.pullRequest.changedFiles,
        additions: data.pullRequest.additions,
        deletions: data.pullRequest.deletions
      }),
      tag: 'lark_md'
    }
  }
  const assignees = {
    tag: 'div',
    text: {
      content: t('assignees', {
        assignees: data.pullRequest.assignees.map((v) => `[@${v.login}](${v.htmlUrl})`)
      }),
      tag: 'lark_md'
    }
  }
  const commentAndTime = {
    fields: [
      {
        is_short: true,
        text: {
          content: `**Comments**\n${data.pullRequest.comments}`,
          tag: 'lark_md'
        }
      },
      {
        is_short: true,
        text: {
          content: `**时间**\n${new Date(data.pullRequest.updatedAt).toLocaleDateString()}`,
          tag: 'lark_md'
        }
      }
    ],
    tag: 'div'
  }
  const hr = {
    tag: 'hr'
  }
  const note = {
    elements: [
      {
        content: `[${data.repository.fullName}](${data.repository.htmlUrl})`,
        tag: 'lark_md'
      }
    ],
    tag: 'note'
  }
  const elements = [
    content,
    branchFromTo,
    changeDescription,
    ...(data.assignee && data.pullRequest.assignees.length > 0 ? [assignees] : []),
    commentAndTime,
    hr,
    note
  ]

  return {
    config,
    header,
    elements
  }
}
