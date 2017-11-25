We've create a full CRUD-y REST-ish HTTP API satisfying our jargon requirements. Before we deploy this to `staging` we need to lock the security down.

---
### 1. Authentication

This is a stateful API, as in, we have a session. Similar to the HTML routes create `src/shared/protect.js` middleware to lock down your routes.

---
### 2. Parameter Sanitization and Validation

A common attack vector is to post malicious data to HTTP API endpoints. There are many libraries for input santization and parameter validation. Make sure all the writes have check for cross site scripting and proper values. A few libraries to try out:

- xss
- smallwins/validate
- joi

---
### 3. CSRF Checking

JSF Architect bakes in support for CSRF checks.

---
