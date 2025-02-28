.PHONY: all stop resume clean fclean re r install-deps

install-deps:
	cd api && rm -rf node_modules package-lock.json
	cd api && sudo npm cache clean --force
	cd api && sudo npm install -g jest
	cd api && npm install
	cd api && sudo chown -R $$USER:$$USER node_modules

all: install-deps
	docker compose up --build

stop:
	docker compose stop

resume:
	docker compose start
	docker container start -a api_backend

clean:
	docker compose down
	docker container prune -f
	docker volume prune -f

fclean: clean
	docker system prune -af
	cd api && rm -rf node_modules package-lock.json

r: clean all

re: fclean all

git_reset:
	git fetch origin
	git reset --hard
