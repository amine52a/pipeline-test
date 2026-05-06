#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  SonarQube Setup Script
#  Run AFTER SonarQube is started and healthy
#  Usage: bash devops/sonarqube/setup-sonarqube.sh
# ═══════════════════════════════════════════════════════════════

SONAR_URL="http://localhost:9000"
SONAR_USER="admin"
SONAR_PASS="admin"
NEW_PASS="matchy-sonar-2024"

echo "⏳ Waiting for SonarQube to be ready..."
until curl -s -u "$SONAR_USER:$SONAR_PASS" "$SONAR_URL/api/system/status" | grep -q '"status":"UP"'; do
  sleep 5
  echo "   Still waiting..."
done
echo "✅ SonarQube is ready!"

# Change default password
echo "🔐 Changing admin password..."
curl -s -u "$SONAR_USER:$SONAR_PASS" -X POST \
  "$SONAR_URL/api/users/change_password" \
  -d "login=admin&previousPassword=$SONAR_PASS&password=$NEW_PASS"
echo ""

SONAR_PASS="$NEW_PASS"

# Create projects
echo "📁 Creating SonarQube projects..."

PROJECTS=(
  "matchy-event-service:Matchy Event Service"
  "matchy-content-service:Matchy Content Service"
  "matchy-subscription-service:Matchy Subscription Service"
  "matchy-backend:Matchy Backend Service"
  "matchy-frontend:Matchy Angular Frontend"
  "matchy-ml-service:Matchy ML Prediction Service"
)

for project in "${PROJECTS[@]}"; do
  KEY="${project%%:*}"
  NAME="${project##*:}"
  echo "  Creating: $NAME ($KEY)"
  curl -s -u "$SONAR_USER:$SONAR_PASS" -X POST \
    "$SONAR_URL/api/projects/create" \
    -d "project=$KEY&name=$NAME&visibility=public" > /dev/null
done

# Create Quality Gate
echo "🎯 Creating Matchy Quality Gate..."
QG_ID=$(curl -s -u "$SONAR_USER:$SONAR_PASS" -X POST \
  "$SONAR_URL/api/qualitygates/create" \
  -d "name=Matchy Quality Gate" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo "  Quality Gate ID: $QG_ID"

# Add conditions to quality gate
CONDITIONS=(
  "metric=new_reliability_rating&op=GT&error=1"
  "metric=new_security_rating&op=GT&error=1"
  "metric=new_maintainability_rating&op=GT&error=2"
  "metric=new_coverage&op=LT&error=60"
  "metric=new_duplicated_lines_density&op=GT&error=5"
  "metric=new_blocker_violations&op=GT&error=0"
  "metric=new_critical_violations&op=GT&error=5"
)

for condition in "${CONDITIONS[@]}"; do
  curl -s -u "$SONAR_USER:$SONAR_PASS" -X POST \
    "$SONAR_URL/api/qualitygates/create_condition" \
    -d "gateId=$QG_ID&$condition" > /dev/null
done

# Set as default quality gate
curl -s -u "$SONAR_USER:$SONAR_PASS" -X POST \
  "$SONAR_URL/api/qualitygates/set_as_default" \
  -d "id=$QG_ID"

# Generate token for Jenkins
echo "🔑 Generating SonarQube token for Jenkins..."
TOKEN=$(curl -s -u "$SONAR_USER:$SONAR_PASS" -X POST \
  "$SONAR_URL/api/user_tokens/generate" \
  -d "name=jenkins-token&type=GLOBAL_ANALYSIS_TOKEN" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅ SonarQube Setup Complete!"
echo "═══════════════════════════════════════════════════════"
echo "  URL:      $SONAR_URL"
echo "  User:     admin"
echo "  Password: $NEW_PASS"
echo ""
echo "  🔑 Jenkins Token (save this!):"
echo "  $TOKEN"
echo ""
echo "  Add this token to Jenkins credentials as 'sonarqube-token'"
echo "═══════════════════════════════════════════════════════"
