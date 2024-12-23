#!/bin/bash

echo "Starting the build and deploy process..."

# 設定變數
BUCKET_NAME="chichi-player"
REGION="ap-northeast-1"
BUILD_DIR="dist"

# 檢查 AWS CLI 是否已安裝
if ! command -v aws &> /dev/null
then
    echo "AWS CLI not found. Please install it before proceeding."
    exit 1
fi

# 建置專案
echo "Building the project..."
npm run build

# 檢查建置是否成功
if [ $? -ne 0 ]; then
    echo "Build failed. Exiting..."
    exit 1
fi

# 同步檔案到 S3
echo "Deploying to S3..."
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME --delete --region $REGION

if [ $? -ne 0 ]; then
    echo "Deployment failed. Exiting..."
    exit 1
fi

echo "Deployment complete!"
