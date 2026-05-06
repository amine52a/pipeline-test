"""
Sets GitHub Actions secrets for the Matchy pipeline.
Run: python devops/set-github-secrets.py

Reads credentials from environment variables or prompts for them.
"""
import base64, json, os, urllib.request, urllib.error, getpass
from nacl import encoding, public

REPO = "amine52a/pipeline-test"

def get_public_key(token):
    url = f"https://api.github.com/repos/{REPO}/actions/secrets/public-key"
    req = urllib.request.Request(url, headers={
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "Matchy-CI"
    })
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def encrypt_secret(public_key_b64, secret_value):
    pk = public.PublicKey(public_key_b64.encode("utf-8"), encoding.Base64Encoder())
    sealed_box = public.SealedBox(pk)
    encrypted = sealed_box.encrypt(secret_value.encode("utf-8"))
    return base64.b64encode(encrypted).decode("utf-8")

def set_secret(token, name, value, key_id, encrypted_value):
    url = f"https://api.github.com/repos/{REPO}/actions/secrets/{name}"
    payload = json.dumps({"encrypted_value": encrypted_value, "key_id": key_id}).encode()
    req = urllib.request.Request(url, data=payload, method="PUT", headers={
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "Matchy-CI"
    })
    try:
        with urllib.request.urlopen(req) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code

if __name__ == "__main__":
    print("🔐 Matchy — GitHub Secrets Setup")
    print(f"   Repo: {REPO}")
    print()

    github_token  = os.environ.get("GITHUB_TOKEN")  or getpass.getpass("GitHub Token: ")
    docker_token  = os.environ.get("DOCKER_HUB_TOKEN") or getpass.getpass("Docker Hub Token: ")

    secrets = {"DOCKER_HUB_TOKEN": docker_token}

    key_data = get_public_key(github_token)
    key_id, pub_key = key_data["key_id"], key_data["key"]

    for name, value in secrets.items():
        encrypted = encrypt_secret(pub_key, value)
        status    = set_secret(github_token, name, value, key_id, encrypted)
        icon = "✅" if status in (201, 204) else "❌"
        print(f"   {icon} {name}: HTTP {status}")

    print()
    print("Done! https://github.com/amine52a/pipeline-test/settings/secrets/actions")
