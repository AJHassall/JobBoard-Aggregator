#!/bin/bash
echo "Applying database migrations..."
# dotnet ef database update --project WebScraperDataIngestionAPI.csproj --startup-project WebScraperDataIngestionAPI.csproj

# # Check the exit code of the previous command
# if [ $? -ne 0 ]; then
#   echo "Error: Database migrations failed to apply."
#   exit 1
# else
#   echo "Database migrations applied successfully."
# fi

echo "Starting the application..."
dotnet WebScraperDataIngestionAPI.dll
