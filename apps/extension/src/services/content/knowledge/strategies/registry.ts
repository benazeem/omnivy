import type { KnowledgeExtractionResult } from '@/types'
import type { SupportedSite } from '../platforms'
import { extractGitHubFileContent } from '../githubFile'
import { extractGitHubIssueContent } from '../githubIssue'
import { extractNotionContent } from '../notion'
import { extractStackOverflowContent } from '../stackOverflow'
import { extractAiConversation } from '../aiConversation'
import { extractVideoContent } from '../videoContent'
import { extractForumLikeContent } from '../forumContent'
import { extractGenericContent } from './generic'

export const STRATEGIES: Record<
  string,
  (
    doc: Document,
    url: URL,
    site: SupportedSite,
  ) => KnowledgeExtractionResult | null
> = {
  github: (doc, url, site) => {
    if (isGitHubIssueOrPullRequest(url)) {
      return extractGitHubIssueContent(doc)
    }

    if (isGitHubFile(url)) {
      return extractGitHubFileContent(doc, url)
    }

    return extractGenericContent(doc, url, site)
  },
  githubIssue: extractGitHubIssueContent,
  stackoverflow: extractStackOverflowContent,
  notion: extractNotionContent,
  chatgpt: extractAiConversation,
  claude: extractAiConversation,
  perplexity: extractAiConversation,
  gemini: extractAiConversation,
  grok: extractAiConversation,
  youtube: extractVideoContent,
  vimeo: extractVideoContent,
  reddit: extractForumLikeContent,
  discourse: extractForumLikeContent,
  xenforo: extractForumLikeContent,
  hackernews: extractForumLikeContent,
  quora: extractForumLikeContent,
  x: extractForumLikeContent,
  linkedin: extractForumLikeContent, 
}

export function getStrategy(key: string) {
  return STRATEGIES[key] ?? extractGenericContent
}

function isGitHubFile(url: URL): boolean {
  return /\/blob\/|\/raw\//.test(url.pathname)
}

function isGitHubIssueOrPullRequest(url: URL): boolean {
  return /\/(issues|pull)\/\d+/.test(url.pathname)
}
