@echo off
echo Building project...
call npm run build-force

echo Deploying to S3...
aws s3 sync dist/ s3://test-play-chi --delete

echo Deployment complete!
pause