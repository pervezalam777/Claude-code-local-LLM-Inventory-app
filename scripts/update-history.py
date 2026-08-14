#!/usr/bin/env python3
"""
Update historical coverage trend data.
"""

import json
import os
from datetime import datetime


def update_history():
    """Append current metrics to historical trend data."""
    history_dir = ".sonarqube/history"
    report_path = ".sonarqube/combined/coverage-report.json"

    # Load current report
    with open(report_path) as f:
        current = json.load(f)

    # Create history entry
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "date": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "metrics": {
            "python_line_coverage": float(current.get("python_coverage", {}).get("line_rate", 0)) * 100,
            "js_statement_coverage": float(current.get("js_coverage", {}).get("statements", {}).get("pct", 0)),
            "js_branch_coverage": float(current.get("js_coverage", {}).get("branches", {}).get("pct", 0)),
        }
    }

    # Load existing history or create new
    history_file = f"{history_dir}/trend.json"
    if os.path.exists(history_file):
        with open(history_file) as f:
            history = json.load(f)
    else:
        history = {"entries": []}

    # Add entry
    history["entries"].append(entry)

    # Keep only last 50 entries
    if len(history["entries"]) > 50:
        history["entries"] = history["entries"][-50:]

    # Save updated history
    with open(history_file, "w") as f:
        json.dump(history, f, indent=2)

    print(f"Historical trend data saved to {history_file}")
    return entry


if __name__ == "__main__":
    update_history()
