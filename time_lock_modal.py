import re

file = 'frontend/src/components/MaintenanceModal.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the text "October 1st, 2026" with "Today Morning" since they wanted that earlier
c = c.replace('October 1st, 2026', 'Today Morning')

# Add the time-lock condition
time_lock_code = """
  // Render resets the free tier at exactly Midnight UTC on the 1st of the month.
  // That is October 1, 2026 at 00:00:00 UTC (5:30 AM IST).
  const renderResetTimeUTC = new Date('2026-10-01T00:00:00Z').getTime();
  const isServerOffline = Date.now() < renderResetTimeUTC;

  // If the server is no longer offline, hide the modal entirely!
  if (!isServerOffline) {
    return null;
  }
"""

# Find where to inject it (right before checking requiresBackend)
c = c.replace('// Check if the current page requires the backend\n  const requiresBackend', time_lock_code + '\n  // Check if the current page requires the backend\n  const requiresBackend')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Added time-lock to Maintenance Modal")
