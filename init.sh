#!/bin/bash
# Verification gate. Runs every check, reports a summary, exits 1 if any failed.
# Deliberately NOT `set -e`: a red typecheck must not hide a red lint.

FAILED=""

run_check() {
  local label="$1"
  shift
  echo ""
  echo "=== $label ==="
  if "$@"; then
    echo "--- $label: PASS"
  else
    echo "--- $label: FAIL"
    FAILED="$FAILED $label"
  fi
}

echo "=== Harness Initialization ==="

run_check typecheck bun run typecheck
run_check lint      bun run lint
run_check tests     bunx vitest run

echo ""
echo "=== Verification Summary ==="
if [ -n "$FAILED" ]; then
  echo "FAILED:$FAILED"
  echo ""
  echo "A red baseline is expected until feat-001 / PLT-001 lands."
  echo "Compare against the recorded baseline in progress.md before assuming you caused it."
  exit 1
fi

echo "All checks passed."
echo ""
echo "Next steps:"
echo "1. Read feature_list.json — pick the module whose dependencies are all done"
echo "2. Read docs/modules/<module>/context.md + feature_list.json"
echo "3. Pick ONE unblocked item and implement only that item"
echo "4. Re-run ./init.sh and record the output in the item's evidence field"
