# SiteTrack Punch List Status

## Implemented changes

- Empty-state guidance and unavailable-action disabling.
- Duplicate-submission protection for assignment, inspection, damage, and maintenance actions.
- Server-side checkout blocking for unavailable tools and inactive jobsites.
- Active-jobsite and valid-transfer filtering in the client.
- Safe API validation messages displayed to users.
- Failed inspections remove tools from service.
- Damage reports remove tools from service and open a repair work order when no active order exists.
- Work orders use an active Maintenance Technician selector and reject duplicate active orders.
- Return-to-service request, approval, denial, decision reason, audit event, and alert flow.
- Maintenance blocks clear only after approval.
- Repair completers cannot decide their own return-to-service request.
- Worker inspection access and Safety Personnel review access for inspections, maintenance, reports, approvals, and audit history.
- Next-inspection dates cannot be in the past.
- Automated domain-rule tests and documented database migration command.

## Required before deployment

1. Review the branch changes with the group.
2. Back up the hosted Neon database.
3. From the `server` folder, run `npm run migrate:return-service` against the intended database.
4. Merge through `develop`, then follow the group's normal release process to `main`.
5. Confirm the Render deployment succeeds.

## Hosted acceptance test after deployment

- Test Administrator, Equipment Manager, Maintenance Technician, Worker, and Safety Personnel accounts.
- Create an active jobsite and complete checkout, transfer, and return.
- Confirm blocked-tool and inactive-jobsite requests are rejected through both the interface and API.
- Submit a failed inspection and a damage report; verify tool state, work order, alert, and audit records.
- Complete repair, request return review, deny once, complete again, then approve with a different authorized user.
- Verify the approval history remains visible and the tool becomes Available only after approval.
- Verify every report and CSV export against the created records.
- Recheck direct-route authorization, mobile layouts, keyboard operation, zoom, session expiration, and logout.

These acceptance tests intentionally remain pending until the migration and branch are deployed; running them now would modify the shared hosted database.
