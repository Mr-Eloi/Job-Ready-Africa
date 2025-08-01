# Job Ready Africa - Student Opportunity Finder

## Description
Find remote and local internships, scholarships, and jobs easily. Built with HTML, CSS, and JS using the Remotive API.

### Live Deployment: https://job-ready-africa.onrender.com
### Video Demo: https://youtu.be/2Hf_PmZI64A
### Docker Hub Repository

- **Repository URL**: [Docker Hub](https://hub.docker.com/repository/docker/mreloi/jobsearch/general)
- **Image Name**: `mreloi/jobsearch`
- **Tags**:
  - `latest`

---


## Features
- Real-time job search
- Filter by category
- API integration
- Error handling
- Deployed to Render Web Hosting Server & web-01, web-02 and lb-01

## Docker Image Build Instructions

To build the Docker image locally:

```bash
docker build -t jobsearch:latest
```
### Tag and push to Docker Hub:
```
docker tag docker tag jobsearch:latest mreloi/jobsearch:latest
docker push mreloi/jobsearch:latest
```
### Run Instructions (Web01 & Web02)
On Web01 and Web02:
```
docker pull mreloi/jobsearch:latest
```
### HAProxy Configuration (on Lb01)
```
frontend http-in
    bind *:80
    default_backend servers

backend servers
    balance roundrobin
    server web01 172.20.0.11:80 check
    server web02 172.20.0.12:80 check
    http-response set-header X-Served-By %[srv_name]
```
### Install HAProxy inside lb-01
```
sudo apt update && sudo apt install -y haproxy
```
### Reload and restart HAProxy
```
sudo vim /etc/haproxy/haproxy.cfg # apply changes
sudo service haproxy restart # restart haproxy cfg
```
### Testing & Verification
##### Step 1: Access the Application via Load Balancer
```
curl -I http://localhost:8082
```

Use .env file:
```
docker run --env-file .env mreloi/jobsearch:latest
```
### Getting Started

- `Web browsers (Chrome, Edge, etc.)`
- `An internet connection to fetch Jobs JSON data from Remotive API`

### Run Locally
#### Clone the repository:
```
git clone https://github.com/Mr-Eloi/Job-Ready-Africa.git
cd job-ready-africa
```
Open `index.html` in browser

## APIs Used
- Remotive API – https://remotive.com/api/remote-jobs

## Credit
- [Remotive.com](https://remotive.com)
- FreeIcons

## Challenges Faced
- Handling API rate limits
- Filtering large datasets efficiently

Developed by:

***Eloi Iradukunda***

