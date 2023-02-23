# HHHSite
[![Angular GitHub CI/CD](https://github.com/seanmcnamee/HHHSite/actions/workflows/cd.yaml/badge.svg)](https://github.com/seanmcnamee/HHHSite/actions/workflows/cd.yaml)
[![pages-build-deployment](https://github.com/seanmcnamee/HHHSite/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/seanmcnamee/HHHSite/actions/workflows/pages/pages-build-deployment)

Website available at [https://seanmcnamee.github.io/HHHSite/](https://seanmcnamee.github.io/HHHSite/)


## Development

### Running application
- Pull down repo to your machine.
- Ensure you have npm (v18.14.0) and the angular cli installed
- After pulling down the application, run `npm install` to locally download all node_modules
- Run application with `ng serve` or `npm run start`. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Developing Application

- Make sure you are working in a branch other than `main`
- Scaffold things with `ng generate component|directive|pipe|service|class|guard|interface|enum|module <NAME>`

### Pushing changes

- Ensure the following have no issues
   - `npm run start` is working, and everythin functions as expected
   - Ensure that `npm run lint` passes
   - Ensure that `npm run test:ci` passes
   - Ensure that `npm run e2e:ci` passes
- Push development branch
- Go through PR process in GitHub


## Template Usage

- Create new repo based on this Template repo
- Replace all mentions of `AngularBootstrapTemplate` with `HHHSite`
- Replace all mentions of `angular-bootstrap-template` with `hhh-site`
      - Notice that a capital letter is equivalent to a hyphen then the lowercase letter variant
- Replace the defined email with yours in `package.json`
- Create Access Token (for public repos)
    - User Settings > Developer Settings > Personal access tokens > Generate new token
	    - Select all repo scopes
	    - Generate token
	    - Copy value
- Add Secret to repo
    - Settings > Secrets > Actions > New repository secret
        - Paste value from personal access token
	    - Name: SEAN_ACCESS_TOKEN
        - A different name would require `.github\workflows\cd.yaml` to be updated 