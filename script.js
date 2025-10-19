const video = document.querySelector("video");
video.volume = 0.05;

function som() {
  if (video.muted) {
    video.muted = false;
    document.getElementById("btnSom").textContent = "MUTAR";
  } else {
    video.muted = true;
    document.getElementById("btnSom").textContent = "SOM";
  }
}

const input = document.getElementById("inputNumero");
const resultado = document.getElementById("resultado");
const convertido = document.getElementById("convertido");

function converter() {
  convertido.textContent = resultado.textContent;
}

input.addEventListener("input", () => {
  const valor = input.value.trim().toUpperCase();
  if (!valor) {
    resultado.textContent = "";
    return;
  }

  if (/^\d+$/.test(valor)) {
    const numero = parseInt(valor);
    if (numero < 1 || numero > 3999) {
      resultado.textContent = "Digite um número entre 1 e 3999";
      resultado.style.color = "red";
    } else {
      const romano = decimalParaRomano(numero);
      resultado.textContent = `${numero} = ${romano}`;
      resultado.style.color = "white";
    }
  } 
  else if (/^[IVXLCDM]+$/.test(valor)) {
    const validacao = validarRomano(valor);
    if (!validacao.valido) {
      resultado.textContent = validacao.erro;
      resultado.style.color = "red";
    } else {
      const decimal = romanoParaDecimal(valor);
      resultado.textContent = `${valor} = ${decimal}`;
      resultado.style.color = "white";
    }
  } 
  else {
    resultado.textContent = "Entrada inválida!";
    resultado.style.color = "red";
  }
});

function romanoParaDecimal(romano) {
  const valores = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let total = 0;
  for (let i = 0; i < romano.length; i++) {
    const atual = valores[romano[i]];
    const proximo = valores[romano[i + 1]];
    if (proximo > atual) {
      total += proximo - atual;
      i++;
    } else {
      total += atual;
    }
  }
  return total;
}

function decimalParaRomano(num) {
  const tabela = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  let romano = '';
  for (const [valor, simbolo] of tabela) {
    while (num >= valor) {
      romano += simbolo;
      num -= valor;
    }
  }
  return romano;
}

function validarRomano(romano) {
  const valores = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  const maxRep = { I:3, X:3, C:3, M:3, V:1, L:1, D:1 };
  const subValidas = { I:['V','X'], X:['L','C'], C:['D','M'] };

  let repeticoes = 1;

  for (let i = 0; i < romano.length; i++) {
    const atual = romano[i];
    const prox = romano[i + 1];
    const anterior = romano[i - 1];

    if (!valores[atual])
      return { valido: false, erro: `Símbolo inválido "${atual}" na posição ${i + 1}` };

    if (atual === anterior) {
      repeticoes++;
      if (repeticoes > maxRep[atual])
        return { valido: false, erro: `Repetição inválida de "${atual}" na posição ${i + 1}` };
    } else {
      repeticoes = 1;
    }

    if (prox) {
      const vAtual = valores[atual];
      const vProx = valores[prox];
      if (vAtual < vProx) {
        if (!subValidas[atual] || !subValidas[atual].includes(prox))
          return { valido: false, erro: `Subtração inválida: "${atual}${prox}" na posição ${i + 1}` };
        if (anterior && valores[anterior] < vAtual)
          return { valido: false, erro: `Subtração dupla inválida próxima a "${anterior}${atual}${prox}"` };
      }
    }
  }
  return { valido: true };
}
