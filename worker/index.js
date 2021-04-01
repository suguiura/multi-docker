const keys = require('./keys.js');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

function fib (index) {
    if (index < 2) {
        return 1;
    }
    array = [1, 1];
    for (i = 2; i <= index; i++) {
        array[i] = array[i - 1] + array[i - 2];
    }
    return array[index];
}

sub.on('message', (channel, message) => {
    console.log(`Processing ${message}`);
    redisClient.hset('values', message, fib(parseInt(message)));
    console.log(`Processed ${message}`);
});

sub.subscribe('insert');
