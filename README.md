# HHHSite
[![Angular GitHub CI Tests](https://github.com/seanmcnamee/HHHSite/actions/workflows/ci.yaml/badge.svg)](https://github.com/seanmcnamee/HHHSite/actions/workflows/ci.yaml)
[![Angular GitHub CI/CD](https://github.com/seanmcnamee/HHHSite/actions/workflows/cd.yaml/badge.svg)](https://github.com/seanmcnamee/HHHSite/actions/workflows/cd.yaml)

Website available at [https://seanmcnamee.github.io/HHHSite/](https://seanmcnamee.github.io/HHHSite/)


## Updating Healthcare Rates and Teacher Pay Schedule
### Healthcare Rates
Navigate to the [healthcare-rates-service](https://github.com/seanmcnamee/HHHSite/blob/main/src/app/common/services/healthcare-rates/healthcare-rates.service.ts): `src/app/common/services/healthcare-rates/healthcare-rates-service.ts`
- Update `ratesUpdateDate`
- Update `yearForRates`
- Update `rates`

### Teacher Pay Schedule
Navigate to the [teacher-pay-schedule](https://github.com/seanmcnamee/HHHSite/blob/main/src/app/common/services/teacher-pay-schedule/teacher-pay-schedule.service.ts): `src/app/common/services/teacher-pay-schedule/teacher-pay-schedule.service.ts`
- Update `updatedDate`
- Update `forSchoolYears`
- Update `FIRST_PAY_DATE`


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
