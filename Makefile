all: 
	cp -r .env ./normal/
	cp -r .env ./bonus/
	docker compose -f ./normal/docker-compose.yml up --build -d

n_stop:
	docker compose -f ./normal/docker-compose.yml stop

n_resume:
	docker compose -f ./normal/docker-compose.yml start
	docker container start -a api_backend

n_clean:
	docker compose -f ./normal/docker-compose.yml down
	docker container prune -f
	docker volume prune -f

coverage:
	docker exec -it api_backend npm run coverage

bonus:
	cp -r .env ./normal/
	cp -r .env ./bonus/
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

install-deps:
	cd normal/api && npm install -g jest
	cd normal/api && npm install
	cd normal/api && chown -R $$USER:$$USER node_modules
	#cd normal/client && sudo npm install
	#cd normal/client && sudo chown -R $$USER:$$USER node_modules


.PHONY: all n_stop n_resume n_clean bonus b_stop b_resume b_clean b_fclean n_r n_re b_r b_re git git_reset install-deps test test-api test-client
