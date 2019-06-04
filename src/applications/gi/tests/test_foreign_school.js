const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');

const Onlinecheck =
  '#accordion-item-14 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > div.total-paid-to-you > div:nth-child(1) > div.small-6.columns.value > h5';
const Inpersoncheck =
  '#accordion-item-14 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > div.total-paid-to-you > div:nth-child(1) > div.small-6.columns.value > h5';
const Inpersonandonlinecheck =
  '#accordion-item-14 > div > div.usa-width-one-half.medium-6.columns.your-estimated-benefits > div.total-paid-to-you > div:nth-child(1) > div.small-6.columns.value > h5';

module.exports = E2eHelpers.createE2eTest(client => {
  GiHelpers.initApplicationMock();

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  E2eHelpers.overrideSmoothScrolling(client);
  client.timeoutsAsyncScript(2000);

  client
    .waitForElementVisible('body', Timeouts.verySlow)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');

  // check Foreign DOD and VA rate for online only
  GiHelpers.ForeignOnlineOnly(client);
  client
    .waitForElementVisible('body', 1000)
    .assert.containsText(
      Onlinecheck,
      `${GiHelpers.formatCurrencyHalf(
        GiHelpers.calculatorConstantsList.AVGDODBAH,
      )}/mo`,
    )
    .axeCheck('.main');

  client
    .click('#radio-buttons-16-0')
    .pause(100)
    .assert.containsText(
      Onlinecheck,
      `${GiHelpers.formatCurrencyHalf(
        GiHelpers.calculatorConstantsList.AVGVABAH,
      )}/mo`,
    );

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  client
    .waitForElementVisible('body', Timeouts.verySlow)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');

  // check Foreign DOD and VA rate for in person only
  GiHelpers.ForeignInPersonOnly(client);
  client
    .waitForElementVisible('body', 1000)
    .assert.containsText(
      Inpersoncheck,
      `${GiHelpers.formatCurrency(
        GiHelpers.calculatorConstantsList.AVGDODBAH,
      )}/mo`,
    )
    .axeCheck('.main');

  client
    .click('#radio-buttons-16-0')
    .pause(100)
    .assert.containsText(
      Inpersoncheck,
      `${GiHelpers.formatCurrency(
        GiHelpers.calculatorConstantsList.AVGVABAH,
      )}/mo`,
    );

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  client
    .waitForElementVisible('body', Timeouts.verySlow)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');

  // check Foreign DOD and VA rate for In person and online
  GiHelpers.ForeignInPersonAndOnline(client);
  client
    .waitForElementVisible('body', 1000)
    .assert.containsText(
      Inpersonandonlinecheck,
      `${GiHelpers.formatCurrency(
        GiHelpers.calculatorConstantsList.AVGDODBAH,
      )}/mo`,
    )
    .axeCheck('.main');

  client
    .click('#radio-buttons-16-0')
    .pause(100)
    .assert.containsText(
      Inpersonandonlinecheck,
      `${GiHelpers.formatCurrency(
        GiHelpers.calculatorConstantsList.AVGVABAH,
      )}/mo`,
    );

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  client
    .waitForElementVisible('body', Timeouts.verySlow)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');

  // check US DOD and VA rate for online only
  GiHelpers.USOnlineOnly(client);
  client
    .waitForElementVisible('body', 1000)
    .assert.containsText(
      Onlinecheck,
      `${GiHelpers.formatCurrencyHalf(
        GiHelpers.calculatorConstantsList.AVGDODBAH,
      )}/mo`,
    )
    .axeCheck('.main');

  client
    .click('#radio-buttons-17-0')
    .pause(100)
    .assert.containsText(
      Onlinecheck,
      `${GiHelpers.formatCurrencyHalf(
        GiHelpers.calculatorConstantsList.AVGVABAH,
      )}/mo`,
    );

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  client
    .waitForElementVisible('body', Timeouts.verySlow)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');

  // check US DOD and VA rate for in person only
  GiHelpers.USInPersonOnly(client);
  client
    .waitForElementVisible('body', 1000)
    .assert.containsText(
      Inpersoncheck,
      `${GiHelpers.formatCurrency(
        GiHelpers.schools.data[1].attributes.dodBah,
      )}/mo`,
    )
    .axeCheck('.main');

  client
    .click('#radio-buttons-17-0')
    .pause(100)
    .assert.containsText(
      Inpersoncheck,
      `${GiHelpers.formatCurrency(
        GiHelpers.schools.data[1].attributes.bah,
      )}/mo`,
    );

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  client
    .waitForElementVisible('body', Timeouts.verySlow)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');

  // check US DOD and VA rate for in person and online
  GiHelpers.USInPersonAndOnline(client);
  client
    .waitForElementVisible('body', 1000)
    .assert.containsText(
      Inpersoncheck,
      `${GiHelpers.formatCurrency(
        GiHelpers.schools.data[1].attributes.dodBah,
      )}/mo`,
    )
    .axeCheck('.main');

  client
    .click('#radio-buttons-17-0')
    .pause(100)
    .assert.containsText(
      Inpersoncheck,
      `${GiHelpers.formatCurrency(
        GiHelpers.schools.data[1].attributes.bah,
      )}/mo`,
    );

  client.end();
});
