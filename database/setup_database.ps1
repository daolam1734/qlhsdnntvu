# PowerShell script to create PostgreSQL database with UTF-8 encoding and run initialization scripts
# Usage: .\setup_database.ps1 [-DbName "qlhs_dnn_tvu"] [-DbUser "postgres"] [-DbPassword "your_password"]

param(
    [string]$DbName = "qlhs_dnn_tvu",
    [string]$DbUser = "postgres",
    [string]$DbPassword = "",
    [string]$HostName = "localhost"
)

# Check if psql is available
try {
    $null = Get-Command psql -ErrorAction Stop
} catch {
    Write-Host "Error: psql command not found. Please ensure PostgreSQL is installed and in PATH." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Creating PostgreSQL database '$DbName' with UTF-8 encoding..." -ForegroundColor Green
Write-Host "Database User: $DbUser" -ForegroundColor Yellow
Write-Host "Host: $HostName" -ForegroundColor Yellow

# Build connection string
$connString = "postgresql://$DbUser"
if ($DbPassword) {
    $connString += ":$DbPassword"
}
$connString += "@$HostName/postgres"

# Create database with UTF-8 encoding
$createDbCommand = @"
CREATE DATABASE $DbName
    WITH OWNER = $DbUser
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0;
"@

Write-Host "Executing: $createDbCommand" -ForegroundColor Cyan

try {
    # Use psql with -c parameter instead of pipeline
    $env:PGPASSWORD = $DbPassword
    & psql -h $HostName -U $DbUser -d postgres -c $createDbCommand 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create database"
    }
}
catch {
    Write-Host "Error creating database. Please check PostgreSQL is running and credentials are correct." -ForegroundColor Red
    Write-Host "Error details: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
finally {
    # Clear password from environment
    $env:PGPASSWORD = $null
}

Write-Host "Database created successfully!" -ForegroundColor Green

# Run initialization scripts
Write-Host "Running database initialization scripts..." -ForegroundColor Green

try {
    # Use psql with environment variable for password
    $env:PGPASSWORD = $DbPassword
    & psql -h $HostName -U $DbUser -d $DbName -f init_master.sql 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to run initialization scripts"
    }
}
catch {
    Write-Host "Error running initialization scripts." -ForegroundColor Red
    Write-Host "Error details: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
finally {
    # Clear password from environment
    $env:PGPASSWORD = $null
}

Write-Host "Database setup completed successfully!" -ForegroundColor Green
Write-Host "Database: $DbName" -ForegroundColor Cyan
Write-Host "User: $DbUser" -ForegroundColor Cyan
Write-Host "Host: $HostName" -ForegroundColor Cyan

Read-Host "Press Enter to exit"