all: install-deps
	sudo docker compose -f ./normal/docker-compose.yml up --build

n_stop:
	sudo docker compose -f ./normal/docker-compose.yml stop

n_resume:
	sudo docker compose -f ./normal/docker-compose.yml start
	sudo docker container start -a api_backend

n_clean:
	sudo docker compose -f ./normal/docker-compose.yml down
	sudo docker container prune -f
	sudo docker volume prune -f

bonus:
	sudo docker compose -f ./bonus/docker-compose.yml up --build

b_stop:
	sudo docker compose -f ./bonus/docker-compose.yml stop

b_resume:
	sudo docker compose -f ./bonus/docker-compose.yml start
	sudo docker container start -a api_backend

b_clean:
	sudo docker compose -f ./bonus/docker-compose.yml down
	sudo docker container prune -f
	sudo docker volume prune -f

n_fclean: n_clean
	sudo docker system prune -af

b_fclean: b_clean
	sudo docker system prune -af

n_r: n_clean all

n_re: n_fclean all

b_r: b_clean bonus

b_re: b_fclean bonus

git:
	@read -p "Enter commit message: " commit_message; \
	git add .; \
	git commit -m "$$commit_message"; \
	git push

git_reset:
	git fetch origin
	git reset --hard

install-deps:
	cd normal/api && sudo npm install -g jest
	cd normal/api && sudo npm install
	cd normal/api && sudo chown -R $$USER:$$USER node_modules

.PHONY: all n_stop n_resume n_clean bonus b_stop b_resume b_clean b_fclean n_r n_re b_r b_re git git_reset install-deps
