module.exports = {
    "*.{ts,tsx,js,jsx,graphql,yml,md}": ["yarn prettier --write", "tslint", "git add"],
};
