# Deployment Guide

This guide provides instructions for deploying the Student Management System to various platforms.

## Prerequisites

1. MongoDB Atlas Account
   - Create a free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get your connection string
   - Replace `<username>`, `<password>`, and `<dbname>` in the connection string

2. Environment Variables Required:
   ```
   MONGODB_URL=your_mongodb_connection_string
   PORT=8000 (optional, defaults to 8000)
   ```

## Deployment Options

### 1. Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - Build Command: `docker build -t app .`
   - Start Command: `docker run -p $PORT:8000 -e MONGODB_URL=$MONGODB_URL app`
4. Add environment variables:
   - `MONGODB_URL`: Your MongoDB Atlas connection string
5. Deploy

### 2. Deploy to Railway

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add MongoDB Add-on or use MongoDB Atlas
4. Configure environment variables:
   - `MONGODB_URL`: Your MongoDB connection string
5. Deploy

### 3. Deploy to AWS EC2

1. Launch an EC2 instance (t2.micro for free tier)
2. SSH into your instance
3. Install Docker:
   ```bash
   sudo yum update -y
   sudo yum install -y docker
   sudo service docker start
   sudo usermod -a -G docker ec2-user
   ```
4. Clone your repository:
   ```bash
   git clone <your-repo-url>
   cd <repo-directory>
   ```
5. Create .env file:
   ```bash
   echo "MONGODB_URL=your_mongodb_url" > .env
   ```
6. Build and run:
   ```bash
   docker build -t student-management .
   docker run -d -p 80:8000 --env-file .env student-management
   ```

### 4. Deploy to DigitalOcean

1. Create a Droplet
2. Choose Docker from Marketplace
3. SSH into your Droplet
4. Clone your repository
5. Create .env file with your MongoDB URL
6. Build and run:
   ```bash
   docker build -t student-management .
   docker run -d -p 80:8000 --env-file .env student-management
   ```

## Docker Deployment (General)

1. Build the Docker image:
   ```bash
   docker build -t student-management .
   ```

2. Run the container:
   ```bash
   docker run -d -p 8000:8000 \
   -e MONGODB_URL=your_mongodb_url \
   student-management
   ```

## Manual Deployment

1. Build frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set environment variables:
   ```bash
   export MONGODB_URL=your_mongodb_url
   ```

4. Start the application:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

## Post-Deployment Verification

1. Access your application at `http://your-domain`
2. Test the following features:
   - Create a new student
   - List students
   - Search functionality
   - Update student information
   - Delete student
   - Dark mode toggle

## Troubleshooting

1. If the application isn't accessible:
   - Check if the port is open in your security group/firewall
   - Verify the application is running: `docker ps`
   - Check logs: `docker logs container_id`

2. If MongoDB connection fails:
   - Verify your MongoDB URL is correct
   - Check if IP address is whitelisted in MongoDB Atlas
   - Verify network connectivity

3. If static files aren't serving:
   - Check if the build process completed successfully
   - Verify the static files are in the correct location
   - Check the nginx/server logs

## Security Considerations

1. Always use HTTPS in production
2. Secure MongoDB Atlas:
   - Use strong passwords
   - Whitelist IP addresses
   - Enable authentication
3. Keep dependencies updated
4. Regularly backup your database

## Monitoring

Consider setting up:
1. Application monitoring (e.g., Sentry)
2. Server monitoring (e.g., Datadog, New Relic)
3. Database monitoring (MongoDB Atlas metrics)
4. Log aggregation (e.g., ELK Stack)
