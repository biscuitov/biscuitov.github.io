const fs = require('fs-extra')
const { execSync } = require('child_process')
const path = require('path')

async function deploy() {
  try {
    console.log('🏗️  Building project...')
    execSync('npm run build', { stdio: 'inherit' })

    console.log('📦 Preparing deployment...')

    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()

    try {
      execSync('git stash', { stdio: 'pipe' })
    } catch (error) {

    }

    try {
      execSync('git checkout gh-pages', { stdio: 'inherit' })
    } catch (error) {
      console.log('Creating gh-pages branch...')
      execSync('git checkout --orphan gh-pages', { stdio: 'inherit' })
      execSync('git rm -rf .', { stdio: 'inherit' })
    }

    execSync(`git checkout ${currentBranch} -- out`, { stdio: 'inherit' })

    const files = fs.readdirSync('.')
    for (const file of files) {
      if (file !== '.git' && file !== 'out') {
        try {
          fs.removeSync(file)
        } catch (error) {

        }
      }
    }

    if (fs.existsSync('out')) {
      const outFiles = fs.readdirSync('out')
      for (const file of outFiles) {
        fs.moveSync(path.join('out', file), file)
      }
      fs.removeSync('out')
    }

    fs.writeFileSync('.nojekyll', '')

    execSync('git add .', { stdio: 'inherit' })
    try {
      execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' })
      execSync('git push origin gh-pages', { stdio: 'inherit' })
      console.log('✅ Successfully deployed to GitHub Pages!')
    } catch (error) {
      console.log('No changes to commit')
    }

    execSync(`git checkout ${currentBranch}`, { stdio: 'inherit' })

    try {
      execSync('git stash pop', { stdio: 'pipe' })
    } catch (error) {

    }

  } catch (error) {
    console.error('❌ Deployment failed:', error.message)
    process.exit(1)
  }
}

deploy()
