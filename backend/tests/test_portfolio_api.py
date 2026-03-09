"""
Portfolio Backend API Tests
Tests for: Health, Content APIs (About, Education, Experience, Projects, Skills), 
Admin Authentication, and Visitor Tracking
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://dynamic-portfolio-66.preview.emergentagent.com')

# Admin credentials from review request
ADMIN_EMAIL = "netha.srikanth@yahoo.com"
ADMIN_PASSWORD = "23Bunny09"


class TestHealthEndpoint:
    """Health check endpoint tests"""
    
    def test_health_check(self):
        """Test that health endpoint returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        print(f"✓ Health check passed: {data['status']}")


class TestContentAPIs:
    """Content retrieval API tests - public endpoints"""
    
    def test_get_all_content(self):
        """Test /api/content/all returns all sections"""
        response = requests.get(f"{BASE_URL}/api/content/all")
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure has all required sections
        assert "about" in data
        assert "education" in data
        assert "experience" in data
        assert "projects" in data
        assert "skills" in data
        print(f"✓ GET /api/content/all returns all sections")
    
    def test_get_about_content(self):
        """Test /api/content/about endpoint"""
        response = requests.get(f"{BASE_URL}/api/content/about")
        assert response.status_code == 200
        data = response.json()
        # About should have text field
        assert "text" in data or "section" in data
        print(f"✓ GET /api/content/about working")
    
    def test_get_education_content(self):
        """Test /api/content/education endpoint"""
        response = requests.get(f"{BASE_URL}/api/content/education")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/content/education returns list with {len(data)} items")
    
    def test_get_experience_content(self):
        """Test /api/content/experience endpoint"""
        response = requests.get(f"{BASE_URL}/api/content/experience")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/content/experience returns list with {len(data)} items")
    
    def test_get_projects_content(self):
        """Test /api/content/projects endpoint"""
        response = requests.get(f"{BASE_URL}/api/content/projects")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/content/projects returns list with {len(data)} items")
    
    def test_get_skills_content(self):
        """Test /api/content/skills endpoint"""
        response = requests.get(f"{BASE_URL}/api/content/skills")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/content/skills returns list with {len(data)} items")


class TestAdminAuthentication:
    """Admin authentication tests"""
    
    def test_admin_login_success(self):
        """Test admin login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "token" in data
        assert len(data["token"]) > 0
        print(f"✓ Admin login successful with valid credentials")
        return data["token"]
    
    def test_admin_login_invalid_credentials(self):
        """Test admin login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == False
        print(f"✓ Admin login correctly rejects invalid credentials")
    
    def test_admin_verify_valid_token(self):
        """Test admin token verification with valid token"""
        # First login to get token
        login_response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_response.json()["token"]
        
        # Verify token
        response = requests.post(f"{BASE_URL}/api/admin/verify", 
            headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] == True
        print(f"✓ Admin token verification working")
    
    def test_admin_verify_invalid_token(self):
        """Test admin token verification with invalid token"""
        response = requests.post(f"{BASE_URL}/api/admin/verify", 
            headers={"Authorization": "Bearer invalidtoken123"})
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] == False
        print(f"✓ Admin correctly rejects invalid token")


class TestVisitorTracking:
    """Visitor tracking API tests"""
    
    def test_track_visitor(self):
        """Test visitor tracking endpoint"""
        response = requests.post(f"{BASE_URL}/api/visitors/track")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "stats" in data
        print(f"✓ Visitor tracking working")
    
    def test_get_visitor_stats(self):
        """Test visitor stats endpoint"""
        response = requests.get(f"{BASE_URL}/api/visitors/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total_visits" in data or "type" in data
        print(f"✓ Visitor stats endpoint working")


class TestAdminCRUDOperations:
    """Tests for admin CRUD operations on content"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin token for authenticated requests"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200 and response.json().get("success"):
            return response.json()["token"]
        pytest.skip("Admin login failed")
    
    def test_update_about_section(self, admin_token):
        """Test updating about section"""
        test_text = "TEST_ABOUT_CONTENT: This is test about text for API testing"
        response = requests.post(f"{BASE_URL}/api/content/about",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"text": test_text})
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        
        # Verify the change persisted
        get_response = requests.get(f"{BASE_URL}/api/content/about")
        assert get_response.status_code == 200
        get_data = get_response.json()
        assert test_text in get_data.get("text", "")
        print(f"✓ About section update and persistence verified")
    
    def test_add_education_entry(self, admin_token):
        """Test adding a new education entry"""
        test_data = {
            "institution": "TEST_University of Testing",
            "degree": "Bachelor of Testing Science",
            "period": "Jan 2020 - Dec 2024",
            "location": "Test City, USA",
            "courses": "Test Design, Test Analysis"
        }
        response = requests.post(f"{BASE_URL}/api/content/education",
            headers={"Authorization": f"Bearer {admin_token}"},
            json=test_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "id" in data
        
        # Clean up - delete the test entry
        delete_response = requests.delete(f"{BASE_URL}/api/content/education/{data['id']}",
            headers={"Authorization": f"Bearer {admin_token}"})
        assert delete_response.status_code == 200
        print(f"✓ Education CRUD (create/delete) working")
    
    def test_add_experience_entry(self, admin_token):
        """Test adding a new experience entry"""
        test_data = {
            "company": "TEST_Company Inc",
            "title": "Test Engineer",
            "period": "Jan 2023 - Present",
            "location": "Test City, USA",
            "description": "Testing software applications\nWriting test cases"
        }
        response = requests.post(f"{BASE_URL}/api/content/experience",
            headers={"Authorization": f"Bearer {admin_token}"},
            json=test_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "id" in data
        
        # Clean up
        delete_response = requests.delete(f"{BASE_URL}/api/content/experience/{data['id']}",
            headers={"Authorization": f"Bearer {admin_token}"})
        assert delete_response.status_code == 200
        print(f"✓ Experience CRUD (create/delete) working")
    
    def test_add_project_entry(self, admin_token):
        """Test adding a new project entry"""
        test_data = {
            "title": "TEST_Project Alpha",
            "description": "A test project for API testing",
            "link": "https://example.com/test-project"
        }
        response = requests.post(f"{BASE_URL}/api/content/projects",
            headers={"Authorization": f"Bearer {admin_token}"},
            json=test_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "id" in data
        
        # Clean up
        delete_response = requests.delete(f"{BASE_URL}/api/content/projects/{data['id']}",
            headers={"Authorization": f"Bearer {admin_token}"})
        assert delete_response.status_code == 200
        print(f"✓ Projects CRUD (create/delete) working")
    
    def test_add_skill_category(self, admin_token):
        """Test adding a new skill category"""
        test_data = {
            "category": "TEST_Testing Skills",
            "skills": "Pytest, Selenium, Playwright"
        }
        response = requests.post(f"{BASE_URL}/api/content/skills",
            headers={"Authorization": f"Bearer {admin_token}"},
            json=test_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "id" in data
        
        # Clean up
        delete_response = requests.delete(f"{BASE_URL}/api/content/skills/{data['id']}",
            headers={"Authorization": f"Bearer {admin_token}"})
        assert delete_response.status_code == 200
        print(f"✓ Skills CRUD (create/delete) working")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
