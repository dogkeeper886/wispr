
###Command to create TLS secret volume
kubectl create secret tls NAME --cert=path/to/cert/file --key=path/to/key/file


###Command to create generic secret volume
kubectl create secret generic NAME [--type=string] [--from-file=[key=]source] [--from-literal=key1=value1]



###GKE expose port on firewall
gcloud compute firewall-rules create test-node-port --allow tcp:NODE_PORT

