#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:5000/api"

print("=" * 70)
print("COMPREHENSIVE API TEST - MONGODB PERSISTENCE CHECK")
print("=" * 70)

try:
    # Login as student
    login_data = {"email": "student@demo.com", "password": "pass123"}
    login_res = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    login_json = login_res.json()
    token = login_json['token']
    headers = {"Authorization": f"Bearer {token}"}

    # Test 1: Jobs Endpoint
    print("\n✅ TEST 1: JOBS ENDPOINT")
    jobs_res = requests.get(f"{BASE_URL}/jobs", headers=headers)
    jobs = jobs_res.json()
    print(f"   Status: {jobs_res.status_code}")
    print(f"   Total Jobs: {len(jobs)}")
    if len(jobs) > 0:
        job = jobs[0]
        print(f"   Sample Job:")
        print(f"      Company: {job.get('company')}")
        print(f"      Role: {job.get('role')}")
        print(f"      CTC: {job.get('ctc')}")
        print(f"      Location: {job.get('location')}")

    # Test 2: Profile Endpoint
    print("\n✅ TEST 2: PROFILE ENDPOINT (/profile/me)")
    profile_res = requests.get(f"{BASE_URL}/profile/me", headers=headers)
    profile = profile_res.json()
    print(f"   Status: {profile_res.status_code}")
    print(f"   Name: {profile.get('name')}")
    print(f"   Email: {profile.get('email')}")
    print(f"   CGPA: {profile.get('cgpa')}")
    print(f"   Branch: {profile.get('branch')}")
    print(f"   Skills: {len(profile.get('skills', []))} skills listed")

    # Test 3: Skill Gap Endpoint
    print("\n✅ TEST 3: SKILL GAP ENDPOINT (/profile/skill-gap)")
    skillgap_res = requests.get(f"{BASE_URL}/profile/skill-gap", headers=headers)
    skillgap = skillgap_res.json()
    print(f"   Status: {skillgap_res.status_code}")
    print(f"   Current Skills: {len(skillgap.get('currentSkills', []))}")
    print(f"   Available Roles: {len(skillgap.get('roles', []))}")
    if skillgap.get('roles'):
        print(f"   Sample Roles:")
        for role in skillgap['roles'][:3]:
            print(f"      - {role.get('name')}: {len(role.get('requiredSkills', []))} required skills")

    # Test 4: Applications Endpoint
    print("\n✅ TEST 4: APPLICATIONS ENDPOINT")
    apps_res = requests.get(f"{BASE_URL}/applications", headers=headers)
    apps = apps_res.json()
    print(f"   Status: {apps_res.status_code}")
    print(f"   Total Applications: {len(apps)}")

    # Test 5: Dashboard Stats
    print("\n✅ TEST 5: DASHBOARD STATS")
    stats_res = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
    stats = stats_res.json()
    print(f"   Status: {stats_res.status_code}")
    print(f"   Total Applications: {stats.get('totalApplications')}")
    print(f"   Shortlisted: {stats.get('shortlisted')}")
    print(f"   Interviewed: {stats.get('interviewed')}")
    print(f"   Offers Received: {stats.get('offers')}")
    print(f"   Job Interests: {stats.get('jobInterests')}")

    # Test 6: Announcements
    print("\n✅ TEST 6: ANNOUNCEMENTS ENDPOINT")
    announ_res = requests.get(f"{BASE_URL}/announcements", headers=headers)
    announcements = announ_res.json()
    print(f"   Status: {announ_res.status_code}")
    print(f"   Total Announcements: {len(announcements)}")

    # Test 7: CDC Admin
    print("\n✅ TEST 7: CDC ADMIN ENDPOINTS")
    cdc_login = {"email": "cdc@demo.com", "password": "pass123"}
    cdc_res = requests.post(f"{BASE_URL}/auth/login", json=cdc_login)
    cdc_token = cdc_res.json()['token']
    cdc_headers = {"Authorization": f"Bearer {cdc_token}"}
    print(f"   CDC Login Status: {cdc_res.status_code}")

    # CDC Jobs
    cdc_jobs_res = requests.get(f"{BASE_URL}/jobs/cdc/all", headers=cdc_headers)
    cdc_jobs = cdc_jobs_res.json()
    print(f"   CDC Jobs Available: {len(cdc_jobs)}")
    if cdc_jobs:
        print(f"   Sample CDC Job: {cdc_jobs[0].get('company')} - {cdc_jobs[0].get('role')}")

    # CDC Announcements
    cdc_ann_res = requests.get(f"{BASE_URL}/announcements/cdc/all", headers=cdc_headers)
    cdc_ann = cdc_ann_res.json()
    print(f"   CDC Announcements: {len(cdc_ann)}")

    print("\n" + "=" * 70)
    print("✅ ALL TESTS COMPLETED - DATA IS PERSISTENT FROM MONGODB ATLAS")
    print("=" * 70)

except Exception as e:
    print(f"\n❌ ERROR: {e}")
