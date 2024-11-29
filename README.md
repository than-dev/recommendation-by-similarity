# Como a Netflix pega seus recomendados?

Se você já se perguntou por que a Netflix recomenda séries que parecem ter sido feitas sob medida para o seu gosto, o "culpado" é um **algoritmo de similaridade**. Ele analisa seu comportamento e o compara com o de milhões de outros usuários para sugerir conteúdos que você provavelmente vai adorar. Vamos entender como isso funciona tecnicamente.

### O que é um algoritmo de similaridade?

Imagine que a Netflix tem uma lista enorme de filmes e séries, além de dados sobre o que cada usuário já assistiu e gostou. O algoritmo de similaridade cruza essas informações para encontrar **padrões** entre você e outros usuários que têm gostos parecidos.

De maneira bem simplificada, ele olha para usuários que têm comportamentos de consumo similares ao seu (ou seja, pessoas que assistiram e gostaram dos mesmos conteúdos) e recomenda o que esses usuários viram e você ainda não.

### Agora vamos para o nosso projeto!

Nosso objetivo aqui é criar um algoritmo que recomende posts (no caso de um streaming, filmes ou séries) para um usuário com base no comportamento de outros usuários semelhantes. O código que desenvolvemos busca resolver vários problemas típicos que surgem nesse tipo de tarefa.

### comparar todos os usuários? Nem pensar!

Um dos primeiros desafios que enfrentei foi: como comparar o comportamento de um usuário com **todos os outros** da plataforma? Isso não seria viável, especialmente se estivermos falando de milhares ou milhões de usuários. Para resolver isso, implementamos um filtro inicial que elimina grande parte dos usuários irrelevantes.

No código, a função `fillterUsers` faz exatamente isso:

```jsx

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
```

Aqui, restringimos os usuários que serão comparados aos que estão no **mesmo país** e que acessaram a plataforma no **mesmo ano**. Isso faz uma grande diferença, já que elimina uma enorme quantidade de dados desnecessários, focando apenas nas pessoas com mais chances de terem gostos similares ao do usuário em questão. Essa abordagem também garante que as recomendações sejam **mais relevantes**, já que as preferências podem variar muito entre diferentes países ou períodos de tempo.

### E agora? Comparar preferências

Depois de filtrar os usuários, precisamos comparar as preferências de quem restou com as do usuário atual. Para isso, criamos "vetores" que representam o comportamento de cada pessoa — ou seja, uma lista com tudo o que cada um assistiu ou interagiu. Assim, podemos ver quem tem gostos parecidos e determinar o nível de similaridade.

A função `createUserVector` cuida de montar esses vetores com base no que o usuário assistiu. Aqui começa a mágica: a gente não precisa criar recomendações do zero, mas sim olhar para o que **outros usuários parecidos** já assistiram.

```jsx

const userVector = createUserVector(userId, data.posts, data.reads);
```

### Lidando com grandes volumes de dados: um desafio constante

Outro problema que enfrentamos foi o grande volume de dados, especialmente ao calcular as similaridades. Se tentássemos comparar todos os usuários restantes com todos os possíveis posts, isso se tornaria rapidamente **inviável**. Então, ao invés de calcular a similaridade para todos os itens, implementamos um sistema de **threshold** (limite) para focar apenas nos usuários que realmente têm um nível mínimo de similaridade.

```jsx

function applyThresholdAndSort(similarities, threshold) {
    return similarities
        .filter(({ similarity }) => similarity > threshold)  // Aplica o threshold
        .sort((a, b) => b.similarity - a.similarity);  // Ordena por maior similaridade
}

```

Isso evita que o sistema perca tempo com usuários que têm pouca ou nenhuma semelhança, focando apenas nos casos que realmente importam.

### Selecionando as melhores recomendações

Depois de calcular a similaridade, pegamos os usuários mais parecidos e, finalmente, chegamos ao ponto onde fazemos as recomendações. Aqui, garantimos que os posts recomendados sejam aqueles que o usuário **ainda não viu** — afinal, de nada adianta recomendar algo que ele já assistiu.

```jsx

function getRecommendations(similarUserIds, userVector, reads) {
    return reads
        .filter(
            (read) =>
                similarUserIds.includes(read.userId) &&
                !userVector[read.postId - 1]  // Verifica se o post já foi visto
        )
        .map((read) => read.postId);
}

```

Esse trecho garante que as recomendações sejam **novas** para o usuário e estejam de acordo com os gostos de pessoas com interesses parecidos.

### Evitando duplicatas

Outro ponto importante foi evitar **recomendações duplicadas**. Ao lidar com grandes volumes de dados, é fácil acabar sugerindo o mesmo conteúdo mais de uma vez. Para resolver isso, usamos um simples método de remoção de duplicatas:

```jsx

function removeDuplicates(recommendations) {
    return [...new Set(recommendations)];
}

```

Esse pequeno ajuste garante que o usuário receba uma lista mais diversificada e sem repetição de conteúdos.

### Conclusão

Com esses passos, conseguimos construir um sistema de recomendação eficiente, que filtra, compara e sugere conteúdos de maneira otimizada. O segredo está em fazer escolhas estratégicas, como filtrar usuários e focar nas similaridades mais relevantes. Assim, o algoritmo se torna ágil e preciso, evitando o desperdício de recursos e garantindo uma experiência personalizada para cada usuário.

Na próxima vez que a Netflix te recomendar aquela série que parece perfeita para você, saiba que, por trás disso, há todo um processo técnico que envolve filtros inteligentes, cálculo de similaridade e otimização de dados — tudo pensado para oferecer a melhor recomendação possível!
