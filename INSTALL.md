# INSTALL

To run an instance of the Adfice webserver:

1. Obtain a copy of the code:

```
git clone -o upstream https://github.com/ace-dvm/adfice-ace.git
cd adfice-ace
```

2. Install module dependencies:

```
npm install
```

3. Create the database:

```
bin/setup-new-db-container.sh
```

4. Load data into the database. Some optional synthetic data is included:

```
bin/load-synthetic-data.sh
```

5. Start the web server on the desired port, for instance port 8080:

```
node adfice-webserver-runner.js 8080
```

Finally, browse to the server: http://localhost:8080/patient?id=1
