/**
 * Centralised test data — update credentials here, not scattered across tests.
 */

const USERS = {
  STANDARD: {
    username: 'standard_user',
    password: 'secret_sauce',
    description: 'Standard user with full access',
  },
  LOCKED: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    description: 'Locked out — login should be blocked',
  },
  PROBLEM: {
    username: 'problem_user',
    password: 'secret_sauce',
    description: 'User that triggers various UI bugs',
  },
  GLITCH: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    description: 'User with artificially slow performance',
  },
};

const CHECKOUT_INFO = {
  VALID: {
    firstName: 'John',
    lastName: 'Doe',
    zip: '10001',
  },
  MISSING_FIRST: {
    firstName: '',
    lastName: 'Doe',
    zip: '10001',
  },
  MISSING_LAST: {
    firstName: 'John',
    lastName: '',
    zip: '10001',
  },
  MISSING_ZIP: {
    firstName: 'John',
    lastName: 'Doe',
    zip: '',
  },
};

const SORT_OPTIONS = {
  AZ:        { value: 'az',   label: 'Name (A to Z)' },
  ZA:        { value: 'za',   label: 'Name (Z to A)' },
  LOW_HIGH:  { value: 'lohi', label: 'Price (low to high)' },
  HIGH_LOW:  { value: 'hilo', label: 'Price (high to low)' },
};

const PRODUCTS = {
  BACKPACK: {
    name:  'Sauce Labs Backpack',
    price: 29.99,
  },
  BIKE_LIGHT: {
    name:  'Sauce Labs Bike Light',
    price: 9.99,
  },
  BOLT_T_SHIRT: {
    name:  'Sauce Labs Bolt T-Shirt',
    price: 15.99,
  },
  FLEECE_JACKET: {
    name:  'Sauce Labs Fleece Jacket',
    price: 49.99,
  },
  ONESIE: {
    name:  'Sauce Labs Onesie',
    price: 7.99,
  },
  T_SHIRT_RED: {
    name:  'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
  },
};

const EXPECTED_PRODUCT_COUNT = 6;

const ERROR_MESSAGES = {
  LOCKED_USER: 'Epic sadface: Sorry, this user has been locked out.',
  WRONG_CREDS:  'Epic sadface: Username and password do not match any user in this service',
  EMPTY_USER:   'Epic sadface: Username is required',
  EMPTY_PASS:   'Epic sadface: Password is required',
  CHECKOUT_FIRST_NAME: 'Error: First Name is required',
  CHECKOUT_LAST_NAME:  'Error: Last Name is required',
  CHECKOUT_ZIP:        'Error: Postal Code is required',
};

module.exports = {
  USERS,
  CHECKOUT_INFO,
  SORT_OPTIONS,
  PRODUCTS,
  EXPECTED_PRODUCT_COUNT,
  ERROR_MESSAGES,
};
