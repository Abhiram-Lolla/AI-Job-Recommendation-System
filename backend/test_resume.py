import requests
import random

email = f"test{random.randint(1, 10000)}@ai.com"
print("Registering", email)

# Register
res = requests.post("http://localhost:8000/api/v1/auth/register", json={"name": "Test", "email": email, "password": "pass"})
print("Reg:", res.status_code, res.text)

# Login
res = requests.post("http://localhost:8000/api/v1/auth/login", data={"username": email, "password": "pass"})
print("Login:", res.status_code, res.text)
if res.status_code != 200:
    exit()

token = res.json().get("access_token")

# Upload
pdf_content = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
files = {"file": ("dummy.pdf", pdf_content, "application/pdf")}
res = requests.post("http://localhost:8000/api/v1/resume/upload", headers={"Authorization": f"Bearer {token}"}, files=files)
print("Upload:", res.status_code, res.text)

