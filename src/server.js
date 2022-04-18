import http from 'http';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';

// Generator function
function* run() {
  for (let i = 0; i < 99; i++) {
    const data = {
      id: randomUUID(),
      name: `user_${i}`,
    };

    yield data;
  }
}

async function handler(request, response) {
  const readable = new Readable({
    read() {
      for (const data of run()) {
        console.log('sending...', data);

        this.push(JSON.stringify(data) + '\n');
      }
      // notify that data is over
      this.push(null);
    },
  });

  readable.pipe(response);
}

http
  .createServer(handler)
  .listen(3000)
  .on('listening', () => console.log('Server running at 3000'));
