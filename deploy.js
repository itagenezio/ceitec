
const { exec } = require('child_process');

// Caminho do Git que encontramos anteriormente
const gitPath = "C:\\Program Files\\Git\\cmd\\git.exe";

console.log("🚀 INICIANDO DEPLOY AUTOMÁTICO...");

function run(command, description) {
    return new Promise((resolve) => {
        console.log(`\n👉 ${description}...`);
        exec(command, (error, stdout, stderr) => {
            if (stdout) console.log(stdout);
            if (stderr) console.log(stderr);
            if (error) {
                console.log(`⚠️ Nota: ${error.message}`);
            } else {
                console.log(`✅ Sucesso!`);
            }
            resolve();
        });
    });
}

async function deploy() {
    // 1. Adicionar arquivos
    await run(`"${gitPath}" add .`, "Adicionando arquivos");

    // 2. Commit
    await run(`"${gitPath}" commit -m "Update via Script Node"`, "Salvando alterações (Commit)");

    // 3. Push
    await run(`"${gitPath}" push origin main`, "Enviando para o GitHub (Push)");

    console.log("\n✨ PROCESSO FINALIZADO! ✨");
    console.log("Aguarde 2 minutos e verifique o site: https://ceitec.vercel.app/");
}

deploy();
