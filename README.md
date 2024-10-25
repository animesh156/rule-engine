
# Rule Engine Application

This is a simple 3-tier rule engine application built using React & DaisyUI on the frontend and Node.js/Express on the backend. It allows users to dynamically create, combine, and evaluate rules based on user-defined attributes like age, income, and department. The system uses Abstract Syntax Trees (AST) to represent rules, enabling flexible and dynamic rule management

## Features

-  Define rules using logical operators like >, <, =, AND, OR.
- Test the created rules with various inputs.
- Merge multiple rules into complex conditions.
- Retrieve and display all saved rules.
- Alerts for invalid rule inputs or server issues.


## Run Locally

Clone the project

```bash
  git clone https://github.com/animesh156/rule-engine.git
```

Go to the project directory

```bash
  cd rule-engine
```

Install dependencies

```bash
  cd client
  npm install
```
```bash
  cd server
  npm install
```

Start the server

```bash
  client
  npm run dev
```
```bash
  server
  node index.js
```

## How It Works

1. Create a Rule:
- Enter a rule string (e.g., age > 30 AND income < 50000) in the form.
- Click the Create Rule button to save it.

2. Evaluate a Rule:
- Navigate to the Evaluate page and enter input data for evaluation.

3. Combine Rules:
- On the Combine Rules page, select and merge multiple rules into a single condition.

4. View Rules:
- Navigate to View Rules to see all the saved rules.

