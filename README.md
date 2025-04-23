# Board Games Bond

A collection of popular board games that you can play online with friends!

## Games Included

- Codenames - A word association game of spies and secrets
- Codenames Duet - A cooperative word game for two players
- Decrypto - Code-breaking team communication challenge
- Chess - The classic strategy game of kings and queens

## How to Play

1. Visit [Board Games Bond](https://razat249.github.io/board-games-bond/)
2. Select a game you want to play
3. Follow the instructions to start a new game or join an existing one
4. Share the game code with friends to play together

## Development

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/razat249/board-games-bond.git

# Navigate to the project directory
cd board-games-bond

# Install dependencies
npm install
```

### Running locally

```bash
npm start
```

This will start the development server on `http://localhost:3000`.

### Building for production

```bash
npm run build
```

This creates a `build` directory with the production build.

## Deploying to GitHub Pages

### One-time setup

1. Install the gh-pages package:

```bash
npm install --save-dev gh-pages
```

2. Add homepage and deploy scripts to package.json:

```json
{
  "homepage": "https://razat249.github.io/board-games-bond",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### Deploying updates

To deploy the latest changes to GitHub Pages, you need to:

1. Make sure your local changes are committed to Git:

```bash
git add .
git commit -m "Your commit message"
```

2. Push your changes to GitHub:

```bash
git push origin main
```

3. Deploy to GitHub Pages:

```bash
npm run deploy
```

Alternatively, you can manually deploy by:

1. Build the project:

```bash
npm run build
```

2. Push the build folder to the gh-pages branch:

```bash
git checkout -b gh-pages
git rm -rf .
git add build
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix build origin gh-pages
```

## Troubleshooting

If you encounter issues with GitHub Pages deployment:

1. Make sure your GitHub repository has GitHub Pages enabled in the Settings tab
2. Check that the gh-pages branch is set as the source for GitHub Pages
3. Ensure you have proper Git credentials configured

## Credits

Board Games Bond is inspired by the original board games:

- Codenames by Vlaada Chvátil
- Decrypto by Thomas Dagenais-Lespérance
- Chess, a classic game with centuries of history

## License

MIT
