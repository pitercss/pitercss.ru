publish:
	@echo 'Uploading files…'
	@rsync -az --delete --chmod=g+w --chown=www-data --omit-dir-times --exclude '.git' --exclude '.DS_Store' src/ pitercss.ru:/var/www/pitercss.ru/html/
	@echo 'Done.'
