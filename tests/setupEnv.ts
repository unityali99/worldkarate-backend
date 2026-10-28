// Test environment bootstrap: provide deterministic secrets and disable
// network/production behavior so middleware and services can run offline.
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.ROUNDS = "4";
delete process.env.ENV_MODE;
