BEGIN;

ALTER TABLE work_orders
  ADD COLUMN IF NOT EXISTS completed_by INTEGER REFERENCES users(user_id),
  ADD COLUMN IF NOT EXISTS return_requested_by INTEGER REFERENCES users(user_id),
  ADD COLUMN IF NOT EXISTS return_requested_at TIMESTAMP;

CREATE TABLE IF NOT EXISTS return_service_decisions (
  decision_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  work_order_id INTEGER NOT NULL REFERENCES work_orders(work_order_id),
  approver_user_id INTEGER NOT NULL REFERENCES users(user_id),
  decision VARCHAR(20) NOT NULL CHECK (decision IN ('Approved', 'Denied')),
  reason TEXT NOT NULL,
  block_disposition VARCHAR(50) NOT NULL,
  decided_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS return_service_decisions_work_order_idx
  ON return_service_decisions(work_order_id, decided_at DESC);

COMMIT;
