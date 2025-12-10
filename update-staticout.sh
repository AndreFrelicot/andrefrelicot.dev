#!/bin/bash

# Paths
SOURCE_DIR="/Users/andre/code/andrefrelicot.dev"
TARGET_DIR="/Users/andre/code/andrefrelicot.dev-static-out"

# Get the last synced commit hash from the static repo (stored in a marker file)
MARKER_FILE="$TARGET_DIR/.last-synced-commit"

if [ -f "$MARKER_FILE" ]; then
  LAST_SYNCED=$(cat "$MARKER_FILE")
else
  LAST_SYNCED=""
fi

# Get list of commits to process (oldest first)
if [ -n "$LAST_SYNCED" ]; then
  COMMITS=$(git log --reverse --format="%H" "$LAST_SYNCED"..HEAD 2>/dev/null)
else
  # First run: only get the latest commit
  COMMITS=$(git log -1 --format="%H")
fi

# Check if there are commits to process
if [ -z "$COMMITS" ]; then
  echo "No new commits to sync."
  exit 0
fi

# Count commits
COMMIT_COUNT=$(echo "$COMMITS" | wc -l | tr -d ' ')
echo "Found $COMMIT_COUNT commit(s) to sync."

# Build once with current HEAD
echo "Building production output..."
npm run build

if [ $? -ne 0 ]; then
  echo "Build failed!"
  exit 1
fi

# Clean target directory (except .git, .gitignore, and marker file)
echo "Cleaning target directory..."
find "$TARGET_DIR" -mindepth 1 \
  -not -name '.gitignore' \
  -not -name '.last-synced-commit' \
  -not -name '.source-commit' \
  -not -path '*/.git/*' \
  -not -name '.git' \
  -delete

# Copy build output once
echo "Copying build output..."
cp -r ./out/* "$TARGET_DIR/"

# Process each commit (just create commits with metadata, no rebuild)
for COMMIT_HASH in $COMMITS; do
  echo ""
  echo "Syncing commit: $COMMIT_HASH"

  # Get commit message and metadata from source repo
  COMMIT_MSG=$(git log -1 --pretty=format:%s "$COMMIT_HASH")
  COMMIT_BODY=$(git log -1 --pretty=format:%b "$COMMIT_HASH")
  COMMIT_DATE=$(git log -1 --pretty=format:%ai "$COMMIT_HASH")
  COMMIT_AUTHOR=$(git log -1 --pretty=format:"%an <%ae>" "$COMMIT_HASH")

  # Update dummy file to make repo dirty for each commit
  echo "$COMMIT_HASH" > "$TARGET_DIR/.source-commit"

  # Commit in target directory
  cd "$TARGET_DIR"
  git add .

  # Commit with original date and author
  if [ -n "$COMMIT_BODY" ]; then
    GIT_AUTHOR_DATE="$COMMIT_DATE" GIT_COMMITTER_DATE="$COMMIT_DATE" \
    git commit --author="$COMMIT_AUTHOR" -m "$COMMIT_MSG" -m "$COMMIT_BODY" --quiet
  else
    GIT_AUTHOR_DATE="$COMMIT_DATE" GIT_COMMITTER_DATE="$COMMIT_DATE" \
    git commit --author="$COMMIT_AUTHOR" -m "$COMMIT_MSG" --quiet
  fi

  echo "Committed: $COMMIT_MSG"

  # Update marker file
  echo "$COMMIT_HASH" > "$MARKER_FILE"

  cd "$SOURCE_DIR"
done

echo ""
echo "Sync complete! $COMMIT_COUNT commit(s) processed."
