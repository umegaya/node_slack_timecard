db:
	-@docker kill testdb
	-@docker rm testdb
	docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password --name testdb mysql:5.7
	bash ./tools/initdb.sh 192.168.99.100 data password

dbsh:
	docker exec -ti testdb bash