#!/bin/bash

if [ "$(find src -name '*.cypress.spec.js' | wc -l)" -eq 0 ]; then
  echo "No Cypress tests found."
  exit 0
else
  # Use the junit reporter & save results in './test-results'.
  reporterArgs="--reporter junit --reporter-options \"mochaFile=test-results/e2e-test-output-[hash].xml\""

  # Use headless Firefox for fastest test runs.
  browserArgs="--headless --browser firefox"
    
  # Use the CircleCI CLI to get Cypress tests & split them on different machines by timing. Commas are inserted as the delimiter for file paths.
  specArgs="--spec $(echo '"$(circleci tests glob "src/**/tests/**/*.cypress.spec.js" | circleci tests split --split-by=timings | paste -sd "," -)"')"

  # Start the web server & run Cypress tests.
  # Wait for http://localhost:3001/generated/style.css to finish bundling so Cypress doesn't start too soon.
  yarn start-server-and-test watch http-get://localhost:3001/generated/style.css "cypress run $reporterArgs"
fi