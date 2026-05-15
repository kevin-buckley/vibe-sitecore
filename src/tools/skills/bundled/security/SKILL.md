---
name: security
description: "Audit security configuration in Sitecore XM Cloud: roles, user accounts, passwords, upload restrictions, admin accounts, and access controls. Trigger phrases: security audit, role review, password check, admin account review, upload restrictions, access control."
category: project-review
---

# Security

Use this skill to audit security configuration in a Sitecore XM Cloud SXA Headless project.

## Checks — Roles and Users

### Break inheritance rather than explicitly deny access rights
**Severity:** Minor
**What to verify:** Content access is managed by breaking inheritance at the appropriate level rather than using explicit deny rules that create complex permission conflicts.
**Issue indicators:** Deny rules scattered throughout the tree creating hard-to-debug access issues, permissions that work differently than expected due to deny overrides.
**Recommendation:** Use inheritance breaking to restrict access. Apply allow rules to roles that need access below the break point.

### Apply security to roles rather than users
**Severity:** Major
**What to verify:** All access rights are assigned to roles, not directly to individual user accounts. Users gain permissions by role membership.
**Issue indicators:** Individual users with custom access rights, permissions that break when staff changes occur.
**Recommendation:** Create role-based security. Assign all permissions to roles. Add users to appropriate roles. Never assign access rights directly to user accounts.

### Limit access to parts of the content tree
**Severity:** Minor
**What to verify:** Content editors only have access to the content areas they manage. Authors for Site A cannot edit Site B content.
**Issue indicators:** All editors have access to the entire content tree, no content segmentation by team/site.
**Recommendation:** Create per-site or per-team roles with access restricted to their content area. Break inheritance at site boundaries.

### Limit access to the ribbon items relevant to the user
**Severity:** Minor
**What to verify:** The editing interface only shows tools and options relevant to each role. Content authors don't see developer tools; approvers see workflow actions.
**Issue indicators:** All users see the full admin interface regardless of role.
**Recommendation:** Use access viewer to configure which ribbon sections each role can see. Simplify the editor experience per role.

### No users should have empty or obvious passwords
**Severity:** Major
**What to verify:** All user accounts have strong passwords. No accounts use default, empty, or easily guessed passwords.
**Issue indicators:** Accounts with password "admin", "password", empty password, or site name as password.
**Recommendation:** Enforce password complexity requirements. Audit existing accounts for weak passwords. In XMC, prefer SSO/Azure AD authentication over local accounts.

### Use profile settings to specify the interface users will log into
**Severity:** Minor
**What to verify:** User profiles are configured so editors log into the appropriate start location (Pages editor, Content Editor, or specific content section).
**Issue indicators:** All users land on the same start screen regardless of their role, editors navigating to find their content area each session.
**Recommendation:** Configure user profiles with appropriate start URLs and default content locations.

### Administrator accounts should only be used for administrative tasks
**Severity:** Major
**What to verify:** Admin accounts are not used for daily content editing. Separate accounts exist for administration vs. content authoring.
**Issue indicators:** Content authored and published by the "admin" account, admin accounts used as the default editing accounts.
**Recommendation:** Create separate non-admin accounts for content work. Use admin accounts only for system configuration and troubleshooting.

### Disable the default administrator account
**Severity:** Major
**What to verify:** The default `sitecore\admin` account is disabled or has its password changed from the default in all environments.
**Issue indicators:** Default admin account active with default password on any accessible environment.
**Recommendation:** In XMC, use SSO authentication. Disable or strongly re-password any default admin accounts. Use named admin accounts for audit trails.

## Checks — Application Security

### Control what can be uploaded to the system
**Severity:** Major
**What to verify:** Media upload restrictions are configured to prevent dangerous file types (executable, scripts) from being uploaded to the media library.
**Issue indicators:** No file type restrictions on uploads, ability to upload `.exe`, `.aspx`, `.ps1` files.
**Recommendation:** Configure allowed media file extensions. Block executable and script file types. In XMC, media is served through Edge CDN and not executed, but restricting uploads prevents confusion and potential issues.

### Minimize the use of SecurityDisabler
**Severity:** Major
**What to verify:** Custom code does not use `SecurityDisabler` or elevated privileges unless absolutely necessary and properly scoped.
**Issue indicators:** SecurityDisabler used broadly in custom code, security bypass in background jobs or API handlers.
**Recommendation:** Avoid SecurityDisabler in custom code. If needed, scope it to the minimum necessary operation and document why. In XMC headless apps, this primarily applies to custom CM-side code (scripts, event handlers).

### SQL injection risk
**Severity:** Major
**What to verify:** No custom code constructs SQL queries by string concatenation with user input. All database access uses parameterized queries or ORMs.
**Issue indicators:** String-interpolated SQL queries with user-supplied values.
**Recommendation:** Always use parameterized queries. In XMC headless projects, this primarily applies to any custom API endpoints or server actions that access databases.

### Encryption
**Severity:** Minor
**What to verify:** Sensitive data in transit uses TLS. Connection strings and API keys are stored securely (environment variables, key vaults) not in source code.
**Issue indicators:** API keys or connection strings committed to source control, HTTP (non-TLS) connections to services.
**Recommendation:** Store secrets in environment variables or Azure Key Vault. Ensure all service connections use TLS. Never commit secrets to git.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/security-overview.html
