#!/bin/bash

# Usage:
# ./update-github-status.sh <state> "<description>" <context> <target_url>

# Required environment variables:
# GITHUB_TOKEN - GitHub token with repo:status permissions
# OWNER - GitHub username or org
# REPO - Repository name
# COMMIT_SHA - Commit hash being deployed

STATE=$1          # "success", "failure", or "pending"
DESCRIPTION=$2    # e.g., "Frontend deployed"
CONTEXT=$3        # e.g., "coolify/frontend"
TARGET_URL=$4     # e.g., "https://frontend.example.com"

# Basic validation
if [[ -z "$GITHUB_TOKEN" || -z "$OWNER" || -z "$REPO" || -z "$COMMIT_SHA" ]]; then
  echo "ERROR: Please set GITHUB_TOKEN, OWNER, REPO, and COMMIT_SHA environment variables."
  exit 1
fi

if [[ -z "$STATE" || -z "$DESCRIPTION" || -z "$CONTEXT" || -z "$TARGET_URL" ]]; then
  echo "Usage: $0 <state> \"<description>\" <context> <target_url>"
  exit 1
fi

# Send status to GitHub
curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/$OWNER/$REPO/statuses/$COMMIT_SHA \
  -d "{
        \"state\": \"$STATE\",
        \"target_url\": \"$TARGET_URL\",
        \"description\": \"$DESCRIPTION\",
        \"context\": \"$CONTEXT\"
      }"

