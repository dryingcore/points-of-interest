import readline from 'readline/promises';
import { env } from 'process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const API_URL = `http://localhost:${env.SERVER_PORT || 8888}/pois`;

async function main() {
  console.log('=================================================');
  console.log('POIs Database Population & Stress Test (POST)');
  console.log(`Target URL: ${API_URL}`);
  console.log('=================================================\n');

  const xInput = await rl.question('Quantos POIs você deseja inserir com sucesso? ');
  const targetSuccesses = parseInt(xInput, 10);

  if (isNaN(targetSuccesses) || targetSuccesses <= 0) {
    console.error('Número inválido.');
    process.exit(1);
  }

  const cInput = await rl.question('Qual o limite de concorrência (padrão: 50)? ');
  let concurrency = parseInt(cInput, 10);
  if (isNaN(concurrency) || concurrency <= 0) concurrency = 50;

  console.log(`\nIniciando inserção de ${targetSuccesses} POIs com concorrência de ${concurrency}...`);
  console.log('Isso populará o seu banco de dados enviando milhares de requisições.\n');
  rl.close();

  let successCount = 0;
  let failureCount = 0;
  let inFlightPromises = 0;

  const startTime = performance.now();

  return new Promise((resolve) => {
    const replenish = () => {
      while (inFlightPromises < concurrency && successCount + inFlightPromises < targetSuccesses) {
        inFlightPromises++;
        launchRequest();
      }
    };

    const finishTest = () => {
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      console.log('\n\n=================================================');
      console.log('Teste concluído!');
      console.log(`POIs inseridos com sucesso: ${successCount}`);
      console.log(`Requisições falhas/conflito (e retentadas): ${failureCount}`);
      console.log(`Tempo total: ${duration} segundos`);
      console.log('=================================================');
      resolve(null);
    };

    const launchRequest = async () => {
      const randomX = Math.floor(Math.random() * 1000000);
      const randomY = Math.floor(Math.random() * 1000000);
      const randomId = Math.random().toString(36).substring(2, 9);
      const name = `POI Stress Test ${randomId} - ${Date.now()}`;

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, x: randomX, y: randomY }),
        });

        if (response.ok) {
          successCount++;
          process.stdout.write(`\rProgresso: ${successCount}/${targetSuccesses} (Falhas: ${failureCount})        `);
        } else {
          failureCount++;
        }
      } catch (error) {
        failureCount++;
      } finally {
        inFlightPromises--;
        
        if (successCount >= targetSuccesses) {
          if (inFlightPromises === 0) finishTest();
        } else {
          replenish();
        }
      }
    };

    replenish();
  });
}

main().catch(console.error);
