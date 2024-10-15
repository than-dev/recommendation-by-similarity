import fs from 'node:fs/promises';

export function filterUsers(allUsers, userId) {
    const user = allUsers.find(({ id }) => id === userId);
    const currentYear = new Date().getFullYear();

    return allUsers.filter(({ country, lastAccess, id }) => {
        const userLastAccessYear = new Date(lastAccess).getFullYear();
        return (
            country === user.country &&  // Mesma região
            userLastAccessYear === currentYear &&  // Acesso recente
            id !== user.id  // Excluir o próprio usuário
        );
    });
}

// Função para criar o vetor de interações de um usuário e normalizar os dados de comparação entre dois usuarios, para que o calculo de similaridade seja feito com sucesso e seus respectivos vetores mantenham o mesmo tamanho.
export function createUserVector(userId, posts, reads) {
	const vector = new Array(posts.length).fill(0);
	reads.forEach((read) => {
		if (read.userId === userId) {
			vector[read.postId - 1] = 1;
		}
	});
	return vector;
}
