#!/usr/bin/env python3
"""
Portfolio Backend API Testing
Tests visitor tracking functionality, admin authentication, and content management APIs
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional

class PortfolioAPITester:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.admin_token: Optional[str] = None
        self.created_ids = []  # Track created content IDs for cleanup

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

    def test_admin_login(self) -> bool:
        """Test admin login with provided credentials"""
        try:
            response = requests.post(
                f"{self.base_url}/api/admin/login",
                headers={"Content-Type": "application/json"},
                json={
                    "email": "netha.srikanth@yahoo.com",
                    "password": "23Bunny09"
                },
                timeout=10
            )
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if data.get('success') and 'token' in data:
                    self.admin_token = data['token']
                    details = f"Login successful, token received: {self.admin_token[:10]}..."
                else:
                    success = False
                    details = f"Login response missing success/token: {data}"
            else:
                details = f"Status code: {response.status_code}, Response: {response.text[:100]}"
            
            self.log_test("Admin Login", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Login", False, str(e))
            return False

    def test_admin_verify(self) -> bool:
        """Test admin token verification"""
        if not self.admin_token:
            self.log_test("Admin Verify", False, "No admin token available")
            return False
        
        try:
            response = requests.post(
                f"{self.base_url}/api/admin/verify",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.admin_token}"
                },
                timeout=10
            )
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                is_valid = data.get('valid', False)
                details = f"Token valid: {is_valid}"
                success = is_valid
            else:
                details = f"Status code: {response.status_code}"
            
            self.log_test("Admin Verify", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Verify", False, str(e))
            return False

    def test_content_about(self) -> bool:
        """Test about content save and retrieve"""
        try:
            # Test saving about content
            about_data = {
                "text": "Test about text for API testing",
                "image_url": "https://example.com/test-image.jpg"
            }
            
            save_response = requests.post(
                f"{self.base_url}/api/content/about",
                headers={"Content-Type": "application/json"},
                json=about_data,
                timeout=10
            )
            
            if save_response.status_code != 200:
                self.log_test("Content About", False, f"Save failed: {save_response.status_code}")
                return False
            
            save_data = save_response.json()
            if not save_data.get('success'):
                self.log_test("Content About", False, f"Save response: {save_data}")
                return False
            
            # Test retrieving about content
            get_response = requests.get(f"{self.base_url}/api/content/about", timeout=10)
            
            if get_response.status_code != 200:
                self.log_test("Content About", False, f"Get failed: {get_response.status_code}")
                return False
            
            get_data = get_response.json()
            success = (get_data.get('text') == about_data['text'] and 
                      get_data.get('image_url') == about_data['image_url'])
            
            details = f"Save/retrieve successful, data matches: {success}"
            self.log_test("Content About", success, details)
            return success
            
        except Exception as e:
            self.log_test("Content About", False, str(e))
            return False

    def test_content_education(self) -> bool:
        """Test education content CRUD operations"""
        try:
            # Test creating education entry
            education_data = {
                "institution": "Test University",
                "degree": "Test Degree",
                "period": "2020-2024",
                "location": "Test City",
                "courses": "Course 1, Course 2, Course 3",
                "logo_url": "https://example.com/logo.jpg",
                "website_url": "https://example.com"
            }
            
            # Create education entry
            create_response = requests.post(
                f"{self.base_url}/api/content/education",
                headers={"Content-Type": "application/json"},
                json=education_data,
                timeout=10
            )
            
            if create_response.status_code != 200:
                self.log_test("Content Education", False, f"Create failed: {create_response.status_code}")
                return False
            
            create_data = create_response.json()
            if not create_data.get('success') or 'id' not in create_data:
                self.log_test("Content Education", False, f"Create response: {create_data}")
                return False
            
            education_id = create_data['id']
            self.created_ids.append(('education', education_id))
            
            # Test retrieving education entries
            get_response = requests.get(f"{self.base_url}/api/content/education", timeout=10)
            
            if get_response.status_code != 200:
                self.log_test("Content Education", False, f"Get failed: {get_response.status_code}")
                return False
            
            education_list = get_response.json()
            if not isinstance(education_list, list):
                self.log_test("Content Education", False, f"Get response not a list: {education_list}")
                return False
            
            # Find our created entry
            found_entry = None
            for entry in education_list:
                if entry.get('id') == education_id:
                    found_entry = entry
                    break
            
            if not found_entry:
                self.log_test("Content Education", False, f"Created entry not found in list")
                return False
            
            # Test deleting education entry
            delete_response = requests.delete(
                f"{self.base_url}/api/content/education/{education_id}",
                timeout=10
            )
            
            if delete_response.status_code != 200:
                self.log_test("Content Education", False, f"Delete failed: {delete_response.status_code}")
                return False
            
            delete_data = delete_response.json()
            success = delete_data.get('success', False)
            
            details = f"CRUD operations successful: Create ID {education_id}, Found in list, Deleted"
            self.log_test("Content Education", success, details)
            return success
            
        except Exception as e:
            self.log_test("Content Education", False, str(e))
            return False

    def test_content_experience(self) -> bool:
        """Test experience content save operation"""
        try:
            experience_data = {
                "company": "Test Company",
                "title": "Test Engineer",
                "period": "2023-2024",
                "location": "Test Location",
                "description": "Test description line 1\nTest description line 2",
                "logo_url": "https://example.com/company-logo.jpg",
                "website_url": "https://example.com/company"
            }
            
            response = requests.post(
                f"{self.base_url}/api/content/experience",
                headers={"Content-Type": "application/json"},
                json=experience_data,
                timeout=10
            )
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if data.get('success') and 'id' in data:
                    experience_id = data['id']
                    self.created_ids.append(('experience', experience_id))
                    details = f"Experience created with ID: {experience_id}"
                else:
                    success = False
                    details = f"Response missing success/id: {data}"
            else:
                details = f"Status code: {response.status_code}, Response: {response.text[:100]}"
            
            self.log_test("Content Experience", success, details)
            return success
        except Exception as e:
            self.log_test("Content Experience", False, str(e))
            return False

    def test_content_projects(self) -> bool:
        """Test projects content save operation"""
        try:
            project_data = {
                "title": "Test Project",
                "description": "This is a test project for API testing",
                "link": "https://github.com/test/project",
                "image_url": "https://example.com/project-image.jpg"
            }
            
            response = requests.post(
                f"{self.base_url}/api/content/projects",
                headers={"Content-Type": "application/json"},
                json=project_data,
                timeout=10
            )
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if data.get('success') and 'id' in data:
                    project_id = data['id']
                    self.created_ids.append(('projects', project_id))
                    details = f"Project created with ID: {project_id}"
                else:
                    success = False
                    details = f"Response missing success/id: {data}"
            else:
                details = f"Status code: {response.status_code}, Response: {response.text[:100]}"
            
            self.log_test("Content Projects", success, details)
            return success
        except Exception as e:
            self.log_test("Content Projects", False, str(e))
            return False

    def test_content_skills(self) -> bool:
        """Test skills content save operation"""
        try:
            skill_data = {
                "category": "Test Skills",
                "skills": "Python, JavaScript, Testing, API Development"
            }
            
            response = requests.post(
                f"{self.base_url}/api/content/skills",
                headers={"Content-Type": "application/json"},
                json=skill_data,
                timeout=10
            )
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if data.get('success') and 'id' in data:
                    skill_id = data['id']
                    self.created_ids.append(('skills', skill_id))
                    details = f"Skill category created with ID: {skill_id}"
                else:
                    success = False
                    details = f"Response missing success/id: {data}"
            else:
                details = f"Status code: {response.status_code}, Response: {response.text[:100]}"
            
            self.log_test("Content Skills", success, details)
            return success
        except Exception as e:
            self.log_test("Content Skills", False, str(e))
            return False

    def test_content_all(self) -> bool:
        """Test get all content endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/content/all", timeout=10)
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                required_sections = ['about', 'education', 'experience', 'projects', 'skills']
                has_all_sections = all(section in data for section in required_sections)
                
                if has_all_sections:
                    details = f"All sections present: {list(data.keys())}"
                    # Check if our created content is in the response
                    created_count = 0
                    for section, item_id in self.created_ids:
                        section_data = data.get(section, [])
                        if isinstance(section_data, list):
                            for item in section_data:
                                if item.get('id') == item_id:
                                    created_count += 1
                                    break
                    details += f", Found {created_count}/{len(self.created_ids)} created items"
                else:
                    success = False
                    details = f"Missing sections. Found: {list(data.keys())}, Required: {required_sections}"
            else:
                details = f"Status code: {response.status_code}"
            
            self.log_test("Content All", success, details)
            return success
        except Exception as e:
            self.log_test("Content All", False, str(e))
            return False

    def cleanup_created_content(self):
        """Clean up created test content"""
        print("\n🧹 Cleaning up test content...")
        for section, item_id in self.created_ids:
            try:
                response = requests.delete(f"{self.base_url}/api/content/{section}/{item_id}", timeout=5)
                if response.status_code == 200:
                    print(f"✅ Deleted {section} item {item_id}")
                else:
                    print(f"⚠️ Could not delete {section} item {item_id}: {response.status_code}")
            except Exception as e:
                print(f"⚠️ Error deleting {section} item {item_id}: {str(e)}")
        self.created_ids.clear()

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