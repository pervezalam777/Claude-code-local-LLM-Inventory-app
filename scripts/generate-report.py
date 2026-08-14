#!/usr/bin/env python3
"""
Generate combined coverage report from Python and JavaScript sources.
"""

import json
import os
from datetime import datetime


def generate_combined_report():
    """Merge Python and JS coverage reports into a unified format."""
    report_dir = ".sonarqube/coverage-js"
    history_dir = ".sonarqube/history"

    # Create output directory
    os.makedirs(".sonarqube/combined", exist_ok=True)

    combined = {
        "timestamp": datetime.utcnow().isoformat(),
        "python_coverage": None,
        "js_coverage": None,
    }

    # Read Python coverage.xml if exists
    cov_file = "inventory_app/coverage.xml"
    if os.path.exists(cov_file):
        import xml.etree.ElementTree as ET

        tree = ET.parse(cov_file)
        root = tree.getroot()
        totals = root.find(".//total")
        if totals is not None:
            combined["python_coverage"] = {
                "line_rate": float(totals.get("line-rate", 0)),
                "branches": float(totals.get("branches", 0)),
                "covered_lines": int(totals.get("covered-lines", 0)),
                "lines": int(totals.get("lines", 0)),
            }

    # Read JS coverage
    if os.path.exists(f"{report_dir}/report.json"):
        with open(f"{report_dir}/report.json") as f:
            js_data = json.load(f)
            combined["js_coverage"] = {
                "statements": js_data.get("total", {}).get("statements", {}),
                "functions": js_data.get("total", {}).get("functions", {}),
                "branches": js_data.get("total", {}).get("branches", {}),
                "lines": js_data.get("total", {}).get("lines", {}),
            }

    # Save combined report
    output_path = ".sonarqube/combined/coverage-report.json"
    with open(output_path, "w") as f:
        json.dump(combined, f, indent=2)

    print(f"Combined report saved to {output_path}")
    return combined


if __name__ == "__main__":
    generate_combined_report()
