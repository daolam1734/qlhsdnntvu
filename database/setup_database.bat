@echo off
REM Script to create PostgreSQL database with UTF-8 encoding and run initialization scripts
REM Usage: setup_database.bat [db_name] [db_user] [db_password]

setlocal

REM Check if psql is available
where psql >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: psql command not found. Please ensure PostgreSQL is installed and in PATH.
    pause
    exit /b 1
)

REM Default values
set DB_NAME=qlhs_dnn_tvu
set DB_USER=postgres
set DB_PASSWORD=

REM Override with command line arguments if provided
if not "%1"=="" set DB_NAME=%1
if not "%2"=="" set DB_USER=%2
if not "%3"=="" set DB_PASSWORD=%3

echo Creating PostgreSQL database '%DB_NAME%' with UTF-8 encoding...
echo Database User: %DB_USER%

REM Create database with UTF-8 encoding
if "%DB_PASSWORD%"=="" (
    psql -U %DB_USER% -h localhost -c "CREATE DATABASE %DB_NAME% WITH OWNER = %DB_USER% ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8' TEMPLATE = template0;"
) else (
    set PGPASSWORD=%DB_PASSWORD%
    psql -U %DB_USER% -h localhost -c "CREATE DATABASE %DB_NAME% WITH OWNER = %DB_USER% ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8' TEMPLATE = template0;"
    set PGPASSWORD=
)

if %ERRORLEVEL% neq 0 (
    echo Error creating database. Please check PostgreSQL is running and credentials are correct.
    pause
    exit /b 1
)

echo Database created successfully!

REM Run initialization scripts
echo Running database initialization scripts...
if "%DB_PASSWORD%"=="" (
    psql -U %DB_USER% -d %DB_NAME% -h localhost -f init_master.sql
) else (
    set PGPASSWORD=%DB_PASSWORD%
    psql -U %DB_USER% -d %DB_NAME% -h localhost -f init_master.sql
    set PGPASSWORD=
)

if %ERRORLEVEL% neq 0 (
    echo Error running initialization scripts.
    pause
    exit /b 1
)

echo Database setup completed successfully!
echo Database: %DB_NAME%
echo User: %DB_USER%

pause