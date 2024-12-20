@echo off
echo Starting the build and deploy process...

REM 設定變數
set BUCKET_NAME=chichi-player
set REGION=ap-northeast-1
set BUILD_DIR=dist

REM 建置專案
echo Building the project...
call npm run build 

REM 檢查建置是否成功
if %ERRORLEVEL% neq 0 (
    echo Build failed. Exiting...
    exit /b %ERRORLEVEL%
)

REM 同步檔案到 S3
echo Deploying to S3...
aws s3 sync %BUILD_DIR% s3://%BUCKET_NAME% --delete --region %REGION%

echo Deployment complete!
pause