# Remove all files except .gitignore and .git
find /Users/andre/code/andrefrelicot.dev-static-out -mindepth 1 -not -name '.gitignore' -not -path '*/.git/*' -not -name '.git' -delete

# Copy all content from ./out/ to the target directory
cp -r ./out/* /Users/andre/code/andrefrelicot.dev-static-out/

# Get the last commit message and body from current repo
COMMIT_MSG=$(git log -1 --pretty=format:%s)
COMMIT_BODY=$(git log -1 --pretty=format:%b)

# Navigate to target directory, stage all changes, and commit with same message
cd /Users/andre/code/andrefrelicot.dev-static-out
git add .

# If commit body exists, include it; otherwise just use the subject
if [ -n "$COMMIT_BODY" ]; then
  git commit -m "$COMMIT_MSG" -m "$COMMIT_BODY"
else
  git commit -m "$COMMIT_MSG"
fi

# Return to original directory
cd /Users/andre/code/andrefrelicot.dev

