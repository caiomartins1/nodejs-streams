import axios from 'axios';
import { Transform, Writable } from 'stream';

const url = 'http://localhost:3000';

async function loadData() {
  const response = await axios({ url, method: 'get', responseType: 'stream' });

  return response.data;
}

const stream = await loadData();

stream
  .pipe(
    new Transform({
      transform(chunk, encoding, cb) {
        const item = JSON.parse(chunk);
        const index = /\d+/.exec(item.name)[0];

        if (index % 2 === 0) item.name += ' Even';
        else item.name += ' Odd';

        cb(null, JSON.stringify(item));
      },
    })
  )
  .pipe(
    new Writable({
      write(chunk, encoding, cb) {
        console.log('Got Info', chunk.toString());
        cb();
      },
    })
  );
