#!/bin/bash
echo "Applying database migrations..."
dotnet ef database update --project WebScraperDataIngestionAPI.csproj --startup-project WebScraperDataIngestionAPI.csproj
echo "Database migrations applied."

echo "Starting the application..."
dotnet WebScraperDataIngestionAPI.dll
