!/bin/sh
# 1/ dépendances -> vim, make, curl, nvm
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt install vim make curl -y
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.bashrc
nvm install --lts 
# 2/ install Docker sans script (joie) 
# Add Docker's official GPG key:
sudo apt-get update - y
sudo apt-get install ca-certificates curl -y
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo   "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu   noble stable" |   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
#3 3/ mis a jour de tout les paquets
sudo apt-get update -y
sudo apt-get upgrade -y
