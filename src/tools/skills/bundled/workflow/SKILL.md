---
name: workflow
description: "Audit Sitecore XM Cloud workflow configuration: states, security, notifications, publishing restrictions, and simplicity. Trigger phrases: workflow audit, publishing review, workflow security, notification check, workflow states."
category: project-review
---

# Workflow

Use this skill to audit workflow configuration in a Sitecore XM Cloud SXA Headless project.

## Checks

### Workflow is enabled
**Severity:** Minor
**What to verify:** A content workflow is configured and assigned to content templates via Standard Values. Content goes through review before publishing.
**Issue indicators:** No workflow assigned — editors can publish immediately without review, no approval process for content changes.
**Recommendation:** Configure at least a basic Draft → Review → Approved workflow. Assign it to content template Standard Values.

### Workflow has appropriate security
**Severity:** Major
**What to verify:** Workflow state transitions are restricted by role. Only authorized roles can approve, reject, or publish content.
**Issue indicators:** All editors can execute all workflow commands, no separation between authors and approvers.
**Recommendation:** Restrict workflow commands by role: Authors can submit for review, Reviewers can approve/reject, Publishers can publish. Use workflow action security settings.

### Minimize the number of states utilizing email notification
**Severity:** Minor
**What to verify:** Email notifications are configured only for critical state transitions (submitted for review, rejected) not for every minor state change.
**Issue indicators:** Notification emails sent on every workflow state change causing notification fatigue.
**Recommendation:** Limit email notifications to actionable transitions: item needs review, item rejected. Use in-app notifications or workbox for routine transitions.

### Simplify workflows
**Severity:** Minor
**What to verify:** Workflows have the minimum number of states needed. Complex multi-stage approvals are only used when business requirements mandate them.
**Issue indicators:** Workflows with 7+ states, multiple parallel approval paths, states that items routinely skip.
**Recommendation:** Keep workflows simple: 3-4 states is typical (Draft, In Review, Approved, Published). Add complexity only when business process requires it.

### Workflow has final state
**Severity:** Minor
**What to verify:** Workflows have a clearly defined final/approved state. Items in the final state are eligible for publishing.
**Issue indicators:** Workflows with no clear terminal state, items stuck in intermediate states unable to publish.
**Recommendation:** Define a final workflow state. Configure auto-publish on reaching final state, or ensure publishers know which state indicates "ready to publish."

### Publishing restricted to specific roles
**Severity:** Major
**What to verify:** Only designated roles can trigger content publishing. Regular content editors submit work through workflow rather than publishing directly.
**Issue indicators:** All editors have publish access, content published without review, workflow bypassed via direct publish.
**Recommendation:** Restrict publish access to Publisher/Admin roles. Content editors submit through workflow. In XMC, publishing pushes to Experience Edge — restrict who can trigger this.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/workflows.html
