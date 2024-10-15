// !FIRST VERSION, TESTING BEHAVIOR, BEFORE REFACTOR 🇺🇸
// !PRIMEIRA VERSÃO, TESTANDO O COMPORTAMENTO, ANTES DA REFATORAÇÃO 🇧🇷

import { calcularSimilaridade } from '../math/similarity.mjs';
import { createUserVector, fillterUsers } from '../src/helper.mjs';

export function recommendPosts({ data, userId, topN, threshold = 0 }) {
	const userVector = createUserVector(userId, data.posts, data.reads);

	const filteredUsers = fillterUsers(data.users, userId);

	const similarities = filteredUsers.map((user) => {
		const otherUserVector = createUserVector(
			user.id,
			data.posts,
			data.reads
		);
		return {
			userId: user.id,
			similarity: calcularSimilaridade(userVector, otherUserVector)
		};
	});

	const similaritiesWithThresholdApplied = similarities.filter(
		({ similarity }) => similarity > threshold
	);

	const orderedSimilarities = similaritiesWithThresholdApplied.sort(
		(a, b) => b.similarity - a.similarity
	);

	console.log('SIMILARIDADES', orderedSimilarities);

	const similarUserIds = orderedSimilarities
		.map((sim) => sim.userId)
		.slice(0, topN || data.users.length / 5);

	console.log(`USUARIOS MAIS SIMILARES AO ${userId}`, similarUserIds);

	const recommendations = data.reads
		.filter(
			(read) =>
				similarUserIds.includes(read.userId) &&
				!userVector[read.postId - 1]
		)
		.map((read) => read.postId);

	const uniqueRecommendations = [...new Set(recommendations)];

	return uniqueRecommendations.map((postId) =>
		data.posts.find((post) => post.id === postId)
	);
}
