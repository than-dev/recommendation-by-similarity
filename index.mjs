import { recommendPosts } from './src/recommend-posts.mjs';
import { data } from './data.mjs';

data.users
	.slice(0, 9)
	.forEach((user) =>
		console.log(
			`RECOMENDAÇÕES DO USUÁRIO ${user.id}`,
			recommendPosts({ userId: user.id })
		)
	);
