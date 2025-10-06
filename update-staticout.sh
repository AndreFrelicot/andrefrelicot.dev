# Remove all files except .gitignore and .git
find /Users/andre/code/andrefrelicot.dev-static-out -mindepth 1 -not -name '.gitignore' -not -path '*/.git/*' -not -name '.git' -delete

# Copy all content from ./out/ to the target directory
cp -r ./out/* /Users/andre/code/andrefrelicot.dev-static-out/

# Get the last commit message from current repo
COMMIT_MSG=$(git log -1 --pretty=format:%s)

# Navigate to target directory, stage all changes, and commit with same message
cd /Users/andre/code/andrefrelicot.dev-static-out
git add .
git commit -m "$COMMIT_MSG"

# Return to original directory
cd /Users/andre/code/andrefrelicot.dev

