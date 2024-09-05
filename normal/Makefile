all: 
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

r: clean all

re: fclean all

git:
	@read -p "Enter commit message: " commit_message; \
	git add .; \
	git commit -m "$$commit_message"; \
	git push

git_reset:
	git fetch origin
	git reset --hard
