# First time setup

-   `git clone https://github.com/your-username/your-repository-name.git`
-   `cd your-repository-name`
-   `git checkout -b <your-name>-dev` # Create and switch to your dedicated branch
-   `git push -u origin <your-name>-dev` # Push your empty branch to GitHub

# Daily workflow

-   `git checkout main`
-   `git pull origin main` # Get latest changes from the main branch
-   `git checkout <your-name>-dev`
-   `git merge main` # Merge main into your branch to stay updated

# Make your code changes

-   `git add .`
-   `git commit -m "My meaningful commit message"`
-   `git push origin <your-name>-dev` # Push your changes to your dedicated branch

# When your work is done for a feature/part

# Ensure your branch is up-to-date with main and all conflicts are resolved

-   `git checkout <your-name>-dev`
-   `git merge main` # (again, just to be sure)
-   `git push origin <your-name>-dev`

# Go to GitHub and create a Pull Request from <your-name>-dev to main
