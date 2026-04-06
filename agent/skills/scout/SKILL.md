---
name: scout
description: Deep-scan Twitter/X for trending tech ideas and generate top 3 GitClaw agent ideas. Use when the user asks to scout, find trends, or see what's hot.
confidence: 1
usage_count: 4
success_count: 4
failure_count: 0
negative_examples: []
---

# Scout

Deep-scan Twitter/X for trending ideas. Twitter is the ONLY source. Go deep.

## Step 1: Get today's date
```bash
date +%Y-%m-%d
```

## Step 2: Twitter/X — run ALL 8 searches
```bash
export $(cat .env | grep TWITTER_BEARER_TOKEN)

# 1. Wishlists
curl -s -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" \
  "https://api.twitter.com/2/tweets/search/recent?query=%22someone%20should%20build%22%20-is:retweet&max_results=10&tweet.fields=public_metrics,author_id,created_at"

# 2. Pain points
curl -s -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" \
  "https://api.twitter.com/2/tweets/search/recent?query=%22I%20wish%20there%20was%22%20-is:retweet&max_results=10&tweet.fields=public_metrics,author_id,created_at"

# 3. OSS demand
curl -s -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" \
  "https://api.twitter.com/2/tweets/search/recent?query=%22open%20source%20alternative%22%20-is:retweet&max_results=10&tweet.fields=public_metrics,author_id,created_at"

# 4. New launches
curl -s -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" \
  "https://api.twitter.com/2/tweets/search/recent?query=(%22just%20shipped%22%20OR%20%22just%20launched%22)%20(AI%20agent%20OR%20coding%20agent%20OR%20developer%20tool)%20-is:retweet&max_results=10&tweet.fields=public_metrics,author_id,created_at"

# 5. AI agent trends
curl -s -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" \
  "https://api.twitter.com/2/tweets/search/recent?query=(AI%20agent%20OR%20coding%20agent)%20(idea%20OR%20build%20OR%20need%20OR%20missing)%20-is:retweet&max_results=10&tweet.fields=public_metrics,author_id,created_at"

# 6. Influencers
curl -s -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" \
  "https://api.twitter.com/2/tweets/search/recent?query=(from:karpathy%20OR%20from:levelsio%20OR%20from:swyx)%20(agent%20OR%20AI%20OR%20build%20OR%20open%20source)%20-is:retweet&max_results=10&tweet.fields=public_metrics,author_id,created_at"

# 7. Unmet needs
curl -s -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" \
  "https://api.twitter.com/2/tweets/search/recent?query=%22why%20is%20there%20no%22%20(tool%20OR%20app%20OR%20agent)%20-is:retweet&max_results=10&tweet.fields=public_metrics,author_id,created_at"

# 8. Frustrations
curl -s -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" \
  "https://api.twitter.com/2/tweets/search/recent?query=(%22so%20frustrating%22%20OR%20%22waste%20of%20time%22)%20(developer%20OR%20coding%20OR%20AI)%20-is:retweet&max_results=10&tweet.fields=public_metrics,author_id,created_at"
```

Link to tweets: `https://x.com/i/status/{tweet_id}`

## Step 3: Analyze — find top 3 GitClaw agent ideas
Sort all tweets by engagement. For each high-signal tweet, ask: "Can this be built as a GitClaw agent?"
Pick the 3 best ideas.

## Step 4: Save findings
```bash
SESSION_DIR="ideas/$(date +%Y-%m-%d_%H-%M)"
mkdir -p "$SESSION_DIR"
```
- Raw data → `scouted/<date>-trends.md` (all tweets organized by search)
- Each idea → `$SESSION_DIR/<idea-name>.md`
- Summary → `$SESSION_DIR/index.md`
