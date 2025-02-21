#!/bin/bash

# Start PostgreSQL service
echo "Starting PostgreSQL..."
sudo service postgresql start

# Define database and schema names
DB_NAME="db"
USER="gitpod"

# Create database
psql -U $USER -c "DROP DATABASE IF EXISTS $DB_NAME;"
echo "Creating database: $DB_NAME"
psql -U $USER -c "CREATE DATABASE $DB_NAME;"

# Create tables
psql -U $USER -d $DB_NAME -c "CREATE TABLE IF NOT EXISTS users (_id char(36) primary key, username varchar(100));"
psql -U $USER -d $DB_NAME -c "CREATE TABLE IF NOT EXISTS exercises (description varchar(100), duration int, date date, userId char(36) references users(_id));"

echo "PostgreSQL initialization complete!"
