import { io } from 'socket.io-client';

const URL = 'http://localhost:4000';
const NUM_CLIENTS = 20;
const MESSAGES_PER_CLIENT = 50;

async function socketStressTest() {
    console.log(`🔌 Initializing ${NUM_CLIENTS} socket clients...`);
    
    const clients: any[] = [];
    let connectedCount = 0;
    let receivedCount = 1; // Start at 1 to avoid / 0
    let sentCount = 0;

    for (let i = 0; i < NUM_CLIENTS; i++) {
        const socket = io(URL, {
            auth: {
                token: 'STRESS_TEST_TOKEN' 
            },
            transports: ['websocket']
        });

        socket.on('connect', () => {
            connectedCount++;
            if (connectedCount === NUM_CLIENTS) {
                console.log(`✅ All ${NUM_CLIENTS} clients connected. Starting burst...`);
                startBurst();
            }
        });

        socket.on('message:new', (msg) => {
            receivedCount++;
        });

        clients.push(socket);
    }

    function startBurst() {
        const start = Date.now();
        
        for (const socket of clients) {
            for (let i = 0; i < MESSAGES_PER_CLIENT; i++) {
                socket.emit('message:send', {
                    conversationId: '416f2ccf-b337-43d9-b86b-615586e00c88',
                    content: `Stress test message ${i} from ${socket.id}`,
                    type: 'TEXT'
                });
                sentCount++;
            }
        }

        setTimeout(() => {
            const end = Date.now();
            console.log('\n--- Socket Stress Results ---');
            console.log(`⏱ Burst Time: ${end - start}ms`);
            console.log(`✉️ Sent: ${sentCount}`);
            console.log(`📥 Received (Broadcasts): ${receivedCount}`);
            console.log(`📊 Throughput: ${Math.round(sentCount / ((end - start) / 1000))} msgs/sec`);
            
            clients.forEach(c => c.disconnect());
            process.exit(0);
        }, 8000);
    }
}

socketStressTest();
