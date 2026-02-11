#!/usr/bin/env python3
"""
Portfolio Backend API Testing
Tests visitor tracking functionality and API endpoints
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class PortfolioAPITester:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}: PASSED")
        else:
            print(f"❌ {name}: FAILED - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def test_health_check(self) -> bool:
        """Test health endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {data.get('status', 'unknown')}"
            else:
                details = f"Status code: {response.status_code}"
            
            self.log_test("Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("Health Check", False, str(e))
            return False

    def test_visitor_tracking(self) -> bool:
        """Test visitor tracking endpoint"""
        try:
            response = requests.post(
                f"{self.base_url}/api/visitors/track",
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            success = response.status_code == 200
            
            if success:
                data = response.json()
                has_stats = 'stats' in data and 'success' in data
                details = f"Response includes stats: {has_stats}"
                if has_stats:
                    stats = data['stats']
                    details += f", Total visits: {stats.get('total_visits', 0)}"
            else:
                details = f"Status code: {response.status_code}, Response: {response.text[:100]}"
            
            self.log_test("Visitor Tracking", success, details)
            return success
        except Exception as e:
            self.log_test("Visitor Tracking", False, str(e))
            return False

    def test_get_stats(self) -> bool:
        """Test get stats endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/visitors/stats", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                required_fields = ['total_visits', 'unique_visitors', 'page_views']
                has_all_fields = all(field in data for field in required_fields)
                details = f"Has all required fields: {has_all_fields}"
                if has_all_fields:
                    details += f", Stats: {data}"
            else:
                details = f"Status code: {response.status_code}"
            
            self.log_test("Get Stats", success, details)
            return success
        except Exception as e:
            self.log_test("Get Stats", False, str(e))
            return False

    def test_pageview_tracking(self) -> bool:
        """Test pageview tracking endpoint"""
        try:
            response = requests.post(
                f"{self.base_url}/api/visitors/pageview",
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            success = response.status_code == 200
            
            if success:
                data = response.json()
                has_success = data.get('success', False)
                details = f"Success flag: {has_success}"
            else:
                details = f"Status code: {response.status_code}"
            
            self.log_test("Pageview Tracking", success, details)
            return success
        except Exception as e:
            self.log_test("Pageview Tracking", False, str(e))
            return False

    def test_stats_increment(self) -> bool:
        """Test that stats actually increment"""
        try:
            # Get initial stats
            initial_response = requests.get(f"{self.base_url}/api/visitors/stats", timeout=10)
            if initial_response.status_code != 200:
                self.log_test("Stats Increment", False, "Could not get initial stats")
                return False
            
            initial_stats = initial_response.json()
            initial_visits = initial_stats.get('total_visits', 0)
            
            # Track a visitor
            track_response = requests.post(
                f"{self.base_url}/api/visitors/track",
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if track_response.status_code != 200:
                self.log_test("Stats Increment", False, "Visitor tracking failed")
                return False
            
            # Get updated stats
            updated_response = requests.get(f"{self.base_url}/api/visitors/stats", timeout=10)
            if updated_response.status_code != 200:
                self.log_test("Stats Increment", False, "Could not get updated stats")
                return False
            
            updated_stats = updated_response.json()
            updated_visits = updated_stats.get('total_visits', 0)
            
            success = updated_visits > initial_visits
            details = f"Initial: {initial_visits}, Updated: {updated_visits}, Incremented: {success}"
            
            self.log_test("Stats Increment", success, details)
            return success
            
        except Exception as e:
            self.log_test("Stats Increment", False, str(e))
            return False

    def run_all_tests(self) -> Dict[str, Any]:
        """Run all backend tests"""
        print(f"🚀 Starting Portfolio Backend API Tests")
        print(f"📍 Base URL: {self.base_url}")
        print("=" * 60)
        
        # Run tests in order
        tests = [
            self.test_health_check,
            self.test_get_stats,
            self.test_visitor_tracking,
            self.test_pageview_tracking,
            self.test_stats_increment
        ]
        
        for test in tests:
            test()
            print()
        
        # Summary
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print("=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} passed ({success_rate:.1f}%)")
        
        return {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "success_rate": success_rate,
            "test_results": self.test_results
        }

def main():
    # Use the public URL from frontend/.env
    base_url = "https://ad6cb6b0-b444-4013-9bf4-8e4c6b512bd5.preview.emergentagent.com"
    
    tester = PortfolioAPITester(base_url)
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    return 0 if results["success_rate"] >= 80 else 1

if __name__ == "__main__":
    sys.exit(main())