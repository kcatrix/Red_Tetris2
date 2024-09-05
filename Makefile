all: 
	docker compose -f ./normal/docker-compose.yml up --build

n_stop:
	docker compose -f ./normal/docker-compose.yml stop

n_resume:
	docker compose -f ./normal/docker-compose.yml start
	docker container start -a api_backend

n_clean:
	docker compose -f ./normal/docker-compose.yml down
	docker container prune -f
	docker volume prune -f

bonus:
	docker compose -f ./bonus/docker-compose.yml up --build

b_stop:
	docker compose -f ./bonus/docker-compose.yml stop

b_resume:
	docker compose -f ./bonus/docker-compose.yml start
	docker container start -a api_backend

b_clean:
	docker compose -f ./bonus/docker-compose.yml down
	docker container prune -f
	docker volume prune -f

n_fclean: n_clean
	docker system prune -af

b_fclean: b_clean
	docker system prune -af

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

.PHONY: bonus