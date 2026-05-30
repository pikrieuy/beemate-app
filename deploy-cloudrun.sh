#!/bin/bash
# ══════════════════════════════════════════════════════════════
# BeeMate — Deploy to Google Cloud Run
# For #JuaraVibeCoding submission
# ══════════════════════════════════════════════════════════════
#
# PREREQUISITES:
# 1. Install gcloud CLI: https://cloud.google.com/sdk/docs/install
# 2. Login: gcloud auth login
# 3. Create .env.cloudrun file with all env vars (see .env.example)
#
# USAGE:
#   chmod +x deploy-cloudrun.sh
#   ./deploy-cloudrun.sh
# ══════════════════════════════════════════════════════════════

PROJECT_ID="beemate-app"
REGION="asia-southeast1"
SERVICE_NAME="beemate"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🐝 BeeMate — Cloud Run Deployment"
echo "=================================="

# Step 1: Set project
echo "📌 Setting project to ${PROJECT_ID}..."
gcloud config set project ${PROJECT_ID}

# Step 2: Enable required APIs
echo "🔧 Enabling APIs..."
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Step 3: Build and push container
echo "🏗️ Building container image..."
gcloud builds submit --tag ${IMAGE_NAME} .

# Step 4: Deploy to Cloud Run (env vars loaded from .env.cloudrun)
echo "🚀 Deploying to Cloud Run..."
echo "⚠️  Make sure .env.cloudrun exists with all environment variables!"

gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --env-vars-file .env.cloudrun.yaml

echo ""
echo "✅ Deployment complete!"
echo "🌐 Get your URL: gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format='value(status.url)'"
echo ""
echo "⚠️  After first deploy, update AUTH_URL and NEXT_PUBLIC_APP_URL with the Cloud Run URL"
