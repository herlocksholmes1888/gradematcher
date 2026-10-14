# Graph Report - .  (2026-10-14)

## Corpus Check
- Corpus is ~37,531 words - fits in a single context window. You may not need a graph.

## Summary
- 247 nodes · 331 edges · 23 communities (13 shown, 10 thin omitted)
- Extraction: 79% EXTRACTED · 20% INFERRED · 1% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.8)
- Token cost: 786,147 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Supabase Postgres Skill - Changelog & Overview|Supabase Postgres Skill - Changelog & Overview]]
- [[_COMMUNITY_Postgres Query, Index & RLS Techniques|Postgres Query, Index & RLS Techniques]]
- [[_COMMUNITY_GradeMatcher Frontend Pages (src)|GradeMatcher Frontend Pages (src/)]]
- [[_COMMUNITY_Backend Auth System (ExpressMongoose)|Backend Auth System (Express/Mongoose)]]
- [[_COMMUNITY_Supabase Skill Docs (.agents copy)|Supabase Skill Docs (.agents copy)]]
- [[_COMMUNITY_Supabase Skill Docs (.claude copy)|Supabase Skill Docs (.claude copy)]]
- [[_COMMUNITY_Server package.json Metadata|Server package.json Metadata]]
- [[_COMMUNITY_Postgres Best-Practices Reference Docs|Postgres Best-Practices Reference Docs]]
- [[_COMMUNITY_GradeMatcher Client Auth Pages (client)|GradeMatcher Client Auth Pages (client/)]]
- [[_COMMUNITY_Client package.json Metadata|Client package.json Metadata]]
- [[_COMMUNITY_Postgres Skill Writing Guidelines|Postgres Skill Writing Guidelines]]
- [[_COMMUNITY_Postgres Schema & Primary Key Conventions|Postgres Schema & Primary Key Conventions]]
- [[_COMMUNITY_Supabase MCP Tooling Config|Supabase MCP Tooling Config]]
- [[_COMMUNITY_Project Package Names|Project Package Names]]
- [[_COMMUNITY_MCP Server Reference|MCP Server Reference]]
- [[_COMMUNITY_Queue Pattern (SKIP LOCKED)|Queue Pattern (SKIP LOCKED)]]
- [[_COMMUNITY_Favicon Icon (192x192)|Favicon Icon (192x192)]]
- [[_COMMUNITY_Favicon Icon (512x512)|Favicon Icon (512x512)]]
- [[_COMMUNITY_Favicon Icon (Apple Touch)|Favicon Icon (Apple Touch)]]
- [[_COMMUNITY_Favicon Icon (16x16)|Favicon Icon (16x16)]]
- [[_COMMUNITY_Favicon Icon (32x32)|Favicon Icon (32x32)]]
- [[_COMMUNITY_GradeMatcher App Logo|GradeMatcher App Logo]]
- [[_COMMUNITY_Frontend Entry Point (orphan)|Frontend Entry Point (orphan)]]

## God Nodes (most connected - your core abstractions)
1. `Supabase Skill (.agents copy)` - 18 edges
2. `Supabase Skill (.claude copy)` - 18 edges
3. `Supabase Postgres Best Practices Skill` - 15 edges
4. `Rule Reference Template` - 14 edges
5. `Writing Guidelines for Postgres References` - 9 edges
6. `Supabase Postgres Best Practices Skill` - 8 edges
7. `register()` - 7 edges
8. `login()` - 7 edges
9. `User` - 6 edges
10. `router` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Cadastro handleSubmit` --semantically_similar_to--> `register()`  [INFERRED] [semantically similar]
  client/src/pages/Cadastro.jsx → server/controllers/authController.js
- `Login handleSubmit` --semantically_similar_to--> `login()`  [INFERRED] [semantically similar]
  client/src/pages/Login.jsx → server/controllers/authController.js
- `Supabase Postgres Best Practices Skill (lock entry)` --conceptually_related_to--> `Supabase MCP Server Config`  [INFERRED]
  skills-lock.json → .mcp.json
- `Supabase Skill (lock entry)` --conceptually_related_to--> `Supabase MCP Server Config`  [INFERRED]
  skills-lock.json → .mcp.json
- `tcc-sistema (Client Package)` --conceptually_related_to--> `gradematcher-server (Server Package)`  [INFERRED]
  client/package.json → server/package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Authentication Flow (Server)** — routes_auth_router, controllers_authcontroller_register, controllers_authcontroller_login, controllers_authcontroller_getprofile, middleware_auth_protect, utils_helpers_generatetoken, utils_helpers_validateemail, models_user_user [EXTRACTED 1.00]
- **Frontend Auth Form Stubs (No Backend Wiring)** — pages_login_login, pages_login_handlesubmit, pages_cadastro_cadastro, pages_cadastro_handlesubmit [INFERRED 0.75]
- **Supabase Tooling Configuration** — claude_settings_local_config, mcp_supabase_server, skills_lock_supabase_skill, skills_lock_supabase_postgres_best_practices_skill [INFERRED 0.75]
- **User profile and grades feeding job recommendations** — pages_userpage, pages_gradespage, pages_recommendedjobs [INFERRED 0.80]
- **Search bar to search results navigation via query param** — src_app, components_navbar, pages_searchpage [INFERRED 0.85]
- **Shared job-listing display pattern across pages** — pages_jobpage, pages_recommendedjobs, pages_companypage [INFERRED 0.75]
- **Connection Management Rule Set** — references__sections_conn, references_conn_idle_timeout_configure_idle_connection_timeouts, references_conn_limits_set_appropriate_connection_limits, references_conn_pooling_use_connection_pooling, references_conn_prepared_statements_use_prepared_statements_correctly [INFERRED 0.85]
- **Concurrency & Locking Rule Set** — references__sections_lock, references_lock_advisory_use_advisory_locks, references_lock_deadlock_prevention_prevent_deadlocks, references_lock_short_transactions_keep_transactions_short [INFERRED 0.85]
- **Rule Authoring Template Pattern** — references__template_rule_template, references__contributing_writing_guidelines, references_advanced_full_text_search_use_tsvector_for_full_text_search [INFERRED 0.75]
- **Choosing Index Types for Query Patterns** — references_query_index_types_btree, references_query_index_types_gin, references_query_index_types_gist, references_query_index_types_brin, references_query_index_types_hash [INFERRED 0.80]
- **Secure and Performant RLS Design** — references_security_rls_basics_rls, references_security_rls_performance_rls_performance, references_security_rls_performance_security_definer [INFERRED 0.80]
- **Index Optimization Strategies for Query Performance** — references_query_missing_indexes_missing_indexes, references_query_composite_indexes_composite_index, references_query_covering_indexes_covering_index, references_query_partial_indexes_partial_index, references_schema_foreign_key_indexes_fk_index [INFERRED 0.75]
- **Connection Management Rule Category** — supabase_postgres_best_practices_skill, references_conn_idle_timeout, references_conn_limits, references_conn_pooling, references_conn_prepared_statements [EXTRACTED 1.00]
- **Concurrency & Locking Rule Category** — supabase_postgres_best_practices_skill, references_lock_advisory, references_lock_deadlock_prevention, references_lock_short_transactions [EXTRACTED 1.00]
- **Data Access Patterns Rule Category** — supabase_postgres_best_practices_skill, references_data_batch_inserts, references_data_n_plus_one, references_data_pagination, references_data_upsert [EXTRACTED 1.00]
- **Index Design Techniques for Query Optimization** — references_query_composite_indexes_composite_index, references_query_covering_indexes_covering_index, references_query_partial_indexes_partial_index [INFERRED 0.75]
- **Postgres Query Performance Diagnostics Toolkit** — references_monitor_explain_analyze_explain_analyze, references_monitor_pg_stat_statements_pg_stat_statements, references_monitor_vacuum_analyze_vacuum [INFERRED 0.75]
- **Secure and Performant Row Level Security Pattern** — references_security_rls_basics_rls, references_security_rls_performance_rls_performance, references_security_rls_performance_security_definer [INFERRED 0.80]
- **Supabase Security Checklist Pitfalls (.agents copy)** — agents_security_definer, agents_bola_idor, agents_auth_role_deprecated, agents_storage_upsert [INFERRED 0.75]
- **Supabase Security Checklist Pitfalls (.claude copy)** — claude_security_definer, claude_bola_idor, claude_auth_role_deprecated, claude_storage_upsert [INFERRED 0.75]

## Communities (23 total, 10 thin omitted)

### Community 0 - "Supabase Postgres Skill - Changelog & Overview"
Cohesion: 0.11
Nodes (29): Advanced Features (advanced), Connection Management (conn), Data Access Patterns (data), Concurrency & Locking (lock), Monitoring & Diagnostics (monitor), Query Performance (query), Schema Design (schema), Security & RLS (security) (+21 more)

### Community 1 - "Postgres Query, Index & RLS Techniques"
Cohesion: 0.10
Nodes (27): EXPLAIN ANALYZE, pg_stat_statements, ANALYZE, Autovacuum Tuning, VACUUM, VACUUM and ANALYZE, Composite Index Column Order Rationale, Composite Index (+19 more)

### Community 2 - "GradeMatcher Frontend Pages (src/)"
Cohesion: 0.13
Nodes (14): handleSearch, Navbar(), CompanyPage(), addSubject, calculateAverage, GradesPage(), updateSubject, JobPage() (+6 more)

### Community 3 - "Backend Auth System (Express/Mongoose)"
Cohesion: 0.18
Nodes (15): connectDB(), getProfile(), login(), register(), errorHandler(), protect(), User.matchPassword, User pre-save password hash hook (+7 more)

### Community 4 - "Supabase Skill Docs (.agents copy)"
Cohesion: 0.16
Nodes (21): supabase/agent-skills Repository, apply_migration Tool Misuse Rationale, auth.role() Deprecation Rationale, BOLA/IDOR via TO authenticated Alone, Supabase Data API, Exposing Tables to Data API Rationale, Declarative Schemas Workflow, execute_sql MCP Tool (+13 more)

### Community 5 - "Supabase Skill Docs (.claude copy)"
Cohesion: 0.16
Nodes (21): supabase/agent-skills Repository, apply_migration Tool Misuse Rationale, auth.role() Deprecation Rationale, BOLA/IDOR via TO authenticated Alone, Supabase Data API, Exposing Tables to Data API Rationale, Declarative Schemas Workflow, execute_sql MCP Tool (+13 more)

### Community 6 - "Server package.json Metadata"
Cohesion: 0.10
Nodes (20): author, dependencies, bcryptjs, cors, dotenv, express, jsonwebtoken, mongoose (+12 more)

### Community 7 - "Postgres Best-Practices Reference Docs"
Cohesion: 0.16
Nodes (18): Use tsvector for Full-Text Search, Index JSONB Columns for Efficient Querying, Configure Idle Connection Timeouts, Set Appropriate Connection Limits, Use Connection Pooling for All Applications, Use Prepared Statements Correctly with Pooling, Writing Guidelines for Postgres References, Batch INSERT Statements for Bulk Data (+10 more)

### Community 8 - "GradeMatcher Client Auth Pages (client/)"
Cohesion: 0.18
Nodes (9): Client index.html Entry, Cadastro(), Cadastro handleSubmit, Home(), Login handleSubmit, Login(), App, App Component (Router Root) (+1 more)

### Community 9 - "Client package.json Metadata"
Cohesion: 0.12
Nodes (15): dependencies, react, react-dom, react-router-dom, devDependencies, vite, @vitejs/plugin-react, name (+7 more)

### Community 10 - "Postgres Skill Writing Guidelines"
Cohesion: 0.22
Nodes (9): Concrete Transformation Patterns, Error-First Structure, Impact Level Guidelines, Quantified Impact, Reference Standards, Review Checklist, Self-Contained Examples, Semantic Naming (+1 more)

### Community 11 - "Postgres Schema & Primary Key Conventions"
Cohesion: 0.33
Nodes (6): Appropriate Data Types, Lowercase Identifier Convention, IDENTITY Column, Primary Key Strategy, UUIDv4 Index Fragmentation Rationale, UUIDv7 (Time-Ordered UUID)

### Community 12 - "Supabase MCP Tooling Config"
Cohesion: 0.50
Nodes (4): Claude Settings (local), Supabase MCP Server Config, Supabase Postgres Best Practices Skill (lock entry), Supabase Skill (lock entry)

## Ambiguous Edges - Review These
- `router` → `app`  [AMBIGUOUS]
  server/server.js · relation: references
- `Appropriate Data Types` → `Lowercase Identifier Convention`  [AMBIGUOUS]
  .claude/skills/supabase-postgres-best-practices/references/schema-lowercase-identifiers.md · relation: conceptually_related_to

## Knowledge Gaps
- **75 isolated node(s):** `supabase`, `name`, `private`, `version`, `type` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `router` and `app`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Appropriate Data Types` and `Lowercase Identifier Convention`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Rule Reference Template` connect `Supabase Postgres Skill - Changelog & Overview` to `Postgres Skill Writing Guidelines`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `Writing Guidelines for Postgres References` connect `Postgres Skill Writing Guidelines` to `Supabase Postgres Skill - Changelog & Overview`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `Rule Reference Template` (e.g. with `Writing Guidelines for Postgres References` and `Use tsvector for Full-Text Search`) actually correct?**
  _`Rule Reference Template` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `name`, `private` to the rest of the system?**
  _85 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Supabase Postgres Skill - Changelog & Overview` be split into smaller, more focused modules?**
  _Cohesion score 0.10837438423645321 - nodes in this community are weakly interconnected._