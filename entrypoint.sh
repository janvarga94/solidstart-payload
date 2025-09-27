echo "--> Running pnpm install..."
pnpm install --prefer-offline --frozen-lockfile
if [ $? -ne 0 ]; then
  echo "pnpm install failed! Exiting."
  exit 1
fi

echo "--> Starting pnpm dev server..."
pnpm dev

# this script exists only because running pnpm install.. 
# directly in docker compose command causes issues.
# this file has to have lf line endings.