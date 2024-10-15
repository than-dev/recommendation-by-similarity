// !NORMA: A norma de um vetor é uma medida do seu comprimento, calculada como a raiz quadrada da soma dos quadrados de suas componentes. É uma ferramenta fundamental em álgebra linear e análise de dados.

// ? No contexto da similaridade do cosseno, o "cosseno" refere-se ao cosseno do ângulo entre dois vetores em um espaço vetorial. Este valor indica o quão próximos ou alinhados dois vetores estão.

// Função para calcular a similaridade do cosseno, em outras palavras, o quão "parecidos" são, seu valor varia de 0 a 1, sendo "1" relativo a idêntico
export function calcSimilarity(vecA, vecB) {
	let produtoEscalar = 0;
	let somaDoQuadradoDosValoresDeA = 0;
	let somaDoQuadradoDosValoresDeB = 0;

	for (let i = 0; i < vecA.length; i++) {
		produtoEscalar += vecA[i] * vecB[i];
		somaDoQuadradoDosValoresDeA += vecA[i] * vecA[i];
		somaDoQuadradoDosValoresDeB += vecB[i] * vecB[i];
	}

	const normaDeA = Math.sqrt(somaDoQuadradoDosValoresDeA);
	const normaDeB = Math.sqrt(somaDoQuadradoDosValoresDeB);

	return produtoEscalar / (normaDeA * normaDeB);
}
