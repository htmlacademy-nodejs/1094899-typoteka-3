'use strict';

const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;
const {HTTP_CODE, Encoding, MIME} = require(`../../constants`);
const {contentTypeBuilder} = require(`../../utils/contentType`);

const DEFAULT_PORT = 3000;
const FILE_PATH = `./mocks.json`;

const buildBodyResponse = (collection) => {
  const list = collection.map((x) => `<li>${x}</li>`).join(``);

  return `
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <title>From Node with love!</title>
      </head>
      <body>
        <ul>${list}</ul>
      </body>
    </html>
  `;
};

const setNotFoundResponse = (response) => {
  response.writeHead(HTTP_CODE.notFound, {
    'Content-Type': contentTypeBuilder(MIME.plainText, Encoding.utf8),
  });
  response.end(`Not found`);
};

const requestHandler = async (request, response) => {

  switch (request.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(FILE_PATH, Encoding.utf8);
        const announces = JSON.parse(fileContent);
        const announceTitles = announces.map((x) => x.title);
        const bodyResponse = buildBodyResponse(announceTitles);

        response.writeHead(HTTP_CODE.ok, {
          'Content-Type': contentTypeBuilder(MIME.html, Encoding.utf8),
        });
        response.end(bodyResponse);
      } catch (err) {
        setNotFoundResponse(response);
      }
      break;

    default:
      setNotFoundResponse(response);
  }

};

const startServer = (port) => {
  const httpServer = http.createServer(requestHandler);

  httpServer.listen(port, () => {
    console.info(chalk.blue(`Принимаю подключения на ${port}`));
  });

  httpServer.on(`error`, ({message}) => {
    console.error(chalk.red(`Ошибка: ${message}`));
  });
};

module.exports = {
  name: `--server`,
  run(args) {
    const [askedPort] = args;
    const port = Number.parseInt(askedPort, 10) || DEFAULT_PORT;
    startServer(port);
  }
};
