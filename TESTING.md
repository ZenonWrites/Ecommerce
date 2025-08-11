# Testing Strategy

This document outlines the testing strategy for the E-commerce application, covering both backend and frontend testing approaches.

## Table of Contents

1. [Backend Testing](#backend-testing)
   - [Unit Tests](#unit-tests)
   - [Integration Tests](#integration-tests)
   - [Security Tests](#security-tests)
   - [Performance Tests](#performance-tests)

2. [Frontend Testing](#frontend-testing)
   - [Component Tests](#component-tests)
   - [Integration Tests](#frontend-integration-tests)
   - [End-to-End Tests](#end-to-end-tests)
   - [Security Tests](#frontend-security-tests)
   - [Performance Tests](#frontend-performance-tests)

3. [Running Tests](#running-tests)
   - [Backend Tests](#running-backend-tests)
   - [Frontend Tests](#running-frontend-tests)
   - [CI/CD Integration](#ci-cd-integration)

4. [Test Coverage](#test-coverage)

## Backend Testing

### Unit Tests

Unit tests focus on testing individual components in isolation. These tests are fast and should not make any external calls.

- **Location**: `backend/main/tests/unit/`
- **Coverage**: Models, serializers, utility functions
- **Frameworks**: pytest, factory_boy

### Integration Tests

Integration tests verify that different parts of the system work together correctly.

- **Location**: `backend/main/tests/integration/`
- **Coverage**: API endpoints, database interactions
- **Frameworks**: pytest, Django TestCase

### Security Tests

Security tests ensure the application is protected against common vulnerabilities.

- **Location**: `backend/main/tests/security/`
- **Coverage**: Authentication, authorization, input validation
- **Frameworks**: pytest, Django TestCase

### Performance Tests

Performance tests measure the system's responsiveness and stability under load.

- **Location**: `backend/locustfile.py`
- **Coverage**: API response times, database queries
- **Frameworks**: Locust

## Frontend Testing

### Component Tests

Component tests verify that individual UI components render and behave as expected.

- **Location**: `front/src/components/__tests__/`
- **Coverage**: React components, props, state
- **Frameworks**: Jest, React Testing Library

### Integration Tests

Integration tests verify that components work together correctly.

- **Location**: `front/cypress/e2e/`
- **Coverage**: User flows, component interactions
- **Frameworks**: Cypress

### End-to-End Tests

End-to-end tests verify complete user flows from start to finish.

- **Location**: `front/cypress/e2e/`
- **Coverage**: Critical user journeys
- **Frameworks**: Cypress

### Security Tests

Security tests ensure the frontend is protected against common vulnerabilities.

- **Location**: `front/cypress/e2e/security.cy.js`
- **Coverage**: XSS, CSRF, input validation
- **Frameworks**: Cypress

### Performance Tests

Performance tests measure the frontend's responsiveness and loading times.

- **Location**: `front/cypress/e2e/performance.cy.js`
- **Coverage**: Page load times, rendering performance
- **Frameworks**: Cypress, Lighthouse

## Running Tests

### Running Backend Tests

1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Run all tests:
   ```bash
   pytest
   ```

3. Run tests with coverage:
   ```bash
   pytest --cov=main tests/
   ```

4. Run performance tests:
   ```bash
   locust -f locustfile.py
   ```
   Then open http://localhost:8089 in your browser.

### Running Frontend Tests

1. Install dependencies:
   ```bash
   cd front
   npm install
   ```

2. Run component tests:
   ```bash
   npm test
   ```

3. Run Cypress tests in headed mode:
   ```bash
   npx cypress open
   ```

4. Run Cypress tests in headless mode:
   ```bash
   npx cypress run
   ```

5. Run performance tests:
   ```bash
   npx cypress run --spec "cypress/e2e/performance.cy.js"
   ```

### CI/CD Integration

#### GitHub Actions

Create `.github/workflows/tests.yml` with the following content:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r backend/requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest --cov=main --cov-report=xml
      - name: Upload coverage
        uses: codecov/codecov-action@v1
        with:
          file: backend/coverage.xml
          fail_ci_if_error: true

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: |
          cd front
          npm ci
      - name: Run tests
        run: |
          cd front
          npm test -- --coverage
          npx cypress run
      - name: Upload coverage
        uses: codecov/codecov-action@v1
        with:
          directory: front/coverage
          fail_ci_if_error: true
```

## Test Coverage

### Backend Coverage

To generate a coverage report for the backend:

```bash
cd backend
pytest --cov=main --cov-report=html
```

Open `backend/htmlcov/index.html` in your browser to view the coverage report.

### Frontend Coverage

To generate a coverage report for the frontend:

```bash
cd front
npm test -- --coverage
```

Open `front/coverage/lcov-report/index.html` in your browser to view the coverage report.

## Best Practices

1. **Write deterministic tests**: Tests should produce the same results every time they're run.
2. **Keep tests independent**: Each test should set up its own test data and clean up afterward.
3. **Test edge cases**: Include tests for error conditions and boundary values.
4. **Use meaningful test names**: Test names should clearly describe what's being tested.
5. **Keep tests fast**: Slow tests will be run less frequently.
6. **Mock external services**: Don't rely on external services in tests.
7. **Maintain test data**: Use factories to generate test data consistently.
8. **Run tests in CI**: Ensure all tests pass before merging code.

## Troubleshooting

### Backend Tests Failing

1. **Database issues**: Make sure the test database is properly set up.
   ```bash
   python manage.py migrate
   ```

2. **Missing dependencies**: Ensure all dependencies are installed.
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Tests Failing

1. **Dependencies**: Make sure all dependencies are installed.
   ```bash
   cd front
   npm install
   ```

2. **Cypress not installed**: If you see Cypress-related errors, try reinstalling it.
   ```bash
   cd front
   npx cypress install
   ```

3. **Test data**: Ensure the test data in `cypress/fixtures/` matches your API responses.

## License

This testing strategy is part of the E-commerce application and follows the same license as the main project.
