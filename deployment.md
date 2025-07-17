# To deploy the application, run the following command:
docker build -t ai_frontend:v1 .

# to run the  ( this will give the container a name (ai_front_container) and map the port 3002 to the container's port 80)
docker run -d -p 3002:80 --name ai_front_container ai_frontend:v1